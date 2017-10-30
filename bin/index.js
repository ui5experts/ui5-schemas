#!/usr/bin/env node

const ui5Schemas = require('../lib/main');
const util = require('../lib/util');
const yargs = require('yargs');


const argv = yargs.usage('Usage: ui5-schemas [options]')
  .example('ui5-schemas --sdk openui5 --version 1.28.15', 'Setup with openui5 schemas in version 1.28.15')
  .example('npx ui5-schemas --sdk openui5 --version 1.28.15', 'NPM5')
  .describe('sdk', 'The sdk to be used. Valid options are \'sapui5\' or \'openui5\'.')
  .choices('sdk', ['sapui5', 'openui5'])
  .describe('v', 'The UI5 version to be used, defaults to \'\' which means latest.')
  .alias('v', 'version')
  .describe('libs', 'Comma-separated list of UI5 libraries that should be downloaded (and linked' +
    ' to your project), e.g. "sap.ui.core, sap.m" .')
  .describe('upgrade', 'Whether to upgrade UI5 schemas for a better development experience or leave them untouched.')
  .describe('link', 'Whether to auto-link UI5 schemas with your favorite IDE (if it is WebStorm ;).')
  .describe('debug', 'Whether to show debug output')
  .help('h')
  .alias('h', 'help')
  .global(['sdk', 'v', 'outputDir', 'upgrade', 'link', 'debug', 'force'])
  .default(util.getDefaultOptions())
  .default('debug', () => process.env.SYSTEM_DEBUG === 'true')
  .argv;


argv.outputDir = util.getUI5SchemasDir();
ui5Schemas(argv);
