
// @ts-check

const fs = require('fs');
const path = require('path');
const mime_types = require('mime-types');
const uws = require('uWebSockets.js');
const { assert } = require('@repackd/assertion');
const { severity_types, parse_error } = require('@repackd/severity');
const events2 = require('../events2');


const emitter = events2.create_emitter();


/**
 * @type {import('./index').cache_control_types}
 */
const cache_control_types = {

  // prevent caching
  no_store: 'no-store, max-age=0',

  // allow caching, must revalidate
  no_cache: 'no-cache',

  // allow private caching, no revalidate
  private_cache: 'private, max-age=3600, s-maxage=3600',

  // allow public caching, no revalidate
  public_cache: 'public, max-age=86400, s-maxage=86400',

};


/**
 * @type {Map<string, import('./index').cached_file>}
 */
const cached_files = new Map();


/**
 * @type {import('./index').core_handler}
 */
const core_handler = async (res, handler, response, request) => {
  try {
    assert(res instanceof Object);
    assert(res.writeStatus instanceof Function);
    assert(res.writeHeader instanceof Function);
    assert(res.end instanceof Function);
    assert(handler instanceof Function);
    assert(response instanceof Object);
    assert(request instanceof Object);
    await handler(response, request);
    assert(typeof response.aborted === 'boolean');
    if (response.aborted === true) {
      return;
    }
    assert(typeof response.ended === 'boolean');
    assert(response.ended === false);
    assert(typeof response.file_cache === 'boolean');
    assert(typeof response.file_cache_max_age_ms === 'number');
    assert(typeof response.status === 'number');
    assert(response.headers instanceof Object);
    if (typeof response.file_path === 'string') {
      assert(path.isAbsolute(response.file_path) === true);
      try {
        fs.accessSync(response.file_path);
      } catch (e) {
        if (fs.existsSync(response.file_path) === false) {
          response.status = 404;
        } else {
          response.status = 500;
        }
      }
      if (response.status === 200) {
        if (response.file_cache === true) {
          if (cached_files.has(response.file_path) === true) {
            const cached_file = cached_files.get(response.file_path);
            if (Date.now() - cached_file.timestamp > response.file_cache_max_age_ms) {
              cached_files.delete(response.file_path);
            }
          }
          if (cached_files.has(response.file_path) === false) {
            const file_name = path.basename(response.file_path);
            const file_content_type = mime_types.contentType(file_name) || null;
            const buffer = fs.readFileSync(response.file_path);
            const timestamp = Date.now();

            /**
             * @type {import('./index').cached_file}
             */
            const cached_file = {
              file_name,
              file_content_type,
              buffer,
              timestamp,
            };

            cached_files.set(response.file_path, cached_file);
          }
          const cached_file = cached_files.get(response.file_path);
          response.file_name = cached_file.file_name;
          response.file_content_type = cached_file.file_content_type;
          response.buffer = cached_file.buffer;
        } else {
          const file_name = path.basename(response.file_path);
          const file_content_type = mime_types.contentType(file_name) || null;
          const buffer = fs.readFileSync(response.file_path);
          response.file_name = file_name;
          response.file_content_type = file_content_type;
          response.buffer = buffer;
        }
        if (typeof response.file_content_type === 'string') {
          response.headers['Content-Type'] = response.file_content_type;
        }
      }
    } else if (typeof response.text === 'string') {
      response.headers['Content-Type'] = 'text/plain';
      response.buffer = Buffer.from(response.text);
    } else if (typeof response.html === 'string') {
      response.headers['Content-Type'] = 'text/html';
      response.buffer = Buffer.from(response.html);
    } else if (response.json instanceof Object) {
      response.headers['Content-Type'] = 'application/json';
      response.buffer = Buffer.from(JSON.stringify(response.json));
    } else if (response.buffer instanceof Buffer) {
      if (response.headers['Content-Type'] === undefined) {
        response.headers['Content-Type'] = 'application/octet-stream';
      }
    }
    if (typeof response.file_name === 'string' && response.file_dispose === true) {
      if (response.headers['Content-Disposition'] === undefined) {
        response.headers['Content-Disposition'] = `attachment; filename="${response.file_name}"`;
      }
    }
    res.writeStatus(String(response.status));
    Object.entries(response.headers).forEach((entry) => {
      const [key, value] = entry;
      assert(typeof key === 'string');
      assert(typeof value === 'string');
      res.writeHeader(key, value);
    });
    assert(response.buffer === null || response.buffer instanceof Buffer);
    if (response.status === 304 || response.buffer === null) {
      res.end();
    } else {
      res.end(response.buffer);
    }
    response.ended = true;
    response.end = Date.now();
    response.took = response.end - response.start;
  } catch (e) {
    response.error = e;
    if (response.aborted === false) {
      if (response.ended === false) {
        res.writeStatus('500');
        res.end();
        response.ended = true;
      }
    }
    emitter.emit(severity_types.ERROR, {
      resource_id: 'uwu',
      operation_id: 'initial_handler',
      data: { request, response },
      timestamp: Date.now(),
      error: parse_error(e),
    });
  }
};


/**
 * @type {import('./index').create_handler}
 */
const create_handler = (handler) => {
  assert(handler instanceof Function);

  /**
   * @type {import('./index').initial_handler}
   */
  const initial_handler = (res, req) => {
    assert(res instanceof Object);
    assert(res.onData instanceof Function);
    assert(res.onAborted instanceof Function);
    assert(req instanceof Object);
    assert(req.getUrl instanceof Function);
    assert(req.getQuery instanceof Function);
    assert(req.getHeader instanceof Function);

    /**
     * @type {import('./index').request}
     */
    const request = {
      url: req.getUrl(),
      query: req.getQuery(),
      method: req.getMethod(),
      headers: {
        host: req.getHeader('host'),
        origin: req.getHeader('origin'),
        accept: req.getHeader('accept'),
        accept_encoding: req.getHeader('accept-encoding'),
        content_type: req.getHeader('content-type'),
        user_agent: req.getHeader('user-agent'),
        cookie: req.getHeader('cookie'),
        x_forwarded_proto: req.getHeader('x-forwarded-proto'),
        x_forwarded_host: req.getHeader('x-forwarded-host'),
        x_forwarded_for: req.getHeader('x-forwarded-for'),
      },
      ip_address: Buffer.from(res.getRemoteAddressAsText()).toString(),
      body: {
        buffer: null,
        json: null,
        parts: null,
      },
    };

    /**
     * @type {import('./index').response}
     */
    const response = {

      aborted: false,
      ended: false,
      error: null,

      status: 200,
      headers: { 'Cache-Control': cache_control_types.no_store },

      file_path: null,
      file_name: null,
      file_content_type: null,
      file_dispose: false,
      file_cache: false,
      file_cache_max_age_ms: Infinity,

      text: null,
      html: null,
      json: null,
      buffer: null,

      start: Date.now(),
      end: null,
      took: null,
    };
    request.body.buffer = Buffer.from([]);
    res.onData((chunk_arraybuffer, is_last) => {
      const chunk_buffer = Buffer.from(chunk_arraybuffer.slice(0));
      request.body.buffer = Buffer.concat([request.body.buffer, chunk_buffer]);
      if (is_last === true) {
        try {
          if (request.headers.content_type.includes('application/json') === true) {
            request.body.json = JSON.parse(request.body.buffer.toString());
          }
          if (request.headers.content_type.includes('multipart/form-data') === true) {
            request.body.parts = uws.getParts(request.body.buffer, request.headers.content_type);
          }
        } catch (e) {
          request.error = e;
          emitter.emit(severity_types.ERROR, {
            resource_id: 'uwu',
            operation_id: 'initial_handler',
            data: { request, response },
            timestamp: Date.now(),
            error: parse_error(e),
          });
        }
        process.nextTick(core_handler, res, handler, response, request);
      }
    });
    res.onAborted(() => {
      response.aborted = true;
    });
  };
  return initial_handler;
};


/**
 * @type {import('./index').create_static_handler}
 */
const create_static_handler = (app, url_pathname, local_directory, response_override) => {
  assert(app instanceof Object);
  assert(app.get instanceof Function);

  assert(typeof url_pathname === 'string');
  assert(url_pathname.substring(0, 1) === '/');
  assert(url_pathname.substring(url_pathname.length - 1, url_pathname.length) === '/');

  assert(typeof local_directory === 'string');
  assert(local_directory.substring(local_directory.length - 1, local_directory.length) === path.sep);
  assert(fs.existsSync(local_directory) === true);
  assert(path.isAbsolute(local_directory) === true);

  assert(response_override === undefined || response_override instanceof Object);

  const core_static_handler = create_handler(async (response, request) => {
    response.file_path = request.url.replace(url_pathname, local_directory);
    if (response_override instanceof Object) {
      Object.assign(response, response_override);
    }
  });

  app.get(url_pathname.concat('*'), (res, req) => {
    assert(req instanceof Object);
    assert(req.getUrl instanceof Function);
    const request_url = req.getUrl();
    const request_url_extname = path.extname(request_url);
    if (request_url_extname === '') {
      req.setYield(true);
      return;
    }
    core_static_handler(res, req);
  });
};


/**
 * @type {import('./index').create_tls_redirect}
 */
const create_tls_redirect = (app) => {
  assert(app instanceof Object);
  assert(app.get instanceof Function);
  app.get('/*', create_handler(async (response, request) => {
    response.status = 308;
    response.headers['Location'] = 'https://'.concat(request.headers.host, request.url);
  }));
};


/**
 * @type {import('./index').port_access_types}
 */
const port_access_types = { SHARED: 0, EXCLUSIVE: 1 };


/**
 * @type {import('./index').serve_http}
 */
const serve_http = (app, port_access_type, port) => new Promise((resolve, reject) => {
  assert(app instanceof Object);
  assert(app.listen instanceof Function);
  assert(typeof port_access_type === 'number');
  assert(typeof port === 'number');
  app.listen(port, port_access_type, (token) => {
    if (token) {
      resolve(token);
    } else {
      reject(new Error('uws :: app.listen failed, invalid token'));
    }
  });
});


/**
 * @type {import('./index').serve_https}
 */
const serve_https = (app, port_access_type, port) => new Promise((resolve, reject) => {
  assert(app instanceof Object);
  assert(app.listen instanceof Function);
  assert(typeof port_access_type === 'number');
  assert(typeof port === 'number');
  app.listen(port, port_access_type, (token) => {
    if (token) {
      resolve(token);
    } else {
      reject(new Error('uws :: app.listen failed, invalid token'));
    }
  });
});


module.exports = {
  emitter,
  cache_control_types,
  create_handler,
  create_static_handler,
  create_tls_redirect,
  port_access_types,
  serve_http,
  serve_https,
  uws,
};