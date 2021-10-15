
export type index = Map<string|number, Set<Function>>;
export type on = (id: string|number, listener: Function) => void;
export type off = (id: string|number, listener: Function) => void;
export type emit = (id: string|number, ...args: any[]) => void;

export interface emitter {
  on: on;
  off: off;
  emit: emit;
}

export type create_emitter = () => emitter;
export const create_emitter: create_emitter;