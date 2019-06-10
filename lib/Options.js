/* eslint-disable class-methods-use-this */
const path = require('path');
const Minilog = require('minilog');
const request = require('request-promise');
const fs = require('fs-extra');

const Util = require('./Util');

const log = Minilog('ui5-schemas');

class Options {
  constructor(options) {
    if (options.origin) {
      // ignore sdk/version if origin is provided
      delete options.version;
      delete options.sdk;
    } else if (options.sdk === 'openui5nightly') {
      // ignore version if openui5nightly
      delete options.version;
    }

    this.options = options;
  }

  async initialize() {
    await this.determineVersion();
  }

  async determineVersion() {
    if (!this.options.origin && this.version) {
      return;
    }

    let versionOrigin;
    if (this.options.origin) {
      log.info(`Determining version from origin '${this.options.origin}' ...`);
      versionOrigin = `${this.options.origin}/resources/sap-ui-version.json`;
    } else if (!this.version) {
      log.info(`Attempting to download latest version of '${this.sdk}'. Determining latest version...`);
      versionOrigin = `${this.sdkBaseURI}/resources/sap-ui-version.json`;
    }

    const sapUiVersion = await Options.loadVersion(versionOrigin);
    this.version = sapUiVersion.version;

    // also determine sdk from download if using origin
    if (this.options.origin) {
      this.sdk = sapUiVersion.name.toLowerCase().indexOf('sapui5') !== -1 ? 'sapui5' : 'openui5';
    }

    log.info(`Detected version of sdk '${this.sdk}' is '${this.version}'`);
  }

  static async loadVersion(versionOrigin) {
    log.info(versionOrigin);
    if (versionOrigin.startsWith('http')) {
      return JSON.parse(await request(versionOrigin));
    }
    return fs.readJSON(versionOrigin);
  }

  get origin() {
    return this.options.version;
  }

  set origin(version) {
    this.options.version = version;
  }

  get version() {
    return this.options.version;
  }

  set version(version) {
    this.options.version = version;
  }

  isSnapshotVersion() {
    return this.options.version.endsWith('-SNAPSHOT');
  }

  set sdk(sdk) {
    this.options.sdk = sdk;
  }

  get sdk() {
    return this.options.sdk;
  }

  get upgrade() {
    return this.options.upgrade;
  }

  get link() {
    return this.options.link;
  }

  get debug() {
    return this.options.debug;
  }

  get schemaDir() {
    return 'downloads/schemas';
  }

  get schemaBaseUrl() {
    const schemaPath = this.isSnapshotVersion()
      ? this.schemaDir : path.posix.join(this.options.version, this.schemaDir);
    return `${this.sdkBaseURI}/${schemaPath}`;
  }

  get schemaTargetBasePath() {
    const sdk = this.sdk === 'openui5nightly' ? 'openui5' : this.sdk;
    return path.join(this.ui5SchemasBaseDir, sdk, this.version);
  }

  get ui5SchemasBaseDir() {
    return path.join(Util.getAppDataDir(), 'ui5experts', 'ui5-schemas');
  }

  get allLibsPath() {
    if (this.isSnapshotVersion()) {
      path.join(this.ui5SchemasBaseDir, this.sdk, 'all_libs');
    }
    return path.join(this.ui5SchemasBaseDir, this.sdk, this.version, 'all_libs');
  }

  get allLibsUrl() {
    let allLibsPath;
    if (this.isSnapshotVersion()) {
      allLibsPath = this.allLibsMetafile;
    } else {
      allLibsPath = path.posix.join(this.options.version, this.allLibsMetafile);
    }
    return `${this.sdkBaseURI}/${allLibsPath}`;
  }

  get allLibsMetafile() {
    return 'discovery/all_libs';
  }

  get sdkBaseURI() {
    if (this.options.sdk === 'sapui5') {
      return 'https://sapui5.hana.ondemand.com';
    } if (this.options.sdk === 'openui5nightly') {
      return 'https://openui5nightly.hana.ondemand.com';
    }
    return 'https://openui5.hana.ondemand.com';
  }
}

module.exports = Options;
