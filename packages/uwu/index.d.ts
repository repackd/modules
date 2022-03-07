import * as uws from 'uWebSockets.js';
import { emitter } from '../events2';


export interface cache_control_types {
  no_store: string;
  no_cache: string;
  private_cache: string;
  public_cache: string;
}


export interface port_access_types {
  SHARED: number;
  EXCLUSIVE: number;
}


export interface response_headers {
  [key:string]: any;
}


export interface response_json {
  [key:string]: any;
}


export interface response {
  aborted?: boolean;
  ended?: boolean;
  error?: Error;

  status?: number;
  headers?: response_headers;

  file_path?: string;
  file_name?: string;
  file_content_type?: string;
  file_dispose?: boolean;
  file_cache?: boolean;
  file_cache_max_age_ms?: number;

  text?: string;
  html?: string;
  json?: response_json;
  buffer?: Buffer;
  buffer_hash?: string;

  compress?: boolean;
  compressed?: boolean;
  brotli_buffer?: Buffer;
  brotli_buffer_hash?: string;
  gzip_buffer?: Buffer;
  gzip_buffer_hash?: string;

  start?: number;
  end?: number;
  took?: number;
}


export interface cached_file { 
  file_name: string;
  file_content_type: string;
  buffer: Buffer;
  buffer_hash: string;
  brotli_buffer: Buffer;
  brotli_buffer_hash: string;
  gzip_buffer: Buffer;
  gzip_buffer_hash: string;
  timestamp: number;
}


export interface headers {
  host: string;
  origin: string;
  accept: string;
  accept_encoding: string;
  content_type: string;
  if_none_match: string;
  user_agent: string;
  cookie: string;
  x_forwarded_proto: string;
  x_forwarded_host: string;
  x_forwarded_for: string;
}


export interface request_body_json {
  [key:string]: any;
}

export interface request_body_part {
  name: string;
  data: ArrayBuffer;
  type?: string;
  filename?: string;
}

export interface request_body {
  buffer: Buffer;
  json: request_body_json;
  parts: request_body_part[];
}

export interface request {
  url: string;
  query: string;
  method: string;
  headers: headers;
  ip_address: string;
  body: request_body;
  error?: Error;
}


export const emitter: emitter;


export const cache_control_types: cache_control_types;


export type handler = (response: response, request: request) => void;
export type core_handler = (res: uws.HttpResponse, handler: handler, response: response, request: request) => void;
export type initial_handler = (res: uws.HttpResponse, req: uws.HttpRequest) => void;
export type create_handler = (handler: handler) => initial_handler;
export const create_handler: create_handler;


export type create_static_handler = (app: uws.TemplatedApp, url_pathname: string, local_directory: string, response_override: response) => void;
export const create_static_handler: create_static_handler;


export type create_tls_redirect = (app: uws.TemplatedApp) => void;
export const create_tls_redirect: create_tls_redirect;


export const port_access_types: port_access_types;


export type serve_http = (app: uws.TemplatedApp, port_access_type: number, port: number) => Promise<uws.us_listen_socket>;
export const serve_http: serve_http;


export type serve_https = (app: uws.TemplatedApp, port_access_type: number, port: number) => Promise<uws.us_listen_socket>;
export const serve_https: serve_https;


export * as uws from 'uWebSockets.js';