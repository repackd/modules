// @ts-check

const os = require('os');
const fs = require('fs');
const path = require('path');
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

const test = async () => {
  const port = 8080;
  const origin = `http://localhost:${port}`;
  const app = uwu.uws.App({});


  uwu.create_static_handler(app, '/test-static/', path.join(__dirname, '/'), { file_cache: false });
  uwu.create_static_handler(app, '/test-cached-static/', path.join(__dirname, '/'), { file_cache: true });


  app.get('/test-html', uwu.create_handler(async (response) => {
    response.html = test_html;
  }));
  app.get('/test-headers', uwu.create_handler(async (response, request) => {
    response.json = request;
  }));
  app.post('/test-json-post', uwu.create_handler(async (response, request) => {
    response.json = request;
  }));


  const token = await uwu.serve_http(app, uwu.port_access_types.SHARED, port);


  const response = await undici2.request({
    method: 'GET',
    url: `${origin}/test-html`,
  });
  assert(response.status === 200);
  assert(response.headers['content-encoding'] === undefined);
  assert(response.body.string === test_html);
  console.log('response OK');


  const response2 = await undici2.request({
    method: 'GET',
    url: `${origin}/test-static/index.test.js`,
  });
  assert(response2.status === 200);
  assert(response2.headers['content-encoding'] === undefined);
  assert(response2.body.string === test_file);
  console.log('response2 OK');


  const response3 = await undici2.request({
    method: 'GET',
    url: `${origin}/test-cached-static/index.test.js`,
  });
  assert(response3.status === 200);
  assert(response3.headers['content-encoding'] === undefined);
  assert(response3.body.string === test_file);
  console.log('response3 OK');


  const response4 = await undici2.request({
    method: 'GET',
    url: `${origin}/test-headers`,
  });
  assert(response4.status === 200);
  assert(response4.body.json instanceof Object);
  assert(response4.body.json.method === 'get');
  assert(response4.body.json.headers instanceof Object);
  assert(response4.body.json.headers.host === 'localhost:8080');
  console.log('response4 OK');


  const response5 = await undici2.request({
    method: 'POST',
    url: `${origin}/test-json-post`,
    json: { foo: 'bar' },
  });
  assert(response5.status === 200);
  assert(response5.body.json instanceof Object);
  assert(response5.body.json.method === 'post');
  assert(response5.body.json.body.json instanceof Object);
  assert(response5.body.json.body.json.foo === 'bar');
  console.log('response5 OK');


  uwu.uws.us_listen_socket_close(token);
};

if (worker_threads.isMainThread === true) {
  process.nextTick(async () => {

    // single-thread test
    await test();

    // multi-thread test
    os.cpus().forEach(() => {
      new worker_threads.Worker(__filename);
    });

  });
} else {
  process.nextTick(test);
}