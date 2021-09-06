

export interface request_headers {
  [key: string]: string;
}
export interface request_json_interface {
  [key: string]: any;
}
export interface response_headers {
  [key: string]: string;
}
export interface response_json_interface {
  [key: string]: any;
}
export interface response_body {
  arraybuffer?: ArrayBuffer;
  blob?: Blob;
  json?: response_json_interface;
  string?: string;
}
export interface request_options {
  url: string;
  method: string;
  headers?: request_headers;
  json?: request_json_interface;
}


export interface response {
  status: number;
  headers: response_headers;
  body: response_body;
}

export type fetch2 = (request_options: request_options) => Promise<response>;

export const fetch2: fetch2;