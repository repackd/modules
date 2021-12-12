
// @ts-check

const { assert } = require('@repackd/assertion');
const fs = require('fs');
const path = require('path');
const s3 = require('.');

const config_path = path.join(process.cwd(), 'test.config.json');
const config = JSON.parse(fs.readFileSync(config_path, { encoding: 'utf-8' }));


const file_bucket = 'uncategorized';
const file_name = 'test.png';
const file_path = path.join(__dirname, file_name);
const file_buffer = fs.readFileSync(file_path);

process.nextTick(async () => {
  assert(typeof config.s3_region === 'string');
  assert(typeof config.s3_hostname === 'string');
  assert(typeof config.s3_access_key === 'string');
  assert(typeof config.s3_secret_key === 'string');

  const s3c = s3.create_s3c(config.s3_region, config.s3_hostname, config.s3_access_key, config.s3_secret_key);

  const buckets_response = await s3c.list_buckets();

  if (buckets_response.Buckets.some((bucket) => bucket.Name === file_bucket) === false) {
    await s3c.create_bucket(file_bucket);
  }

  const upload_response = await s3c.upload(file_bucket, file_name, file_buffer);
  console.log({ upload_response });

  const download_response = await s3c.download(file_bucket, file_name);
  console.log({ download_response });

  const download_response_buffer = await s3c.readable_to_buffer(download_response.Body);
  console.log({ download_response_buffer });

  console.log({ equals: file_buffer.equals(download_response_buffer) });
});