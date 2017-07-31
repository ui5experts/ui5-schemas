const path = require('path');
const request = require('request');
const fs = require('fs-extra');


const sdkBaseURIs = {
  openui5: 'https://openui5.hana.ondemand.com',
  sapui5: 'https://sapui5.hana.ondemand.com',
};
const allLibsMetafile = 'discovery/all_libs';
const schemaDir = 'downloads/schemas';
const schemaSuffix = '.xsd';


module.exports = {};


module.exports.allLibsFile = function (options) {
  console.log(`Preparing '${options.sdk}' schemas in version '${options.version || 'latest'}'...\n`);

  const allLibsPath = path.join(options.version, allLibsMetafile);
  const allLibsURL = `${sdkBaseURIs[options.sdk]}/${allLibsPath}`;

  console.log(`Downloading all libraries metafile from '${allLibsURL}'`);
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


module.exports.schemas = function (options, allLibs) {
  const allLibsRegistry = allLibs.all_libs;
  const downloadPromises = [];
  fs.emptyDirSync(path.join(process.cwd(), options.outputDir, options.version));

  for (let i = 0; i < allLibsRegistry.length; i += 1) {
    const schemaFileName = allLibsRegistry[i].entry.replace(/\//g, '.') + schemaSuffix;
    const schemaFilePath = path.join(options.version, schemaDir, schemaFileName);
    const schemaFileURL = `${sdkBaseURIs[options.sdk]}/${schemaFilePath}`;

    downloadPromises.push(new Promise((resolve, reject) => {
      console.log(`Downloading library schema from '${schemaFileURL}'`);
      request(schemaFileURL, (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }

        const targetFile = path.join(options.outputDir, options.version,
          schemaFileName);
        allLibsRegistry[i].location = targetFile;
        console.log(`Writing library schema file to '${targetFile}'`);
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
};
