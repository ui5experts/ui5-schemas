const path = require('path');
const request = require('request');
const fs = require('fs-extra');
const Minilog = require('minilog');
const util = require('./util');

const log = Minilog('ui5-schemas');


const sdkBaseURIs = {
  openui5: 'https://openui5.hana.ondemand.com',
  sapui5: 'https://sapui5.hana.ondemand.com',
};
const allLibsMetafile = 'discovery/all_libs';
const schemaDir = 'downloads/schemas';
const schemaSuffix = '.xsd';
// const versionInfo = 'resources/sap-ui-version.info';


const download = exports;



download.downloadFile = function (url, file, force) {
  const fsPath = path.join(util.getUI5SchemasDir(), file);
  if (force) {
    return request(url);
  }

  return new Promise((resolve, reject) => {
    fs.pathExists(fsPath)
      .then((exists) => {

        if (exists) {
          fs.readFile(fsPath).then((err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        } else {
          return request(url);
        }
      });
  });
};


download.allLibsFile = function allLibsFile(options) {
  const allLibsPath = path.posix.join(options.version, allLibsMetafile);
  const allLibsURL = `${sdkBaseURIs[options.sdk]}/${allLibsPath}`;

  log.debug('[download]', `Downloading all libraries metafile from '${allLibsURL}'`);
  return new Promise((resolve, reject) => {
    request(allLibsURL, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const allLibs = JSON.parse(body);
        resolve(allLibs);
      } catch (e) {
        reject(e);
      }
    });
  });
};


download.schemas = function schemas(options, allLibs) {
  const allLibsRegistry = allLibs.all_libs;
  const downloadPromises = [];
  fs.emptyDirSync(path.join(process.cwd(), options.outputDir, options.version));

  for (let i = 0; i < allLibsRegistry.length; i += 1) {
    const schemaFileName = allLibsRegistry[i].entry.replace(/\//g, '.') + schemaSuffix;
    const schemaFilePath = path.posix.join(options.version, schemaDir, schemaFileName);
    const schemaFileURL = `${sdkBaseURIs[options.sdk]}/${schemaFilePath}`;

    downloadPromises.push(new Promise((resolve, reject) => {
      log.debug('[download]', `Downloading library schema from '${schemaFileURL}'`);
      request(schemaFileURL, (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }

        const targetFile = path.join(options.outputDir, options.sdk, options.version,
          schemaFileName);
        allLibsRegistry[i].location = targetFile;
        log.debug('[download]', `Writing library schema file to '${targetFile}'`);
        fs.outputFile(targetFile, body)
          .then((data) => {
            resolve(data);
          })
          .catch((fileErr) => {
            reject(fileErr);
          });
      });
    }));
  }

  const allDownloadsPromise = Promise.all(downloadPromises);
  allDownloadsPromise.then(() => {
    const targetFile = path.join(options.outputDir, options.sdk, options.version, 'all_libs');
    log.debug('[download]', `Storing library metadata in '${targetFile}'`);
    fs.outputFile(targetFile, JSON.stringify({
      all_libs: allLibsRegistry,
      version: options.version,
    }, null, 2));
  });

  return allDownloadsPromise;
};
