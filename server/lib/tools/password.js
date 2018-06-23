import bcrypt from 'bcrypt';

export async function compareHash(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function passwordHash(password) {
  const result = await bcrypt.hash(password, 10);
  return result;
}
