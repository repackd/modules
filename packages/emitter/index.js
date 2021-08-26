
// @ts-check

const { assert } = require('@repackd/assertion');

/**
 * @type {import('./index').create_emitter}
 */
const create_emitter = () => {

  /**
   * @type {import('./index').index}
   */
  const index = new Map();

  /**
   * @type {import('./index').on}
   */
  const on = (id, listener) => {
    assert(typeof id === 'string' || typeof id === 'number', 'ERR_EMITTER_INVALID_EVENT_ID', 'Invalid event id.');
    assert(listener instanceof Function, 'ERR_EMITTER_INVALID_EVENT_LISTENER', 'Invalid event listener.');
    if (index.has(id) === false) {
      index.set(id, new Set());
    }
    const listeners = index.get(id);
    if (listeners.has(listener) === false) {
      listeners.add(listener);
    }
  };

  /**
   * @type {import('./index').off}
   */
  const off = (id, listener) => {
    assert(typeof id === 'string' || typeof id === 'number', 'ERR_EMITTER_INVALID_EVENT_ID', 'Invalid event id.');
    assert(listener instanceof Function, 'ERR_EMITTER_INVALID_EVENT_LISTENER', 'Invalid event listener.');
    assert(index.has(id) === true, 'ERR_EMITTER_INVALID_EVENT_ID', 'Invalid event id.');
    const listeners = index.get(id);
    if (listeners.has(listener) === true) {
      listeners.delete(listener);
    }
    if (listeners.size === 0) {
      index.delete(id);
    }
  };

  /**
   * @type {import('./index').emit}
   */
  const emit = (id, ...args) => {
    assert(typeof id === 'string' || typeof id === 'number', 'ERR_EMITTER_INVALID_EVENT_ID', 'Invalid event id.');
    if (index.has(id) == true) {
      const listeners = index.get(id);
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  };

  /**
   * @type {import('./index').emitter}
   */
  const emitter = { on, off, emit };
  return emitter;
};

module.exports = { create_emitter };