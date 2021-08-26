
// @ts-check

const { create_emitter } = require('./index');
const { assert } = require('@repackd/assertion');

process.nextTick(async () => {


  const emitter = create_emitter();


  let listener_1_emitted = null;
  let listener_1_emitted_value = null;
  let listener_2_emitted = null;
  let listener_2_emitted_value = null;


  const listener_1 = (value) => {
    listener_1_emitted = true;
    listener_1_emitted_value = value;
  };
  const listener_2 = (value) => {
    listener_2_emitted = true;
    listener_2_emitted_value = value;
  };


  listener_1_emitted = null;
  listener_1_emitted_value = null;
  listener_2_emitted = null;
  listener_2_emitted_value = null;
  emitter.on('test-event', listener_1);
  emitter.on('test-event', listener_2);
  emitter.emit('test-event', 'test');
  assert(listener_1_emitted === true);
  assert(listener_1_emitted_value === 'test');
  assert(listener_2_emitted === true);
  assert(listener_2_emitted_value === 'test');


  listener_1_emitted = null;
  listener_1_emitted_value = null;
  listener_2_emitted = null;
  listener_2_emitted_value = null;
  emitter.off('test-event', listener_1);
  emitter.emit('test-event', 'test');
  assert(listener_1_emitted === null);
  assert(listener_1_emitted_value === null);
  assert(listener_2_emitted === true);
  assert(listener_2_emitted_value === 'test');


  listener_1_emitted = null;
  listener_1_emitted_value = null;
  listener_2_emitted = null;
  listener_2_emitted_value = null;
  emitter.off('test-event', listener_2);
  emitter.emit('test-event', 'test');
  assert(listener_1_emitted === null);
  assert(listener_1_emitted_value === null);
  assert(listener_2_emitted === null);
  assert(listener_2_emitted_value === null);


});