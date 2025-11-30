import { faker } from '@faker-js/faker';
import Avatar from 'boring-avatars';

type AvatarVariant =
  | 'marble'
  | 'beam'
  | 'pixel'
  | 'sunset'
  | 'ring'
  | 'bauhaus';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = hash * 31 + char;
  }
  return Math.abs(hash);
}

export function getGeneratedName(seed: string): string {
  if (!seed) {
    return 'Anonymous';
  }
  const hash = hashString(seed);
  faker.seed(hash);
  return faker.person.fullName();
}

type UserAvatarProps = {
  seed: string;
  size?: number;
  variant?: AvatarVariant;
  colors?: string[];
};

export function UserAvatar({
  seed,
  size = 32,
  variant = 'marble',
  colors,
}: UserAvatarProps) {
  return (
    <Avatar
      colors={colors}
      name={seed || 'anonymous'}
      size={size}
      variant={variant}
    />
  );
}
