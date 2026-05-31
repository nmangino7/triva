'use client';

import { Avatar as AvatarType } from '@/app/types';
import { AVATAR_COLOR_CLASS } from '@/app/lib/constants';

interface Props {
  avatar?: AvatarType;
  size?: 'sm' | 'md' | 'lg';
  ring?: boolean;
}

const SIZES = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-11 h-11 text-2xl',
  lg: 'w-16 h-16 text-4xl',
};

export default function Avatar({ avatar, size = 'md', ring }: Props) {
  const colorClass = (avatar && AVATAR_COLOR_CLASS[avatar.color]) || 'bg-gray-400';
  const emoji = avatar?.emoji || '🙂';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full shadow ${colorClass} ${SIZES[size]} ${
        ring ? 'ring-2 ring-white/70' : ''
      }`}
    >
      {emoji}
    </span>
  );
}
