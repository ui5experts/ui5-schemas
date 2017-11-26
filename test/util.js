/* eslint-env mocha */
const util = require('../lib/util.js');

const assert = require('assert');
const nock = require('nock');
const sinon = require('sinon');

// TODO: mock real fs
const fs = require('fs-extra');


describe('Util', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    nock(/https:\/\/(openui5|sapui5)\.hana\.ondemand\.com/)
      .persist()
      .get('resources/sap-ui-version.json')
      .reply(200, { version: '1.48.11' });
  });


  afterEach(() => {
    sandbox.restore();
    nock.restore();
  });


  it('should set defaults, find out latest version and symlink latest folder', (done) => {
    sandbox.stub(fs, 'symlink')
      .returns(new Promise((resolve) => { resolve(); }));

    util.storeOptions()
      .then(() => {
        assert.equal(util.options.sdk, 'sapui5');
        assert.equal(util.options.version, '1.48.11');
        assert.equal(util.options.libs, '');
        assert.equal(util.options.debug, false);
        assert.equal(util.options.force, false);

        assert.ok(fs.symlink.calledOnce);
        assert.ok(nock.isDone());
        done();
      });
  });
});
