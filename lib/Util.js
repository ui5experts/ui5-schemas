const os = require('os');
const path = require('path');

class Util {
  static getAppDataDir() {
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
}

module.exports = Util;
