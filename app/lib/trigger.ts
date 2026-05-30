'use client';

// Client helper: ask the server to broadcast an event onto a channel.
// Keeps the Pusher secret server-side (we never use client events).
export async function triggerEvent(channel: string, event: string, data: unknown): Promise<void> {
  try {
    await fetch('/api/pusher/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, event, data }),
    });
  } catch {
    // Best-effort; presence resync (rebroadcast on member_added) covers drops.
  }
}
