'use strict';
const common = require('../common');
const { rejects } = require('assert');

const jsModuleDataUrl = 'data:text/javascript,export{}';
const jsonModuleDataUrl = 'data:application/json,""';

async function test() {
  await rejects(
    // This rejects because of the unsupported MIME type, not because of the
    // unsupported assertion.
    import('data:text/css,', { assert: { type: 'css' } }),
    { code: 'ERR_INVALID_MODULE_SPECIFIER' }
  );

  await rejects(
    import(`data:text/javascript,import${JSON.stringify(jsModuleDataUrl)}assert{type:"json"}`),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_FAILED' }
  );

  await rejects(
    import(jsModuleDataUrl, { assert: { type: 'json' } }),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_FAILED' }
  );

  await rejects(
    import(jsModuleDataUrl, { assert: { type: 'unsupported' } }),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED' }
  );

  await rejects(
    import(jsonModuleDataUrl),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_MISSING' }
  );

  await rejects(
    import(jsonModuleDataUrl, { assert: {} }),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_MISSING' }
  );

  await rejects(
    import(jsonModuleDataUrl, { assert: { foo: 'bar' } }),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_MISSING' }
  );

  await rejects(
    import(jsonModuleDataUrl, { assert: { type: 'unsupported' }}),
    { code: 'ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED' }
  );
}

test().then(common.mustCall());
