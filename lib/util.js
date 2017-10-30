const os = require('os');
const path = require('path');

const util = exports;


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


util.getDefaultOptions = function getDefaultOptions() {
  return {
    sdk: 'sapui5',
    version: '',
    libs: 'sap.ui.core, sap.m, sap.ui.layout',
    outputDir: util.getUI5SchemasDir(),
    upgrade: true,
    link: true,
    debug: false,
    force: false,
  };
};
