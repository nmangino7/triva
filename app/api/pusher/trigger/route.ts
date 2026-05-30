import { getPusherServer } from '@/app/lib/pusher-server';
import { CHANNEL_PREFIX } from '@/app/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Broadcast a game event onto a room channel. Validates the channel prefix
// so this route can't be abused to publish to arbitrary channels.
export async function POST(request: Request) {
  let body: { channel?: string; event?: string; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { channel, event, data } = body;
  if (!channel || !event || !channel.startsWith(CHANNEL_PREFIX)) {
    return new Response('Forbidden', { status: 403 });
  }

  await getPusherServer().trigger(channel, event, data ?? {});
  return Response.json({ ok: true });
}
