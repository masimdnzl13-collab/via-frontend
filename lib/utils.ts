export function basHarfBuyut(str: string): string {
  if (!str) return str;
  return str
    .split(' ')
    .map(kelime => kelime.charAt(0).toUpperCase() + kelime.slice(1))
    .join(' ');
}

export function ilkHarfBuyut(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}