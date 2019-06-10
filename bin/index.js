#!/usr/bin/env node
const yargs = require('yargs');

const ui5Schemas = require('../lib/main');
const Options = require('../lib/Options');


const { argv } = yargs.usage('Usage: ui5-schemas [options]')
  .example('ui5-schemas --sdk openui5 --version 1.28.15', 'Setup with openui5 schemas in version 1.28.15')
  .example('ui5-schemas --sdk openui5nightly', 'Setup with openui5nightly')
  .example('ui5-schemas --origin \'/Users/cschuff/Downloads/sapui5-sdk-1.65.1\'', 'Setup schemas from local sdk download')
  .example('ui5-schemas --origin \'https://my.abap.system/sap/public/bc/ui5_ui5\'', 'Setup schemas from sdk on an ABAP system')
  .example('ui5-schemas --no-upgrade', 'Setup schemas without schema enhancement')
  .example('npx ui5-schemas --sdk openui5 --version 1.28.15', 'NPM5')

  .option('origin', {
    describe: 'The src url (sdk base url) or path (sdk root dir) to be used for schema loading.',
    type: 'string',
  })

  .option('sdk', {
    demandOption: true,
    default: 'sapui5',
    describe: 'The sdk to be used.',
    choices: ['sapui5', 'openui5', 'openui5nightly'],
    type: 'string',
  })

  .version(false)
  .option('version', {
    alias: 'v',
    demandOption: true,
    default: '',
    describe: 'The UI5 version to be used, defaults to \'\' which means latest.',
    type: 'string',
  })

// .describe('libs', 'Comma-separated list of UI5 libraries that should be downloaded (and linked'
//   + ' to your project), e.g. "sap.ui.core, sap.m" .')

  .option('upgrade', {
    demandOption: true,
    default: true,
    describe: 'Whether to upgrade UI5 schemas for a better development experience or leave them untouched.',
    type: 'boolean',
  })

  .option('link', {
    demandOption: true,
    default: true,
    describe: 'Whether to auto-link UI5 schemas with your favorite IDE (if it is WebStorm ;).',
    type: 'boolean',
  })

  .option('debug', {
    demandOption: true,
    default: process.env.SYSTEM_DEBUG === 'true',
    describe: 'Whether to show debug output',
    type: 'boolean',
  })

  .help('h')
  .alias('h', 'help');


const options = new Options(argv);
ui5Schemas(options);
