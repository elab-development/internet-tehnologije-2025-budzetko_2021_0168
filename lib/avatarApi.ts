// lib/avatarApi.ts

export function getUserAvatar(username: string) {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;
}