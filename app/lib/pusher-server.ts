import Pusher from 'pusher';

// Server-side Pusher instance. Reads secrets lazily so the module is
// safe to import in serverless route handlers. Never bundled to client
// (no NEXT_PUBLIC_ prefix on the secret vars).
let instance: Pusher | null = null;

export function getPusherServer(): Pusher {
  if (!instance) {
    instance = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return instance;
}
