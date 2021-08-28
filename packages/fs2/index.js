
// @ts-check


const fs = require('fs');
const path = require('path');
const { assert } = require('@repackd/assertion');


/**
 * @type {import('./index').read_json}
 */
const read_json = async (file_path) => {
  assert(typeof file_path === 'string');
  assert(path.isAbsolute(file_path) === true);
  const file_data_utf8 = await fs.promises.readFile(file_path, { encoding: 'utf-8' });
  const file_data = JSON.parse(file_data_utf8);
  return file_data;
};


/**
 * @type {import('./index').read_json_sync}
 */
const read_json_sync = (file_path) => {
  assert(typeof file_path === 'string');
  assert(path.isAbsolute(file_path) === true);
  const file_data_utf8 = fs.readFileSync(file_path, { encoding: 'utf-8' });
  const file_data = JSON.parse(file_data_utf8);
  return file_data;
};


/**
 * @type {import('./index').write_json}
 */
const write_json = async (file_path, file_data) => {
  assert(typeof file_path === 'string');
  assert(path.isAbsolute(file_path) === true);
  assert(file_data instanceof Object);
  const file_data_utf8 = JSON.stringify(file_data);
  await fs.promises.writeFile(file_path, file_data_utf8);
};


/**
 * @type {import('./index').write_json_sync}
 */
const write_json_sync = (file_path, file_data) => {
  assert(typeof file_path === 'string');
  assert(path.isAbsolute(file_path) === true);
  assert(file_data instanceof Object);
  const file_data_utf8 = JSON.stringify(file_data);
  fs.writeFileSync(file_path, file_data_utf8);
};


/**
 * @description
 *
 * Current working directory
 *
 * @type {import('./index').cwd}
 */
const cwd = process.cwd();


/**
 * @description
 *
 * Path from current working directory
 *
 * @type {import('./index').pfcwd}
 */
const pfcwd = (...paths) => path.join(cwd, ...paths);


/**
 * @description
 *
 * Path join
 *
 * @type {import('./index').pj}
 */
const pj = (...paths) => path.join(...paths);


module.exports = {
  read_json,
  read_json_sync,
  write_json,
  write_json_sync,
  cwd,
  pfcwd,
  pj,
};