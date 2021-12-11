import * as ElasticSearch from '@elastic/elasticsearch';


export interface document_operation {
  _index: string;
  _id: string;
  [key: string]: unknown;
}

export interface document_source {
  _id?: never;
  _index?: never;
  [key: string]: any;
}

export interface document_highlight {
  [key: string]: string[];
}

export interface document {
  _index: NonNullable<string>;
  _source: NonNullable<document_source>;
  _id?: string;
  _score?: number;
  highlight?: document_highlight;
}


export type create_index = (index: string, body?: object) => void;


export type delete_index = (index: string) => void;


export type refresh_indices = (...indices: string[]) => void;


export interface search_response {
  hits: document[];
  count: number;
  took: number;
}


export type search_by_body = (
  body: object,
  limit: number,
  offset: number,
  ...indices: string[],
) => search_response;


export type search_by_text = (
  query: string,
  limit: number,
  offset: number,
  ...indices: string[],
) => search_response;


export type get_document = (
  index: string,
  id: string,
) => document;


export type bulk_operation_create_action = (
  operation: string,
  document: document,
) => document;


export type bulk_operation_action = (
  document: document,
) => document;


export interface bulk_operation {
  index: bulk_operation_action;
  create: bulk_operation_action;
  update: bulk_operation_action;
  ignore_error_types: (...error_types: string[]) => void;
  commit: () => Promise<void>;
}


export type create_bulk_operation = () => bulk_operation;


export interface esc {
  client: ElasticSearch.Client;
  create_index: create_index;
  delete_index: delete_index;
  refresh_indices: refresh_indices;
  search_by_body: search_by_body;
  search_by_text: search_by_text;
  get_document: get_document;
  create_bulk_operation: create_bulk_operation;
}


export type create_esc = (
  elasticsearch_host: string,
  elasticsearch_port: number,
  elasticsearch_username: string,
  elasticsearch_password: string,
) => esc;


export const create_esc: create_esc;