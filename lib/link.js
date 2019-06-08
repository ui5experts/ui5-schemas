const path = require('path');
const fs = require('fs-extra');
const xml2js = require('xml2js');
const Minilog = require('minilog');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();
const log = Minilog('ui5-schemas');


const idePaths = {
  idea: {
    base: path.join(process.cwd(), '.idea'),
    schemaRegistry: path.join(process.cwd(), '.idea/misc.xml'),
    template: path.join(__dirname, '../templates/misc.xml'),
  },
  eclipse: '',
};


function createIdeaRegEntry(url, location) {
  return {
    $: {
      url,
      location: `${location}`,
    },
  };
}


function registerLibs(data, allLibs) {
  try {
    parser.parseString(data, (err, result) => {
      if (err) {
        log.error('[link]', err);
        return;
      }

      const projectResourcesElement = {
        $: {
          name: 'ProjectResources',
        },
        resource: [],
      };

      // ensure target element exists
      const misc = result;
      misc.project = misc.project || {};
      misc.project.component = misc.project.component || [projectResourcesElement];

      let projectResourcesObj = misc.project.component.find(element => element.$.name === 'ProjectResources');
      if (!projectResourcesObj) {
        projectResourcesObj = projectResourcesElement;
        misc.project.component.push(projectResourcesObj);
      }

      const projectResources = projectResourcesObj.resource;
      const allLibsRegistry = allLibs.all_libs;
      for (let i = 0; i < allLibsRegistry.length; i += 1) {
        const lib = allLibsRegistry[i];
        const schemaURL = lib.entry.replace(/\//g, '.');

        let libRegEntry = projectResources.filter(item => item.$.url === schemaURL);
        if (libRegEntry.length) {
          log.debug('[link]', `Updating schema location of lib '${schemaURL}' ...`);
          libRegEntry[0].$.location = lib.location;
        } else {
          log.debug('[link]', `Creating new schema entry for lib '${schemaURL}' ...`);
          libRegEntry = createIdeaRegEntry(schemaURL, lib.location);
          projectResources.push(libRegEntry);
        }
      }

      fs.outputFile(idePaths.idea.schemaRegistry, builder.buildObject(misc))
        .then(() => {
          log.info('[link]', 'Schemas successfully registered!');
        })
        .catch(() => {
          log.error('[link]', 'Ough... Problem occured during schema registration!');
        });
    });
  } catch (e) {
    log.error(e);
  }
}


function idea(options, allLibs) {
  fs.pathExists(idePaths.idea.base)
    .then((exists) => {
      if (!exists) {
        return;
      }
      log.info('[link]', 'Discovered an .idea project! Registering schemas...');

      fs.readFile(idePaths.idea.schemaRegistry)
        .then((data) => {
          registerLibs(data, allLibs);
        })
        .catch((err) => {
          log.debug('[link]', err);
          log.warn('[link]', `'${idePaths.idea.schemaRegistry}' doesn't exist. Creating...`);
          fs.copy(idePaths.idea.template, idePaths.idea.schemaRegistry)
            .then(() => {
              // recurse and start again from scratch
              idea(options, allLibs);
            })
            .catch((copyErr) => {
              log.error('[link]', copyErr);
            });
        });
    });
}


module.exports = function link(options, allLibs) {
  idea(options, allLibs);
};
