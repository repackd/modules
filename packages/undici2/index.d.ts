
import * as http from 'http';
import * as undici from 'undici';


export interface request_urlencoded_interface {
  [key: string]: string;
}


export interface request_json_interface {
  [key: string]: any;
}


export interface request_form_interface {
  [key: string]: number|string|Buffer;
}


export interface request_options {
  method: string;
  url: string;
  headers?: http.IncomingHttpHeaders;
  urlencoded?: request_urlencoded_interface;
  json?: request_json_interface;
  multipart?: request_form_interface;
  buffer?: string|Buffer;
  signal?: AbortSignal;
}


export interface response_body_json {
  [key: string]: any;
}


export interface response_body {
  json: response_body_json;
  string: string;
  buffer: Buffer;
  compressed_buffer: Buffer;
}


export type get_response_body = (
  response: undici.Dispatcher.ResponseData,
) => Promise<response_body>;


export interface response {
  status: number;
  headers: object;
  body: response_body;
}


export type request = (request_options: request_options) => Promise<response>;
export const request: request;