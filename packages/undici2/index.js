
// @ts-check

const zlib = require('zlib');
const util = require('util');
const undici = require('undici');
const multipart = require('multi-part');
const { assert } = require('@joshxyzhimself/assert');


const async_brotli_decompress = util.promisify(zlib.brotliDecompress);
const async_gunzip = util.promisify(zlib.gunzip);


/**
 *
 * @type {import('./index').get_response_body}
 */
const get_response_body = (response) => new Promise((resolve, reject) => {
  assert(response.body instanceof Object);
  assert(response.body.on instanceof Function);
  const buffer_chunks = [];
  response.body.on('data', (buffer_chunk) => {
    assert(buffer_chunk instanceof Buffer);
    buffer_chunks.push(buffer_chunk);
  });
  response.body.on('end', async () => {
    let buffer = buffer_chunks.length > 0 ? Buffer.concat(buffer_chunks) : null;

    const content_encoding = response.headers['content-encoding'];
    if (typeof content_encoding === 'string') {
      if (content_encoding.includes('gzip') === true) {
        buffer = await async_gunzip(buffer);
      } else if (content_encoding.includes('br') === true) {
        buffer = await async_brotli_decompress(buffer);
      }
    }

    const response_body = { json: null, string: null, buffer };

    if (buffer instanceof Buffer) {
      const content_type = response.headers['content-type'];
      if (typeof content_type === 'string') {
        if (
          content_type.includes('text/plain') === true
          || content_type.includes('text/html') === true
          || content_type.includes('text/csv') === true
          || content_type.includes('text/tab-separated-values') === true
          || content_type.includes('text/css') === true
          || content_type.includes('application/json') === true
          || content_type.includes('application/javascript') === true
        ) {
          response_body.string = buffer.toString('utf-8');
        }
        if (content_type.includes('application/json') === true) {
          try {
            response_body.json = JSON.parse(response_body.string);
          } catch (e) {
            reject(e);
            return;
          }
        }
      }
    }
    resolve(response_body);
  });
});


/**
 * @type {import('./index').request}
 */
const request = async (request_options) => {
  assert(request_options instanceof Object);
  assert(typeof request_options.method === 'string');
  assert(typeof request_options.url === 'string');
  assert(request_options.headers === undefined || request_options.headers instanceof Object);
  assert(request_options.urlencoded === undefined || request_options.urlencoded instanceof Object);
  assert(request_options.json === undefined || request_options.json instanceof Object);
  assert(request_options.multipart === undefined || request_options.multipart instanceof Object);
  assert(request_options.buffer === undefined || typeof request_options.buffer === 'string' || request_options.buffer instanceof Buffer);
  assert(request_options.signal === undefined || request_options.signal instanceof AbortSignal);
  const request_headers = { ...request_options.headers };
  let request_body;
  if (request_options.method === 'GET' || request_options.method === 'HEAD') {
    assert(request_options.urlencoded === undefined);
    assert(request_options.json === undefined);
    assert(request_options.multipart === undefined);
  } else if (request_options.urlencoded instanceof Object) {
    assert(request_options.json === undefined);
    assert(request_options.multipart === undefined);
    assert(request_options.buffer === undefined);
    request_body = new URLSearchParams(request_options.urlencoded).toString();
    request_headers['content-type'] = 'application/x-www-form-urlencoded';
  } else if (request_options.json instanceof Object) {
    assert(request_options.urlencoded === undefined);
    assert(request_options.multipart === undefined);
    assert(request_options.buffer === undefined);
    request_body = JSON.stringify(request_options.json);
    request_headers['content-type'] = 'application/json';
  } else if (request_options.multipart instanceof Object) {
    assert(request_options.urlencoded === undefined);
    assert(request_options.json === undefined);
    assert(request_options.buffer === undefined);
    const form = new multipart();
    Object.entries(request_options.multipart).forEach((entry) => {
      const [key, value] = entry;
      form.append(key, value);
    });
    const form_buffer = await form.buffer();
    const form_headers = form.getHeaders(false);
    request_body = form_buffer;
    Object.assign(request_headers, form_headers);
  } else if (typeof request_options.buffer === 'string' || request_options.buffer instanceof Buffer) {
    assert(request_options.urlencoded === undefined);
    assert(request_options.json === undefined);
    assert(request_options.multipart === undefined);
    request_body = request_options.buffer;
    request_headers['content-type'] = 'application/octet-stream';
  }
  const request_signal = request_options.signal;
  const undici_response = await undici.request(request_options.url, {

    // @ts-ignore
    method: request_options.method,

    headers: request_headers,
    body: request_body,
    signal: request_signal,
  });
  const status = undici_response.statusCode;
  const headers = undici_response.headers;
  const body = await get_response_body(undici_response);
  const response = { status, headers, body };
  return response;
};


module.exports = { request };