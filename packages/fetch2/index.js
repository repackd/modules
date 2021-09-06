// @ts-check


// [x] url required
// [x] method required
// [x] request json
// [ ] request urlencoded
// [ ] request multipart
// [x] response json
// [ ] response text
// [ ] response blob
// [ ] response arraybuffer
// [ ] response objecturl


const { assert } = require('@repackd/assertion');


/**
 * @type {import('./index').fetch2}
 */
const fetch2 = async (request_options) => {
  assert(request_options instanceof Object);
  assert(typeof request_options.url === 'string');
  assert(typeof request_options.method === 'string');
  assert(request_options.headers === undefined || request_options.headers instanceof Object);
  assert(request_options.json === undefined || request_options.json instanceof Object);


  /**
   * @type {RequestInit}
   */
  const fetch_options = {
    method: request_options.method,
    headers: { ...request_options.headers },
    body: null,
  };


  if (request_options.json instanceof Object) {
    assert(fetch_options.method === 'POST');
    fetch_options.headers['Content-Type'] = 'application/json';
    fetch_options.body = JSON.stringify(request_options.json);
  }


  const fetch_response = await fetch(request_options.url, fetch_options);
  const response_status = fetch_response.status;
  const response_headers = Object.fromEntries(fetch_response.headers);
  const response_headers_content_type = response_headers['content-type'];


  const response_body = {
    arraybuffer: null,
    blob: null,
    json: null,
    string: null,
  };


  if (typeof response_headers_content_type === 'string') {
    if (response_headers_content_type.includes('application/json') === true) {
      response_body.json = await fetch_response.json();
    }
  }


  /**
   * @type {import('./index').response}
   */
  const response = {
    status: response_status,
    headers: response_headers,
    body: response_body,
  };


  return response;
};


module.exports = { fetch2 };