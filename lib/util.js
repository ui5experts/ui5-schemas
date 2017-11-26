const os = require('os');
const path = require('path');
const request = require('request');
const fs = require('fs-extra');
const Minilog = require('minilog');

const log = Minilog('ui5-schemas');

const util = exports;


util.getSDKBaseURI = function (sdk) {
  return `https://${sdk}.hana.ondemand.com`;
};


util.getAllLibsPath = function () {
  return 'discovery/all_libs';
};


util.getSchemaPath = function () {
  return 'downloads/schemas';
};


util.getVersionFilePath = function () {
  return 'resources/sap-ui-version.json';
};


util.getAppDataDir = function getAppDataDir() {
  let appDataPath = process.env.APPDATA;
  if (!appDataPath) {
    if (process.platform === 'darwin') {
      appDataPath = path.join(os.homedir(), 'Library/Application Support');
    } else if (process.platform === 'linux') {
      appDataPath = path.join(os.homedir(), '.local/share');
    }
  }
  return appDataPath;
};


util.getUI5SchemasDir = function getUI5SchemasDir() {
  return path.join(util.getAppDataDir(), 'UI5Experts', 'ui5-schemas');
};


util.options = {};
let options = util.options;
let baseURL;
let basePath;
util.storeOptions = function (opts = {}) {
  options = {
    sdk: opts.sdk || 'sapui5',
    version: opts.version || '',
    libs: opts.libs || '',
    debug: opts.debug || false,
    force: opts.force || false,
  };

  const setPaths = function () {
    baseURL = `${util.getSDKBaseURI(options.sdk)}/${options.version}/`;
    basePath = path.posix.join(
      util.getUI5SchemasDir(),
      options.sdk,
      options.version
    );
    return options;
  };

  // find version if needed
  return new Promise((resolve, reject) => {
    if (options.version) {
      resolve(setPaths());
      return;
    }
    return request(`${util.getSDKBaseURI(opts.sdk)}/${util.getVersionFilePath()}`, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        options.version = JSON.parse(body).version;
      } catch (e) {
        reject(e);
      }

      // const target = path.posix.join(
      //   util.getUI5SchemasDir(),
      //   options.sdk,
      //   options.version
      // );
      // const thePath = path.posix.join(
      //   util.getUI5SchemasDir(),
      //   options.sdk,
      //   'latest'
      // );
      fs.symlink(target, thePath)
        .then(() => resolve(setPaths()))
        .catch(e => reject(e));
    });
  });
};


util.getBaseURL = function () {
  return baseURL;
};


util.getBasePath = function () {
  return basePath;
};


util.findVersion = function () {
  return new Promise((resolve, reject) => {
    if (util.options.version) {
      resolve(util.options.version);
      return;
    }
    request
  });
};
