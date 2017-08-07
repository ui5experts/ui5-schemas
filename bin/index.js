#!/usr/bin/env node

const download = require('../lib/download');
const upgrade = require('../lib/upgrade');
const link = require('../lib/link');
const yargs = require('yargs');

const argv = yargs.usage('Usage: ui5-schemas [options]')
  .example('ui5-schemas --sdk openui5 --version 1.28.15', 'Setup with openui5 schemas in version 1.28.15')
  .example('npx ui5-schemas --sdk openui5 --version 1.28.15', 'NPM5')
  .describe('sdk', 'The sdk to be used. Valid options are \'sapui5\' or \'openui5\'.')
  .describe('v', 'The UI5 version to be used, defaults to \'\' which means latest.')
  .alias('v', 'version')
  .describe('outputDir', 'The base directory to output UI5 schemas to.')
  .describe('upgrade', 'Whether to upgrade UI5 schemas for a better development experience or leave them untouched.')
  .describe('link', 'Whether to auto-link UI5 schemas with your favorite IDE (if it is WebStorm ;).')
  .help('h')
  .alias('h', 'help')
  .global(['sdk', 'v', 'outputDir', 'upgrade', 'link', 'debug'])
  .default({
    sdk: 'sapui5',
    v: '',
    outputDir: '.tmp/ui5-schemas',
    upgrade: true,
    link: true,
  })
  .default('debug', () => process.env.SYSTEM_DEBUG === 'true')
  .argv;


exports.ui5_schema = function (options = {
  sdk: 'sapui5',
  version: '',
  outputDir: '.tmp/ui5-schemas',
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


  dlPromise.then(() => {
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


exports.ui5_schema(argv);
