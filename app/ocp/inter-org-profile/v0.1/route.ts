import profile from '@/lib/a2a/ocp-inter-org-profile-v0.1.json';

/**
 * The OCP Inter-Org Profile v0.1 draft — the URI of the `capabilities.extensions` entry in the fleet's Agent Card
 * (knowledge#10740), so the extension URI resolves to the document that defines it.
 *
 * `lib/a2a/ocp-inter-org-profile-v0.1.json` wraps a COPY of `wi/work/specs/10740-atlas-inter-fleet/profile-v0.1.md`
 * in utopia-models/knowledge (private): every tracked revision lands there first, then is re-wrapped here with
 * `python3 -c "import json;json.dump({'source':…,'markdown':open(P).read()},open(OUT,'w'),indent=1)"`.
 * A JSON import, not a filesystem read, so the serverless bundle always carries it.
 */
export const revalidate = false;

export function GET() {
  return new Response(profile.markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
