#!/usr/bin/env node

const ui5Schemas = require('../lib/main');
const util = require('../lib/util');
const yargs = require('yargs');


const argv = yargs.usage('Usage: ui5-schemas [options]')

  .example('ui5-schemas --sdk openui5 --version 1.44.23', 'Setup with openui5 schemas in' +
    ' version 1.44.23')
  // .example('ui5-schemas --from /Volumes/Data/Users/cschuff/Downloads/sapui5-sdk-1.44.23', 'Setup' +
  //   ' from downloaded SDK')
  // .example('ui5-schemas --from http://<host>:<port>/sap/public/bc/ui5_ui5/1.44', 'Setup' +
  //   ' from SAPUI5 installation on an ABAP stack')
  .example('npx ui5-schemas --sdk openui5 --version 1.44.23', 'NPM5')

  .describe('sdk', 'The sdk to be used. Valid options are \'sapui5\' or \'openui5\'.')
  .choices('sdk', ['sapui5', 'openui5'])
  .describe('v', 'The UI5 version to be used, defaults to \'\' which means latest.')
  .alias('v', 'version')

  // .describe('from', 'URL or file system location to install schemas from')
  // .describe('f', 'from')

  .describe('libs', 'Comma-separated list of UI5 libraries that should be downloaded (and linked' +
    ' to your project), e.g. "sap.ui.core, sap.m" .')
  .describe('debug', 'Whether to show debug output')

  .help('h')
  .alias('h', 'help')

  .global(['sdk', 'v', 'outputDir', 'upgrade', 'link', 'debug', 'force'])
  .default(util.getDefaultOptions())
  .default('debug', () => process.env.SYSTEM_DEBUG === 'true')
  .argv;


argv.outputDir = util.getUI5SchemasDir();
ui5Schemas(argv);
