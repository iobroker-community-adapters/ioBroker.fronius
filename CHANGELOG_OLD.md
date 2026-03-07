# Older changes
## 2.0.0 (2023-06-04)

-   (nkleber78) Several errors resulting in missing data have been fixed. (#152, #242, #175)
-   (nkleber78) Several errors due to missing objects have been solved. (#206, #129, #76)
-   (nkleber78) The usage of the ping utility has been removed. (#169)
-   (nkleber78) Reading of mpp values has been added. (#78)
-   (nkleber78) 'Request' module has been replaced by 'axios'.
-   (nkleber78) Fixed changes related to GEN24 API update for latest FW incl. object creation for storage objects
-   (nkleber78) Fixed issue #97, Added some new predefined objects
-   (nkleber78) Added Inverter Temperature readout (#86)
-   (mcm1957) Dependencies and toolset have been updated.

## 1.1.3 (2021-03-15)

-   (nkleber78) Split main.js into multiple files for better maintenance
-   (nkleber78) Prevent creating info objects which are not supported by the inverters
-   (schweigel) Added archive request values
-   (schweigel) Added archive polling intervall
-   (schweigel) Added devicetype string

## 1.1.1 (2020-11-30)

-   (schweigel) Added missing units
-   (schweigel) Added inverterinfo

## 1.1.0 (2020-11-24)

-   (nkleber78) Implementation change for support of SYMO GEN24
-   (nkleber78) Fix issue with adapters connected state

## 1.0.5 (2019-01-18)

-   (ldittmar) compact mode compatibility added
-   (ldittmar) add chinese support

## 1.0.4

-   (ldittmar) Fix assignment to constant variable error

## 1.0.3

-   (ldittmar) Ready for Admin 3

## 1.0.2

-   (tobintax) Bugfix - Inverter Query regarding PAC adjusted.

## 1.0.1

-   (tobintax) Added more values from Smartmeter
-   (tobintax) Added more Powerflow Values
-   (tobintax) Removed Value "EnergyReal_WAC_Minus_Relative" . This Value had no result and is undocumented in the fronius api documentation.

## 1.0.0

-   (ldittmar) Fixed little errors

## 0.0.5

-   (ldittmar) Read storage data and error/status codes

## 0.0.4

-   (ldittmar) Read more data

## 0.0.3

-   (ldittmar) Improved installation routine

## 0.0.2

-   (ldittmar) First data is read

## 0.0.1

-   (ldittmar) initial commit