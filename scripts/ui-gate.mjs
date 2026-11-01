// ui-gate.mjs — the UI CI floor for a site repo (utopia-models/knowledge#10976). Canonical copy:
// utopia-models/knowledge _infra/ci/ui-gate/ui-gate.mjs — each site repo carries a byte-identical copy in scripts/.
//
//   node ui-gate.mjs <base-url> [route ...] [--baseline-out <file>]
//
// Routes default to design/ui-gate.json "routes" (read from the cwd), else "/". For every route it FAILS (exit 1) on:
//   · any Impeccable P0 — an `impeccable@4.8.0 detect` finding of severity "error" (the catalog's top tier:
//     script-error, content-hidden-at-rest), scanned over CDP in Chromium at 1440x900 and 390x844. Warnings and
//     advisories are annotated, never fail; so is a script-error thrown inside ANOTHER origin's frame (an embedded
//     Google Sheet, a third-party widget), which no PR to this repo can fix;
//   · any axe-core violation (WCAG 2.0/2.1/2.2 A+AA + best-practice) at 1440x900 Chromium and 390x844 WebKit that is
//     not in design/ui-gate.json "axe_baseline" ("<route> <rule-id>"): the debt recorded at adoption, burned down
//     over time. A NEW violation always fails.
// --baseline-out writes every axe "<route> <rule-id>" seen — how a baseline is recorded, against PRODUCTION only.
// Exit 2 = could not check (no route answered).
//
// Each browser is launched by this script with a private profile and `--remote-debugging-port=0`, and Impeccable
// is pointed at the port Chromium wrote to that profile's DevToolsActivePort — never a guessed port: a box can
// have another session's logged-in browser listening on a fixed one.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, webkit } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const argv = process.argv.slice(2);
const bi = argv.indexOf('--baseline-out');
const baselineOut = bi >= 0 ? argv.splice(bi, 2)[1] : '';
const [base, ...argRoutes] = argv;
if (!base) { console.error('usage: ui-gate.mjs <base-url> [route ...] [--baseline-out <file>]'); process.exit(2); }
const cfg = existsSync('design/ui-gate.json') ? JSON.parse(readFileSync('design/ui-gate.json', 'utf8')) : {};
const routes = argRoutes.length ? argRoutes : (cfg.routes || ['/']);
const baseline = new Set(cfg.axe_baseline || []);
const url = r => new URL(r, base).toString();
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const out = s => console.log(s);
const clip = (s, n = 900) => String(s).replace(/\s+/g, ' ').slice(0, n);
let failed = 0, answered = 0;
const seen = new Set();

const runs = [
  { name: 'chromium-1440x900', type: chromium, impeccable: true, axe: true, ctx: { viewport: { width: 1440, height: 900 } } },
  { name: 'chromium-390x844', type: chromium, impeccable: true, axe: false, ctx: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  { name: 'webkit-390x844', type: webkit, impeccable: false, axe: true, ctx: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
];

for (const run of runs) {
  const profile = mkdtempSync(join(tmpdir(), 'ui-gate-'));
  const args = run.type === chromium ? ['--remote-debugging-port=0', '--no-sandbox'] : [];
  const ctx = await run.type.launchPersistentContext(profile, { ...run.ctx, args });
  let port = '';
  if (run.impeccable) {
    for (let i = 0; i < 100 && !existsSync(join(profile, 'DevToolsActivePort')); i++) await new Promise(r => setTimeout(r, 100));
    port = existsSync(join(profile, 'DevToolsActivePort')) ? readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim() : '';
    if (!port) { out(`::error::${run.name}: Chromium wrote no DevToolsActivePort — Impeccable cannot scan`); failed = 1; }
  }
  for (const r of routes) {
    const page = ctx.pages()[0] || await ctx.newPage();
    const res = await page.goto(url(r), { waitUntil: 'load', timeout: 45000 }).catch(e => { out(`::error::${run.name} ${r}: ${clip(e.message.split('\n')[0])}`); return null; });
    if (!res) { failed = 1; continue; }
    answered++;
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);

    if (run.impeccable && port) {
      let raw = '', ok = false;
      try { raw = execFileSync('npx', ['--yes', 'impeccable@4.8.0', 'detect', '--json', '--no-advisory', '--cdp', port, '--target', page.url()],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, IMPECCABLE_NO_TELEMETRY: '1' }, timeout: 120000 }); ok = true; }
      catch (e) { raw = e.stdout || ''; ok = e.status === 2; if (!ok) out(`::error::impeccable could not scan ${url(r)} (${run.name}): ${clip(e.stderr || e.message, 300)}`); }
      if (!ok) failed = 1;
      let findings = [];
      try { findings = JSON.parse(raw || '[]'); } catch { if (ok) { out(`::error::impeccable output unparseable for ${url(r)}`); failed = 1; } }
      let p0 = 0;
      for (const f of findings) {
        const where = clip(`${f.selector || ''} ${f.snippet || ''}`, 300);
        // a script-error thrown by ANOTHER origin's frame (an embedded Sheet, a widget) is not this repo's code
        const src = f.antipattern === 'script-error' && /\(at [^)]*?(https?:\/\/[^/)\s]+)/.exec(f.snippet || '');
        if (src && new URL(src[1]).host !== new URL(base).host) { out(`::warning title=Impeccable ${f.antipattern} (third-party frame)::${run.name} ${r} ${where}`); continue; }
        if (f.severity === 'error') { p0++; failed = 1; out(`::error title=Impeccable P0 ${f.antipattern}::${run.name} ${r} ${where} — ${clip(f.description, 400)}`); }
        else out(`::warning title=Impeccable ${f.antipattern}::${run.name} ${r} ${where}`);
      }
      out(`impeccable ${run.name} ${r}: ${findings.length} finding(s), first-party P0 ${p0}`);
    }

    if (run.axe) {
      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      let fresh = 0;
      for (const v of violations) {
        const key = `${r} ${v.id}`;
        seen.add(key);
        if (baseline.has(key)) { out(`::warning title=axe ${v.id} (baseline)::${run.name} ${r} — ${v.help} (${v.nodes.length} node(s))`); continue; }
        fresh++; failed = 1;
        out(`::error title=axe ${v.id} (${v.impact})::${run.name} ${r} — ${v.help}: ${clip(v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | '), 600)}`);
      }
      out(`axe ${run.name} ${r}: ${violations.length} violation(s), ${fresh} not in baseline`);
    }
  }
  await ctx.close();
  rmSync(profile, { recursive: true, force: true });
}

if (baselineOut) { writeFileSync(baselineOut, JSON.stringify([...seen].sort(), null, 2) + '\n'); out(`baseline: ${seen.size} entr(ies) → ${baselineOut}`); }
if (!answered) { console.error('ui-gate: no route answered — could not check'); process.exit(2); }
out(failed ? 'ui-gate: FAIL' : 'ui-gate: PASS');
process.exit(failed);
