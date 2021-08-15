
// @ts-check

const { assert } = require('./index');

try {
  assert(Math.random() === 0);
} catch (e) {
  console.error(e);
  console.error(JSON.stringify(e, null, 2));
}