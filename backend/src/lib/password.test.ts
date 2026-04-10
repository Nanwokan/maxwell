import assert from 'node:assert/strict';
import test from 'node:test';

import { hashPassword, verifyPassword } from './password';

test('hashPassword prefixes hashes with scrypt and verifies correctly', async () => {
  const hash = await hashPassword('MyStrongPassword123!');
  assert.match(hash, /^scrypt\$/);
  assert.equal(await verifyPassword('MyStrongPassword123!', hash), true);
  assert.equal(await verifyPassword('WrongPassword!', hash), false);
});

test('verifyPassword rejects malformed hashes', async () => {
  assert.equal(await verifyPassword('anything', 'invalid-hash'), false);
});
