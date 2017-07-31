#!/usr/bin/env node

const download = require('../lib/download');
const upgrade = require('../lib/upgrade');
const link = require('../lib/link');

// TODO: Use yargs

exports.ui5_schema = function (options = {
  sdk: 'sapui5',
  version: '',
  outputDir: '.tmp/ui5-schemas',
  download: true,
  upgrade: true,
  link: true,
}) {
  let allLibs = {};

  // do the downloading and encapsulate in Promise
  const dlPromise = new Promise((resolve, reject) => {
    download.allLibsFile(options)
      .then((allLibsJSON) => {
        allLibs = allLibsJSON;
        download.schemas(options, allLibs)
          .then((values) => {
            resolve(values);
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });


  dlPromise.then((values) => {
    console.log('\nYay, all schema files were successfully downloaded!\n');
    if (options.upgrade) {
      upgrade(options, allLibs);
    }
    if (options.link) {
      link(options, allLibs);
    }
  }, (e) => {
    console.log('Damn... Something went all wrong while downloading the schema files!');
    console.log(e);
  });
};


exports.ui5_schema();
