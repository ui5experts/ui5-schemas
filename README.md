![](./docs/ui5-schemas.png)

[![npm version](https://img.shields.io/npm/v/ui5-schemas.svg)](https://www.npmjs.com/package/ui5-schemas)
[![Build Status](https://travis-ci.org/ui5experts/ui5-schemas.svg?branch=master)](https://travis-ci.org/ui5experts/ui5-schemas)
[![bitHound Overall Score](https://www.bithound.io/github/ui5experts/ui5-schemas/badges/score.svg)](https://www.bithound.io/github/ui5experts/ui5-schemas)
[![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg)]()


## ⚠️ NOTE

As [SAP sunsetted the support for the SAPUI5 Tools for Eclipse](https://blogs.sap.com/2019/11/26/sapui5-tools-for-eclipse-now-is-the-time-to-look-for-alternatives/) they also removed the XSD schemas from the project. ui5-schemas obviously can not work without those schemas. If you want to continue using ui5-schemas keep using the latest available version of SAPUI5/OpenUI5 that includes schemas which is *1.71*.

I'm working together with the SAP colleagues to potentially find an alternative solution to keep this project alive. Stay tuned!

More detailed information on the issue in [sap/openui5#2751](https://github.com/SAP/openui5/issues/2751) resp. [ui5experts/ui5-schemas#47](https://github.com/ui5experts/ui5-schemas/issues/47)

## What is UI5 Schemas?

UI5 Schemas allows you to develop SAPUI5/OpenUI5 XML at a maximum convenience. It downloads, upgrades and sets
up SAPUI5/OpenUI5 XML schemas for a better development experience in your favorite IDE (if it is WebStorm ;).

![](./docs/xml-code-completion.gif)


## Getting Started

```sh
$ npm install -g ui5-schemas
```

```sh
$ ui5-schemas
```

npm 5:
```sh
$ npx ui5-schemas
````

Use cli option ``--help`` for more details

```sh
$ ui5-schemas --help

Usage: ui5-schemas [options]

Options:
  --origin       The src url (sdk base url) or path (sdk root dir) to be used
                 for schema loading.                                    [string]
  --sdk          The sdk to be used.
   [string] [choices: "sapui5", "openui5", "openui5nightly"] [default: "sapui5"]
  --version, -v  The UI5 version to be used, defaults to '' which means latest.
                                                          [string] [default: ""]
  --upgrade      Whether to upgrade UI5 schemas for a better development
                 experience or leave them untouched.
                                                       [boolean] [default: true]
  --link         Whether to auto-link UI5 schemas with your favorite IDE (if it
                 is WebStorm ;).                       [boolean] [default: true]
  --debug        Whether to show debug output
                                                      [boolean] [default: false]
  -h, --help     Show help

Examples:
  ui5-schemas --sdk openui5 --version 1.28.15       Setup with openui5 schemas in version 1.28.15
  ui5-schemas --sdk openui5nightly                  Setup with openui5nightly
  ui5-schemas --origin '/Users/cschuff/Downloads/sapui5-sdk-1.65.1'  
                                                    Setup schemas from local sdk download
  ui5-schemas --origin 'https://my.abap.system/sap/public/bc/ui5_ui5'  
                                                    Setup schemas from sdk on an ABAP system
  ui5-schemas --no-upgrade                          Setup schemas without schema enhancement
  npx ui5-schemas --sdk openui5 --version 1.28.15   NPM5
```


## Features

### Custom Origin
Install schemas from any origin: Use the CDN, a downloaded SDK or even your own remote system.

### Multi-SDK Support
Use the 'OpenUI5', 'OpenUI5 Nightly' or 'SAPUI5' SDK for your project.

### Multi-Version Support
Use any available OpenUI5/SAPUI5 version in your project. Switch versions with ease!


## Known Limitations

The xml schema files provided by SAP come with some limitations that this module does not fix (yet):
* Binding syntax is not supported ([#3](https://github.com/ui5experts/ui5-schemas/issues/3))
* Aggregation Bindings that can be written as properties ([#29](https://github.com/ui5experts/ui5-schemas/issues/29))
* ...


## Usage behind Proxies

Proxies used according to [npm module request](https://www.npmjs.com/package/request#proxies). Make sure to have set the following env vars:
* HTTP_PROXY / http_proxy
* HTTPS_PROXY / https_proxy
* NO_PROXY / no_proxy

If you are behind a corporate proxy and experience 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY' it is most probably due to an invalid proxy certificate. You can still run ui5-schemas like this at your own risk:
```sh
NODE_TLS_REJECT_UNAUTHORIZED=0 ui5-schemas
# windows
set NODE_TLS_REJECT_UNAUTHORIZED=0
ui5-schemas
```

If none of this works just download a SAPUI5/OpenUI5 SDK and install schemas from the filesystem:
```sh
$ ui5-schemas --origin '/Users/cschuff/Downloads/sapui5-sdk-1.65.1'
```


## What is yet to come?

* Eclipse support
* Feel free to [open an issue](https://github.com/ui5experts/ui5-schemas/issues/new) if you are missing something else!
