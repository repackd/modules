
// @ts-check

// https://core.telegram.org/bots/api#markdownv2-style


const { assert } = require('@repackd/assertion');
const undici2 = require('@repackd/undici2');


/**
 * @type {import('./index').post_form}
 */
const post_form = async (url, body) => {
  assert(typeof url === 'string');
  assert(body instanceof Object);
  const response = await undici2.request({ url, method: 'POST', multipart: body });
  return response;
};


/**
 * @type {import('./index').post_json}
 */
const post_json = async (url, body) => {
  assert(typeof url === 'string');
  assert(body instanceof Object);
  const response = await undici2.request({ url, method: 'POST', json: body });
  return response;
};


/**
 * @type {import('./index').create_endpoint}
 */
const create_endpoint = (token, method) => {
  assert(typeof token === 'string');
  assert(typeof method === 'string');
  return `https://api.telegram.org/bot${token}/${method}`;
};


/**
 * @type {import('./index').send_message}
 */
const send_message = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.chat_id === 'number');
  assert(typeof body.text === 'string');
  const response = await post_json(create_endpoint(token, 'sendMessage'), body);
  return response;
};


/**
 * @type {import('./index').delete_message}
 */
const delete_message = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.chat_id === 'number');
  assert(typeof body.message_id === 'number');
  const response = await post_json(create_endpoint(token, 'deleteMessage'), body);
  return response;
};


/**
 * @type {import('./index').send_photo}
 */
const send_photo = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.chat_id === 'number');
  assert(body.caption === undefined || typeof body.caption === 'string');
  assert(body.photo instanceof Buffer);
  const response = await post_form(create_endpoint(token, 'sendPhoto'), body);
  return response;
};


/**
 * @type {import('./index').delete_webhook}
 */
const delete_webhook = async (token) => {
  assert(typeof token === 'string');
  const response = await post_json(create_endpoint(token, 'deleteWebhook'), {});
  return response;
};


/**
 * @type {import('./index').set_webhook}
 */
const set_webhook = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.url === 'string');
  assert(typeof body.max_connections === 'number');
  assert(body.allowed_updates instanceof Array);
  const response = await post_json(create_endpoint(token, 'setWebhook'), body);
  return response;
};


/**
 * @type {import('./index').get_updates}
 */
const get_updates = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(body.offset === undefined || typeof body.offset === 'number');
  assert(body.allowed_updates instanceof Array);
  const response = await post_json(create_endpoint(token, 'getUpdates'), body);
  assert(response instanceof Object);
  return response;
};


/**
 * @type {import('./index').get_me}
 */
const get_me = async (token) => {
  assert(typeof token === 'string');
  const response = await post_json(create_endpoint(token, 'getMe'), {});
  assert(response instanceof Object);
  return response;
};


/**
 * @type {import('./index').get_chat_administrators}
 */
const get_chat_administrators = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.chat_id === 'number');
  const response = await post_json(create_endpoint(token, 'getChatAdministrators'), body);
  return response;
};


/**
 * @type {import('./index').encode_code}
 */
const encode_code = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`');
};


/**
 * @type {import('./index').encode_url}
 */
const encode_url = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\)/g, '\\)');
};


/**
 * @type {import('./index').encode_text}
 */
const encode_text = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
};


module.exports = {
  post_form,
  post_json,
  create_endpoint,
  send_message,
  delete_message,
  send_photo,
  delete_webhook,
  set_webhook,
  get_updates,
  get_me,
  get_chat_administrators,
  encode_code,
  encode_url,
  encode_text,
};