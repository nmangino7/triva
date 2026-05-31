'use client';

import PusherJS from 'pusher-js';
import type { Role, Avatar } from '@/app/types';

// Create a browser Pusher client whose presence-auth requests carry this
// member's identity (uuid + display name + role + avatar). pusher-js forwards
// `auth.params` to the auth endpoint as the POST body.
export function createPusherClient(identity: {
  userId: string;
  name: string;
  role: Role;
  avatar?: Avatar;
}) {
  return new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
    auth: {
      params: {
        user_id: identity.userId,
        name: identity.name,
        role: identity.role,
        avatarColor: identity.avatar?.color ?? '',
        avatarEmoji: identity.avatar?.emoji ?? '',
      },
    },
  });
}
