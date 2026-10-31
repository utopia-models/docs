/**
 * opengraph-image — the social-share card for docs.utopiamodels.ai.
 *
 * 🔴 COPIED BYTE-FOR-BYTE FROM apps/web/app/opengraph-image.tsx IN utopia-models/utopia, deliberately.
 * Tyler, 2026-08-28: *"could you put the same message / link preview for Utopia models utopiamodels.ai
 * for docs.utopiamodels.ai... Want this same preview."* SAME preview means the same card, not a card
 * in the same style — so this file is a copy and the only intended difference is the og:title/description
 * in app/layout.tsx.
 *
 * Before this, docs.utopiamodels.ai served ZERO og: tags (measured 2026-08-28 with
 * `curl -s https://docs.utopiamodels.ai | grep -i 'og:'` → no output), so LinkedIn had nothing to render
 * and the Featured card came up bare.
 *
 * If the design changes on the main site, change it there and re-copy. Two hand-maintained copies of one
 * card WILL drift — that is the whole lesson of this session's doc audit.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Utopia Models";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Read the bronze mark from disk (Satori can't reliably fetch a same-deploy URL) and
  // inline it as a data-URI so it always renders.
  const markData = await readFile(join(process.cwd(), "public", "og-mark.png"));
  const markUrl = `data:image/png;base64,${markData.toString("base64")}`;
  // OPTION 13 (Tyler-chosen): mark-DOMINANT hero — a large bronze mark centered with the
  // spaced "UTOPIA MODELS" wordmark below it (the Vercel-style premium mark-hero). A soft
  // amber backlight glows behind the mark.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#07060d",
          // soft radial backlight behind the big mark
          backgroundImage:
            "radial-gradient(circle at 50% 44%, rgba(176,110,60,0.22), rgba(7,6,13,0) 50%)",
          color: "#f2efe9",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markUrl} width={300} height={300} alt="" style={{ objectFit: "contain" }} />
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "0.32em",
            paddingLeft: "0.32em",
            color: "#d6c4aa",
          }}
        >
          UTOPIA MODELS
        </div>
      </div>
    ),
    { ...size },
  );
}
