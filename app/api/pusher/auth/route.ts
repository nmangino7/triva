import { getPusherServer } from '@/app/lib/pusher-server';
import { CHANNEL_PREFIX, AVATAR_COLORS, AVATAR_EMOJIS } from '@/app/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Presence-channel authorization. pusher-js sends form-encoded
// socket_id + channel_name, plus our identity params (user_id, name, role, avatar).
export async function POST(request: Request) {
  const form = await request.formData();
  const socketId = String(form.get('socket_id') ?? '');
  const channel = String(form.get('channel_name') ?? '');
  const userId = String(form.get('user_id') ?? '');
  const name = String(form.get('name') ?? 'Player').slice(0, 24);
  const role = form.get('role') === 'host' ? 'host' : 'player';

  // Validate avatar against allowlists (user_info shows on the shared screen).
  const rawColor = String(form.get('avatarColor') ?? '');
  const rawEmoji = String(form.get('avatarEmoji') ?? '');
  const color = AVATAR_COLORS.includes(rawColor) ? rawColor : undefined;
  const emoji = AVATAR_EMOJIS.includes(rawEmoji) ? rawEmoji : undefined;
  const avatar = color && emoji ? { color, emoji } : undefined;

  if (!socketId || !channel.startsWith(CHANNEL_PREFIX) || !userId) {
    return new Response('Forbidden', { status: 403 });
  }

  const auth = getPusherServer().authorizeChannel(socketId, channel, {
    user_id: userId,
    user_info: { name, role, ...(avatar ? { avatar } : {}) },
  });

  return Response.json(auth);
}
