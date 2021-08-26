
// @ts-check

const { assert } = require('./index');

try {
  assert(Math.random() === 0);
} catch (e) {
  assert(e.name === 'AssertionError');
  assert(e.code === 'ERR_ASSERTION_ERROR');
  assert(e.message === 'Assertion error.');
}