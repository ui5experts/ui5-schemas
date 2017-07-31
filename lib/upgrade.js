const path = require('path');
const fs = require('fs-extra');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();


function createAttributeJSON(name, type, docs) {
  return {
    $: {
      name,
      type,
    },
    'xsd:annotation': [
      {
        'xsd:documentation': [docs],
      },
    ],
  };
}


function sapUiCoreView(data) {
  console.log('Improving sap.ui.core.View');
  const view = data['xsd:schema']['xsd:complexType'].find((element) => {
    return element.$.name === '_ViewType';
  });
  const viewAttributes = view['xsd:complexContent'][0]['xsd:extension'][0]['xsd:attribute'];
  viewAttributes.push(createAttributeJSON('controllerName', 'xsd:string',
    'Name of the controller class to use for this view.'));
  viewAttributes.push(createAttributeJSON('resourceBundleName', 'xsd:string',
    '(module) Name of a resource bundle that should be loaded for this view'));
  viewAttributes.push(createAttributeJSON('resourceBundleUrl', 'xsd:string',
    'URL of a resource bundle that should be loaded for this view'));
  viewAttributes.push(createAttributeJSON('resourceBundleLocale', 'xsd:string',
    'Locale that should be used to load a resource bundle for this view'));
  viewAttributes.push(createAttributeJSON('resourceBundleAlias', 'xsd:string',
    'Model name under which the resource bundle should be stored.'));
}


function sapUiCoreControl(data) {
  console.log('Improving sap.ui.core.Control');
  const control = data['xsd:schema']['xsd:complexType'].find((element) => {
    return element.$.name === '_ControlType';
  });
  const controlAttributes = control['xsd:complexContent'][0]['xsd:extension'][0]['xsd:attribute'];
  controlAttributes.push(createAttributeJSON('class', 'xsd:string', 'A string that will be added ' +
    'to the "class" attribute of this control\'s root HTML element.'));
  // controlTypeAttributes.push(createAttributeJSON('viewName', 'xsd:string', ''));
  // controlTypeAttributes.push(createAttributeJSON('fragmentName', 'xsd:string', ''));
  controlAttributes.push(createAttributeJSON('binding', 'xsd:string', 'Bind the object to the ' +
    'referenced entity in the model, which is used as the binding context to resolve bound ' +
    'properties or aggregations of the object itself and all of its children relatively to the ' +
    'given path.'));
  // controlTypeAttributes.push(createAttributeJSON('metadataContexts', 'xsd:string', ''));
}


module.exports = function (options, allLibs) {
  const allLibsRegistry = allLibs.all_libs;
  console.log('Making schemas even cooler...\n');

  const sapUiCore = allLibsRegistry.find((element) => {
    return element.entry === 'sap/ui/core';
  });

  fs.readFile(sapUiCore.location, 'utf-8')
    .then((data) => {
      parser.parseString(data, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        sapUiCoreView(result);
        sapUiCoreControl(result);

        fs.outputFile(sapUiCore.location, builder.buildObject(result))
          .then((data) => {
          })
          .catch((fileErr) => {
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });


  // TODO: add aggregations as string properties (to allow for bindings)
  // TODO: add type string to any non-string property (to allow for bindings)
  // TODO: create a 'binding type'
  // TODO: add core:FragmentDefinition
  // TODO: add tooltip string property
  // TODO: Split up libs in separate sub-package schemas
  // https://regex101.com/r/9dtZZG/1

  // <xs:element name="data">
  //   <xs:simpleType>
  // <xs:union memberTypes="xs:date xs:decimal" />
  //   </xs:simpleType>
  // </xs:element>
  //
  // https://github.com/SAP/openui5/blob/e4416cb9e2bbc05ac76a64d79ea49b1fb5ca56a3/src/sap.ui.core/src/sap/ui/core/XMLTemplateProcessor.js
  // https://github.com/SAP/openui5/blob/e4416cb9e2bbc05ac76a64d79ea49b1fb5ca56a3/src/sap.ui.core/src/sap/ui/base/BindingParser.js
  // https://github.com/SAP/openui5/blob/e4416cb9e2bbc05ac76a64d79ea49b1fb5ca56a3/src/sap.ui.core/src/sap/ui/base/ExpressionParser.js
};
