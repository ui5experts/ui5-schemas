# UI5 Schemas

[![Build Status](https://travis-ci.org/ui5experts/ui5-schemas.svg?branch=master)](https://travis-ci.org/ui5experts/ui5-schemas)
[![npm version](https://img.shields.io/npm/v/ui5-schemas.svg)](https://www.npmjs.com/package/ui5-schemas)
[![dependency health](https://david-dm.org/ui5experts/ui5-schemas/status.svg)]()
[![dependency health](https://david-dm.org/ui5experts/ui5-schemas/dev-status.svg)]()
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()


## What is UI5 Schemas?

UI5 Schemas allows you to develop SAPUI5/OpenUI5 XML at a maximum convenience. It downloads, upgrades and sets
up SAPUI5/OpenUI5 XML schemas for a better development experience in your favorite IDE (if it is WebStorm ;).

![](./docs/xml-code-completion.gif)


## Getting Started

```sh
npm install -g ui5-schemas
```

```sh
ui5-schemas
```

npm 5:
```sh
npx ui5-schemas
````

Use cli option ``--help`` for more details

```
$ ui5-schemas --help

Usage: ui5-schemas [options]

Options:
  --sdk          The sdk to be used. Valid options are 'sapui5' or 'openui5'.   [default: "sapui5"]
  -v, --version  The UI5 version to be used, defaults to '' which means latest. [default: ""]
  --outputDir    The base directory to output UI5 schemas to.                   [default: ".tmp/ui5-schemas"]
  --upgrade      Whether to upgrade UI5 schemas for a better development
                 experience or leave them untouched.                            [default: true]
  --link         Whether to auto-link UI5 schemas with your favorite IDE (if it
                 is WebStorm ;).                                                [default: true]
  -h, --help     Show help                                                      [boolean]
  --debug                                                                       [default: (generated-value)]

Examples:
  ui5-schemas --sdk openui5 --version 1.28.15       Setup with openui5 schemas in version 1.28.15
  npx ui5-schemas --sdk openui5 --version 1.28.15   NPM5
```


## Features


## Troubleshooting

Proxies used according to [npm module request](https://www.npmjs.com/package/request#proxies).


## What is yet to come?

* Eclipse support
* Feel free to [open an issue](https://github.com/ui5experts/ui5-schemas/issues/new) if you are missing something else!
