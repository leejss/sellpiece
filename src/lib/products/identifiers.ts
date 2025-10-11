import { randomBytes } from 'crypto';

// Create a 4-char uppercase base36 string
function randomBase36(len: number) {
  const bytes = randomBytes(len);
  return Array.from(bytes)
    .map((b) => (b % 36).toString(36))
    .join('')
    .toUpperCase()
    .slice(0, len);
}

// Get YYMMDD string from date
function yymmdd(d = new Date()) {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

// Normalize to code prefix (3 letters)
export function toCodePrefix(input: string | null | undefined) {
  const base = (input ?? 'GEN').replace(/[^a-zA-Z]/g, '');
  const letters = (base || 'GEN').slice(0, 3).toUpperCase().padEnd(3, 'X');
  return letters;
}

// Pattern A: PREFIX-YYMMDD-RAND4
export function generateSku(prefix: string) {
  return `${toCodePrefix(prefix)}-${yymmdd()}-${randomBase36(4)}`;
}

// EAN-13 checksum calculation
function ean13Checksum(first12: string) {
  const digits = first12.split('').map((c) => parseInt(c, 10));
  const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
  const mod = sum % 10;
  return (10 - mod) % 10;
}

// Generate EAN-13 with 13 digits. Use 20 as prefix to designate internal codes.
export function generateEan13() {
  const body = `20${Math.floor(Math.random() * 1e10)
    .toString()
    .padStart(10, '0')}`; // 12 digits
  const checksum = ean13Checksum(body);
  return `${body}${checksum}`;
}
