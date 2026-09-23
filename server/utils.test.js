// Minimal unit tests (bonus: Unit Tests). Run with: npx jest utils.test.js
// Or adapt to your preferred runner (mocha, vitest).
const bcrypt = require('bcryptjs');

test('bcrypt hashes and verifies a password correctly', async () => {
  const plain = 'Test@1234';
  const hash = await bcrypt.hash(plain, 10);
  expect(hash).not.toBe(plain);
  expect(await bcrypt.compare(plain, hash)).toBe(true);
  expect(await bcrypt.compare('wrong', hash)).toBe(false);
});

test('email regex rejects malformed addresses', () => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  expect(re.test('user@example.com')).toBe(true);
  expect(re.test('not-an-email')).toBe(false);
});
