const os = require('os');
const path = require('path');

const util = exports;


function getAppDataDir() {
  let appDataPath = process.env.APPDATA;
  if (!appDataPath) {
    if (process.platform === 'darwin') {
      appDataPath = path.join(os.homedir(), 'Library/Application Support');
    } else if (process.platform === 'linux') {
      appDataPath = path.join(os.homedir(), '.local/share');
    }
  }
  return appDataPath;
}


util.getUI5SchemasDir = function () {
  return path.join(getAppDataDir(), 'UI5Experts', 'ui5-schemas');
};
