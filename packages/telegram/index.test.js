
// @ts-check

const fs = require('fs');
const { assert } = require('@joshxyzhimself/assert');
const fs2 = require('@joshxyzhimself/fs2');
const telegram = require('./index.js');


process.nextTick(async () => {


  const config = await fs2.read_json(fs2.pfcwd('test.config.json'));


  /**
   * @type {number}
   */
  const telegram_chat_id = config.telegram_chat_id;
  assert(typeof telegram_chat_id === 'number');


  /**
   * @type {string}
   */
  const telegram_token = config.telegram_token;
  assert(typeof telegram_token === 'string');


  const test_image_buffer = await fs.promises.readFile(fs2.pj(__dirname, 'test.png'));


  const response = await telegram.get_me(telegram_token);
  console.log({ response });


  await telegram.send_message(telegram_token, {
    chat_id: telegram_chat_id,
    parse_mode: 'MarkdownV2',
    text: 'test',
  });


  await telegram.send_photo(telegram_token, {
    chat_id: telegram_chat_id,
    parse_mode: 'MarkdownV2',
    caption: 'test',
    photo: test_image_buffer,
  });
});