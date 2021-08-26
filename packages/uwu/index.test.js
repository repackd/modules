// @ts-check

const os = require('os');
const fs = require('fs');
const worker_threads = require('worker_threads');
const { assert } = require('@repackd/assertion');
const uwu = require('./index');
const undici2 = require('@repackd/undici2');

const test_html = `
  <html>
    <body>
      <h4>Hello world!</h4>
    </body>
  </html>
`;

const test_file = fs.readFileSync(__filename, { encoding: 'utf-8' });

if (worker_threads.isMainThread === true) {
  os.cpus().forEach(() => {
    new worker_threads.Worker(__filename);
  });
} else {
  process.nextTick(async () => {


    const port = 8080;
    const origin = `http://localhost:${port}`;
    const app = uwu.uws.App({});


    uwu.serve_static(app, '/test-static/', '/', { file_cache: false, compress: false });
    uwu.serve_static(app, '/test-compressed-static/', '/', { file_cache: false, compress: true });
    uwu.serve_static(app, '/test-cached-static/', '/', { file_cache: true, compress: false });
    uwu.serve_static(app, '/test-compressed-cached-static/', '/', { file_cache: true, compress: true });


    app.get('/test-html', uwu.serve_handler(async (response) => {
      response.html = test_html;
    }));
    app.get('/test-compressed-html', uwu.serve_handler(async (response) => {
      response.html = test_html;
      response.compress = true;
    }));
    app.get('/test-headers', uwu.serve_handler(async (response, request) => {
      response.json = request;
    }));
    app.post('/test-json-post', uwu.serve_handler(async (response, request) => {
      response.json = request;
    }));


    const token = await uwu.serve_http(app, uwu.port_access_types.SHARED, port);


    const response = await undici2.request({
      method: 'GET',
      url: `${origin}/test-html`,
    });
    assert(response.headers['content-encoding'] === undefined);
    assert(response.body.string === test_html);


    const response2 = await undici2.request({
      method: 'GET',
      url: `${origin}/test-compressed-html`,
      headers: { 'accept-encoding': 'br' },
    });
    assert(response2.headers['content-encoding'] === 'br');
    assert(response2.body.string === test_html);


    const response3 = await undici2.request({
      method: 'GET',
      url: `${origin}/test-static/index.test.js`,
    });
    assert(response3.headers['content-encoding'] === undefined);
    assert(response3.body.string === test_file);


    const response4 = await undici2.request({
      method: 'GET',
      url: `${origin}/test-compressed-static/index.test.js`,
      headers: { 'accept-encoding': 'br' },
    });
    assert(response4.headers['content-encoding'] === 'br');
    assert(response4.body.string === test_file);


    const response5 = await undici2.request({
      method: 'GET',
      url: `${origin}/test-cached-static/index.test.js`,
    });
    assert(response5.headers['content-encoding'] === undefined);
    assert(response5.body.string === test_file);


    const response6 = await undici2.request({
      method: 'GET',
      url: `${origin}/test-compressed-cached-static/index.test.js`,
      headers: { 'accept-encoding': 'br' },
    });
    assert(response6.headers['content-encoding'] === 'br');
    assert(response6.body.string === test_file);


    const response7 = await undici2.request({
      method: 'GET',
      url: `${origin}/test-headers`,
    });
    assert(response7.body.json instanceof Object);
    assert(response7.body.json.method === 'get');
    assert(response7.body.json.headers instanceof Object);
    assert(response7.body.json.headers.host === 'localhost:8080');


    const response8 = await undici2.request({
      method: 'POST',
      url: `${origin}/test-json-post`,
      json: { foo: 'bar' },
    });
    assert(response8.body.json instanceof Object);
    assert(response8.body.json.method === 'post');
    assert(response8.body.json.json instanceof Object);
    assert(response8.body.json.json.foo === 'bar');


    uwu.uws.us_listen_socket_close(token);
  });
}