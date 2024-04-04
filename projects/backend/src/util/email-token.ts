import * as crypto from 'crypto';
function generateUniqueToken(
  uuid1: string,
  uuid2: string,
  email: string,
): string {
  const hash = crypto.createHash('sha256');
  hash.update(uuid1 + uuid2 + email + Date.now());
  return hash.digest('hex');
}

export default function generateToken(email: string) {
  const uuid1 = crypto.randomBytes(16).toString('hex');
  const uuid2 = crypto.randomUUID();
  return generateUniqueToken(uuid1, uuid2, email);
}
