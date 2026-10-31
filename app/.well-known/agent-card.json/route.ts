import card from '@/lib/a2a/agent-card.json';

/**
 * The fleet's A2A v1.0 Agent Card (A2A spec §14.3, `/.well-known/agent-card.json`) — knowledge#10740.
 *
 * `lib/a2a/agent-card.json` is GENERATED, never hand-edited: it is the byte-exact output of
 * `python wi/work/_tools/atlas/a2a_server.py card` in utopia-models/knowledge, the same definition the
 * live endpoint serves at https://novaserver.tail4016d7.ts.net/a2a/.well-known/agent-card.json.
 * Change the card there, regenerate, copy. Validate the deployed copy with
 * `a2a_server.py validate https://docs.utopiamodels.ai/.well-known/agent-card.json` (the a2a-sdk's own parser
 * plus its REQUIRED-field validator).
 */
export const revalidate = false;

export function GET() {
  return Response.json(card, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
