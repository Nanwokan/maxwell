import assert from 'node:assert/strict';
import test from 'node:test';

import { isSafeAnchorOrLink, isSafeHttpUrl, isSafeLink } from './safe-url';

test('isSafeHttpUrl allows only http and https schemes', () => {
  assert.equal(isSafeHttpUrl('https://example.com/path'), true);
  assert.equal(isSafeHttpUrl('http://localhost:4000/api'), true);
  assert.equal(isSafeHttpUrl('mailto:test@example.com'), false);
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
});

test('isSafeLink accepts relative and approved absolute URLs', () => {
  assert.equal(isSafeLink('#section'), true);
  assert.equal(isSafeLink('/legal/privacy.html'), true);
  assert.equal(isSafeLink('./legal/mentions-legales.html'), true);
  assert.equal(isSafeLink('https://example.com'), true);
  assert.equal(isSafeLink('mailto:hello@example.com'), true);
  assert.equal(isSafeLink('javascript:alert(1)'), false);
});

test('isSafeAnchorOrLink supports in-page targets and safe links', () => {
  assert.equal(isSafeAnchorOrLink('#contact'), true);
  assert.equal(isSafeAnchorOrLink('https://example.com'), true);
  assert.equal(isSafeAnchorOrLink('javascript:alert(1)'), false);
});
