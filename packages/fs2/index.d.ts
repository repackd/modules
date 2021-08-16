
import * as fs from 'fs';

export type read_json = (file_path: string) =>  Promise<any>;
export const read_json: read_json;


export type write_json = (file_path: string, file_data: any) => Promise<void>;
export const write_json: write_json;


export type cwd = string;
export const cwd: cwd;


export type pfcwd = (...values: string[]) => string;
export const pfcwd: pfcwd;


export type pj = (...values: string[]) => string;
export const pj: pj;