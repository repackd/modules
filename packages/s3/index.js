
// @ts-check

const stream = require('stream');
const { assert } = require('@repackd/assertion');
const s3 = require('@aws-sdk/client-s3');



/**
 * @param {string} s3_region
 * @param {string} s3_hostname
 * @param {string} s3_access_key
 * @param {string} s3_secret_key
 */
const create_s3c = (s3_region, s3_hostname, s3_access_key, s3_secret_key) => {

  const client = new s3.S3Client({
    region: s3_region,
    endpoint: s3_hostname,
    credentials: {
      accessKeyId: s3_access_key,
      secretAccessKey: s3_secret_key,
    },
    tls: true,
  });

  const list_buckets = async () => {
    console.log('Listing buckets..');
    const response = await client.send(new s3.ListBucketsCommand({}));
    return response;
  };

  /**
   * @param {string} bucket
   */
  const create_bucket = async (bucket) => {
    assert(typeof bucket === 'string');
    console.log(`Creating bucket "${bucket}"..`);
    const response = await client.send(new s3.CreateBucketCommand({
      Bucket: bucket,
      ACL: 'private',
    }));
    return response;
  };

  /**
   * @param {string} bucket
   */
  const delete_bucket = async (bucket) => {
    assert(typeof bucket === 'string');
    console.log(`Creating bucket "${bucket}"..`);
    const response = await client.send(new s3.DeleteBucketCommand({
      Bucket: bucket,
    }));
    return response;
  };

  /**
   * @param {string} bucket
   * @param {string} file_name
   * @param {Buffer} file_buffer
   */
  const upload = async (bucket, file_name, file_buffer) => {
    assert(typeof bucket === 'string');
    assert(typeof file_name === 'string');
    assert(file_buffer instanceof Buffer);
    console.log(`Uploading ${bucket}:"${file_name}" (${file_buffer.length} bytes)..`);
    const response = await client.send(new s3.PutObjectCommand({
      Bucket: bucket,
      Key: file_name,
      Body: file_buffer,
      ACL: 'private',
    }));
    return response;
  };

  /**
   * @param {string} bucket
   * @param {string} file_name
   */
  const download = async (bucket, file_name) => {
    assert(typeof bucket === 'string');
    assert(typeof file_name === 'string');
    console.log(`Downloading ${bucket}:"${file_name}"..`);
    const response = await client.send(new s3.GetObjectCommand({
      Bucket: bucket,
      Key: file_name,
    }));
    return response;
  };

  /**
   * @param {any} readable
   * @returns {Promise<Buffer>}
   */
  const readable_to_buffer = (readable) => new Promise((resolve, reject) => {
    try {
      if (readable instanceof Object === false) {
        throw new Error('readable_to_buffer, "readable" not an instance of Object.');
      }
      if (readable.once instanceof Function === false) {
        throw new Error('readable_to_buffer, "readable.once" not an instance of Function.');
      }
      if (readable.on instanceof Function === false) {
        throw new Error('readable_to_buffer, "readable.on" not an instance of Function.');
      }
      /**
       * @type {Buffer[]}
       */
      const buffers = [];
      readable.once('error', (error) => {
        reject(error);
      });
      readable.on('data', (buffer) => {
        buffers.push(buffer);
      });
      readable.once('end', () => {
        const response = Buffer.concat(buffers);
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });

  const s3c = { list_buckets, create_bucket, delete_bucket, upload, download, readable_to_buffer };

  return s3c;
};

module.exports = { create_s3c };