const path = require('path');
const request = require('request');
const fs = require('fs-extra');
const Minilog = require('minilog');

const log = Minilog('ui5-schemas');

const schemaSuffix = '.xsd';


module.exports = {
  allLibsFile: function allLibsFile(options) {
    log.debug('[download]', `Downloading all libraries metafile from '${options.allLibsUrl}'`);
    return new Promise((resolve, reject) => {
      request(options.allLibsUrl, (err, res, body) => {
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
  },

  schemas: function schemas(options, allLibs) {
    const allLibsRegistry = allLibs.all_libs;
    const downloadPromises = [];

    for (let i = 0; i < allLibsRegistry.length; i += 1) {
      const schemaFileName = allLibsRegistry[i].entry.replace(/\//g, '.') + schemaSuffix;
      const schemaFileURL = `${options.schemaBaseUrl}/${schemaFileName}`;

      downloadPromises.push(new Promise((resolve, reject) => {
        log.debug('[download]', `Downloading library schema from '${schemaFileURL}'`);
        request(schemaFileURL, (err, res, body) => {
          if (err) {
            reject(err);
            return;
          }

          const targetFile = path.join(options.schemaTargetBasePath, schemaFileName);
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

    return Promise.all(downloadPromises);
  },
};
