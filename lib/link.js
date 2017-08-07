const path = require('path');
const fs = require('fs-extra');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();


const ideMetadataPaths = {
  idea: path.join(process.cwd(), '.idea'),
  ideaSchemaReg: path.join(process.cwd(), '.idea/misc.xml'),
  eclipse: '',
};


function createIdeaRegEntry(url, location) {
  // TODO: Make sure location is relative to project root
  return {
    $: {
      url,
      location: `$PROJECT_DIR$/${location}`,
    },
  };
}


function idea(options, allLibs) {
  fs.pathExists(ideMetadataPaths.idea)
    .then((exists) => {
      if (!exists) {
        return;
      }
      console.log('Discovered an .idea project!');
      console.log('Registering schemas...');

      fs.readFile(ideMetadataPaths.ideaSchemaReg)
        .then((data) => {
          parser.parseString(data, (err, result) => {
            if (err) {
              console.log(err);
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

            let projectResourcesObj = misc.project.component.find(element =>
              element.$.name === 'ProjectResources');
            if (!projectResourcesObj) {
              projectResourcesObj = projectResourcesElement;
              misc.project.component.push(projectResourcesObj);
            }

            const projectResources = projectResourcesObj.resource;
            const allLibsRegistry = allLibs.all_libs;
            for (let i = 0; i < allLibsRegistry.length; i += 1) {
              const lib = allLibsRegistry[i];
              const schemaURL = lib.entry.replace(/\//g, '.');
              const libRegEntry = createIdeaRegEntry(schemaURL, lib.location);
              projectResources.push(libRegEntry);
            }


            fs.outputFile(ideMetadataPaths.ideaSchemaReg, builder.buildObject(misc))
              .then(() => {
                console.log('\nSchemas successfully registered!');
              })
              .catch(() => {

              });
          });
        })
        .catch((err) => {
          console.error(err);
          // TODO: create file and add
        });
    });
}


module.exports = function (options, allLibs) {
  idea(options, allLibs);
};
