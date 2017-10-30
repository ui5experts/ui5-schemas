const download = require('./download');
const upgrade = require('./upgrade');
const link = require('./link');
const util = require('./util');
const Minilog = require('minilog');

const log = Minilog('ui5-schemas');


function createLogger(debug) {
  const myFilter = new Minilog.Filter();
  myFilter.clear().deny('ui5-schemas', debug ? '*' : 'debug');
  Minilog.pipe(myFilter)
    .pipe(Minilog.backends.console.formatMinilog)
    .pipe(Minilog.backends.console);
}


// TODO: Return Promise
const main = function (options = util.getDefaultOptions()) {
  createLogger(options.debug);
  log.info(`Preparing '${options.sdk}' schemas in version '${options.version || 'latest'}'...`);

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
    log.info('Yay, all schema files were successfully downloaded!');
    if (options.upgrade) {
      upgrade(options, allLibs);
    }
    if (options.link) {
      link(options, allLibs);
    }
  }, (e) => {
    log.error('Damn... Something went all wrong while downloading the schema files!');
    log.error(`Are you sure the version '${options.version}' is still available on '${options.sdk}' download pages?`);
    log.error(e);
  });
};


module.exports = main;
