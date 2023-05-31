![Logo](admin/fronius.png)

# ioBroker.fronius

![GitHub license](https://img.shields.io/github/license/iobroker-community-adapters/ioBroker.fronius)](https://github.com/iobroker-community-adapters/ioBroker.fronius/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/iobroker.fronius.svg)](https://www.npmjs.com/package/iobroker.fronius)
![GitHub repo size](https://img.shields.io/github/repo-size/iobroker-community-adapters/ioBroker.fronius)
[![Translation status](https://weblate.iobroker.net/widgets/adapters/-/fronius/svg-badge.svg)](https://weblate.iobroker.net/engage/adapters/?utm_source=widget)</br>
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/iobroker-community-adapters/ioBroker.fronius)
![GitHub commits since latest release (by date)](https://img.shields.io/github/commits-since/iobroker-community-adapters/ioBroker.fronius/latest)
![GitHub last commit](https://img.shields.io/github/last-commit/iobroker-community-adapters/ioBroker.fronius)
![GitHub issues](https://img.shields.io/github/issues/iobroker-community-adapters/ioBroker.fronius)
</br>
**Version:** </br>
[![NPM version](http://img.shields.io/npm/v/iobroker.fronius.svg)](https://www.npmjs.com/package/iobroker.fronius)
![Current version in stable repository](https://iobroker.live/badges/fronius-stable.svg)
![Number of Installations](https://iobroker.live/badges/fronius-installed.svg)
</br>
**Tests:** </br>
[![Test and Release](https://github.com/iobroker-community-adapters/ioBroker.fronius/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/iobroker-community-adapters/ioBroker.fronius/actions/workflows/test-and-release.yml)
[![CodeQL](https://github.com/iobroker-community-adapters/ioBroker.fronius/actions/workflows/codeql.yml/badge.svg)](https://github.com/iobroker-community-adapters/ioBroker.fronius/actions/workflows/codeql.yml)

<!--
## Sentry
**This adapter uses Sentry libraries to automatically report exceptions and code errors to the developers.**
For more details and for information how to disable the error reporting see [Sentry-Plugin Documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry)! Sentry reporting is used starting with js-controller 3.0.
-->

## A Fronius inverter adapter for ioBroker

This is an ioBroker adapter for your Fronius PV inverter with Fronius Datalogger Web from version 2.0.4-1 onwards, Fronius Datamanager from version 3.0.3-1 onwards and Symo Gen24.

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

- (mcm1957) This is an intermediate test release only.

### 2.0.0-alpha.0 (2023-05-31)

- (mcm1957) Dependencies and toolset have been updated. This is an intermediate test release.

### 1.1.6 (2021-03-xx)

- (nkleber78) Fixed issue #97, Added some new predefined objects
- (nkleber78) Added Inverter Temperature readout (#86)

### 1.1.3 (2021-03-15)

- (nkleber78) Split main.js into multiple files for better maintenance
- (nkleber78) Prevent creating info objects which are not supported by the inverters
- (schweigel) Added archive request values
- (schweigel) Added archive polling intervall
- (schweigel) Added devicetype string

### 1.1.1 (2020-11-30)

- (schweigel) Added missing units
- (schweigel) Added inverterinfo

### 1.1.0 (2020-11-24)

- (nkleber78) Implementation change for support of SYMO GEN24
- (nkleber78) Fix issue with adapters connected state

### 1.0.5 (2019-01-18)

- (ldittmar) compact mode compatibility added
- (ldittmar) add chinese support

### 1.0.4

- (ldittmar) Fix assignment to constant variable error

### 1.0.3

- (ldittmar) Ready for Admin 3

### 1.0.2

- (tobintax) Bugfix - Inverter Query regarding PAC adjusted.

### 1.0.1

- (tobintax) Added more values from Smartmeter
- (tobintax) Added more Powerflow Values
- (tobintax) Removed Value "EnergyReal_WAC_Minus_Relative" . This Value had no result and is undocumented in the fronius api documentation.

### 1.0.0

- (ldittmar) Fixed little errors

### 0.0.5

- (ldittmar) Read storage data and error/status codes

### 0.0.4

- (ldittmar) Read more data

### 0.0.3

- (ldittmar) Improved installation routine

### 0.0.2

- (ldittmar) First data is read

### 0.0.1

- (ldittmar) initial commit

## License

The MIT License (MIT)

Copyright (c) 2023 ldittmar <iobroker@lmdsoft.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
