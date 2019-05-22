#!/usr/bin/env node
const yargs = require('yargs');

const ui5Schemas = require('../lib/main');
const util = require('../lib/util');


const { argv } = yargs.usage('Usage: ui5-schemas [options]')
  .example('ui5-schemas --sdk openui5 --version 1.28.15', 'Setup with openui5 schemas in version 1.28.15')
  .example('npx ui5-schemas --sdk openui5 --version 1.28.15', 'NPM5')

  .option('sdk', {
    demandOption: true,
    default: 'sapui5',
    describe: 'The sdk to be used. Valid options are \'sapui5\' or \'openui5\'.',
    choices: ['sapui5', 'openui5'],
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

  .describe('libs', 'Comma-separated list of UI5 libraries that should be downloaded (and linked'
    + ' to your project), e.g. "sap.ui.core, sap.m" .')

  .option('upgrade', {
    demandOption: true,
    default: false,
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


argv.outputDir = util.getUI5SchemasDir();
ui5Schemas(argv);
