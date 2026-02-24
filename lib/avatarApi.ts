// lib/avatarApi.ts

export function getUserAvatar(username: string) {
  // Koristimo "identicon" stil jer je matematički i super izgleda za finansije
  // Možeš promeniti "identicon" u "avataaars" ako želiš ljudske likove
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;
}