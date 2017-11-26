/* eslint-env mocha */
const ui5Schemas = require('../lib/main.js');
const download = require('../lib/download.js');

const assert = require('assert');
const nock = require('nock');


// intercept calls to openui5 or sapui5 on different paths
nock(/https:\/\/(openui5|sapui5)\.hana\.ondemand\.com/)
  .persist()
  .get(/.*\/discovery\/all_libs/)
  .reply(200, {})

  .get(/.*\/downloads\/schemas\/(sap\.ui\.core|sap\.m|sap\.ui\.layout)\.xsd/)
  .reply(200, {})

  .get(/.*/)
  .reply(404, 'NOT FOUND');

// .replyWithFile(200, __dirname + '/replies/user.json', { 'Content-Type': 'application/json' });


// describe('OpenUI5', () => {
//   it('should download all the files from the correct url depending on the options', () => {
//     ui5Schemas();
//   });
// });


describe('downloadFile', () => {
  it('should download a file/read a file from fs and return it\'s contents', () => {
    const req = download.downloadFile(
      "https://openui5.hana.ondemand.com/1.44.6/resources/sap-ui-version.json",
      "openui5/1.44.6/sap-ui-version.json"
    );
    console.dir(req)
  });
});


nock.restore();
