
import * as undici2 from '@joshxyzhimself/undici2';

export type post_form = (url: string, body: any) => Promise<undici2.response>;
export const post_form: post_form;


export type post_json = (url: string, body: any) => Promise<undici2.response>;
export const post_json: post_json;


export type create_endpoint = (token: string, method: string) => string;
export const create_endpoint: create_endpoint;


export interface send_message_body {
  chat_id: number;
  text: string;
  parse_mode?: string;
  [key: string]: any;
}
export type send_message = (token: string, body: send_message_body) => Promise<undici2.response>;
export const send_message: send_message;


export interface delete_message_body {
  chat_id: number;
  message_id: number;
  [key: string]: any;
}
export type delete_message = (token: string, body: delete_message_body) => Promise<undici2.response>;
export const delete_message: delete_message;


export interface send_photo_body {
  chat_id: number;
  caption?: string;
  photo: Buffer;
  [key: string]: any;
}
export type send_photo = (token: string, body: send_photo_body) => Promise<undici2.response>;
export const send_photo: send_photo;


export type delete_webhook = (token: string) => Promise<undici2.response>;
export const delete_webhook: delete_webhook;


export interface set_webhook_body {
  url: string;
  max_connections: number;
  allowed_updates: string[];
  [key: string]: any;
}
export type set_webhook = (token: string, body: set_webhook_body) => Promise<undici2.response>;
export const set_webhook: set_webhook;


export interface get_updates_body {
  offset?: number;
  allowed_updates: string[];
  [key: string]: any;
}
export type get_updates = (token: string, body: get_updates_body) => Promise<undici2.response>;
export const get_updates: get_updates;


export type get_me = (token: string) => Promise<undici2.response>;
export const get_me: get_me;


export interface get_chat_administrators_body {
  chat_id: number;
  [key: string]: any;
}
export type get_chat_administrators = (token: string, body: get_chat_administrators_body) => Promise<undici2.response>;
export const get_chat_administrators: get_chat_administrators;


export type encode_code = (value: string) => string;
export const encode_code: encode_code;


export type encode_url = (value: string) => string;
export const encode_url: encode_url;


export type encode_text = (value: string) => string;
export const encode_text: encode_text;
