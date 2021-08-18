export interface severity_types {
  DEFAULT: string;
  DEBUG: string;
  INFO: string;
  NOTICE: string;
  WARNING: string;
  ERROR: string;
  CRITICAL: string;
  ALERT: string;
  EMERGENCY: string;
}
export const severity_types: severity_types;


export interface severity_codes {
  DEFAULT: number;
  DEBUG: number;
  INFO: number;
  NOTICE: number;
  WARNING: number;
  ERROR: number;
  CRITICAL: number;
  ALERT: number;
  EMERGENCY: number;
}
export const severity_codes: severity_codes;


export interface error {
  name?: string;
  code?: string;
  message?: string;
  stack?: string;
}
export type parse_error = (error: Error & error) => error;
const parse_error: parse_error;