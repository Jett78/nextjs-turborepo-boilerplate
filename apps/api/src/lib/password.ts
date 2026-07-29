import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const SCRYPT_OPTIONS = { N: 65536, r: 8, p: 4, maxmem: 128 * 1024 * 1024 };

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(data: {
  password: string;
  hash: string;
}): Promise<boolean> {
  const [salt, hash] = data.hash.split(':');
  const derivedKey = scryptSync(data.password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  const hashBuffer = Buffer.from(hash, 'hex');
  if (derivedKey.length !== hashBuffer.length) return false;
  return timingSafeEqual(derivedKey, hashBuffer);
}
