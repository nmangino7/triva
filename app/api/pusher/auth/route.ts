import { getPusherServer } from '@/app/lib/pusher-server';
import { CHANNEL_PREFIX } from '@/app/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Presence-channel authorization. pusher-js sends form-encoded
// socket_id + channel_name, plus our identity params (user_id, name, role).
export async function POST(request: Request) {
  const form = await request.formData();
  const socketId = String(form.get('socket_id') ?? '');
  const channel = String(form.get('channel_name') ?? '');
  const userId = String(form.get('user_id') ?? '');
  const name = String(form.get('name') ?? 'Player').slice(0, 24);
  const role = form.get('role') === 'host' ? 'host' : 'player';

  if (!socketId || !channel.startsWith(CHANNEL_PREFIX) || !userId) {
    return new Response('Forbidden', { status: 403 });
  }

  const auth = getPusherServer().authorizeChannel(socketId, channel, {
    user_id: userId,
    user_info: { name, role },
  });

  return Response.json(auth);
}
