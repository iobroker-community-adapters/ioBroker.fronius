function getStringErrorCode100(errorcode) {
    switch (errorcode) {
        case 102:
            return "AC voltage too high";
        case 103:
            return "AC voltage too low";
        case 105:
            return "AC frequency too high";
        case 106:
            return "AC frequency too low";
        case 107:
            return "AC grid outside the permissible limits";
        case 108:
            return "Stand alone operation detected";
        default:
            return "";
    }
}

function getStringErrorCode300(errorcode) {
    switch (errorcode) {
        case 301:
            return "Overcurrent (AC)";
        case 302:
            return "Overcurrent (DC)";
        case 303:
            return "DC module over temperature";
        case 304:
            return "AC module over temperature";
        case 305:
            return "No power being fed in, despite closed relay";
        case 306:
            return "PV output too low for feeding energy into the grid";
        case 307:
            return "LOW PV VOLTAGE! DC input voltage too low for feeding energy into the grid";
        case 308:
            return "Intermediate circuit voltage too high";
        case 309:
            return "DC input voltage MPPT 1 too high";
        case 311:
            return "Polarity of DC strings reversed";
        case 313:
            return "DC input voltage MPPT 2 too high";
        case 314:
            return "Current sensor calibration timeout";
        case 315:
            return "AC current sensor error";
        case 316:
            return "Interrupt Check fail";
        case 325:
            return "Overtemperature in the connection area";
        case 326:
            return "Fan 1 error";
        case 327:
            return "Fan 2 error";
        default:
            return "";
    }
}

function getStringErrorCode400(errorcode) {
    switch (errorcode) {
        case 401:
            return "No communication possible with the power stage set";
        case 406:
            return "AC module temperature sensor faulty (L1)";
        case 407:
            return "AC module temperature sensor faulty (L2)";
        case 408:
            return "DC component measured in the grid too high";
        case 412:
            return "Fixed voltage mode has been selected instead of MPP voltage mode and the fixed voltage has been set to too low or too high a value";
        case 415:
            return "Safety cut out via option card or RECERBO has triggered";
        case 416:
            return "No communication possible between power stage set and control system";
        case 417:
            return "Hardware ID problem";
        case 419:
            return "Unique ID conflict";
        case 420:
            return "No communication possible with the Hybrid manager";
        case 421:
            return "HID range error";
        case 425:
            return "No communication with the power stage set possible";
        case 426:
        case 427:
        case 428:
            return "Possible hardware fault";
        case 431:
            return "Software problem";
        case 436:
            return "Functional incompatibility (one or more PC boards in the inverter are not compatible with each other, e.g. after a PC board has been replaced.";
        case 437:
            return "Power stage set problem";
        case 438:
            return "Functional incompatibility (one or more PC boards in the inverter in the inverter are not compatible with each other, e.g. after a PC board has been replaced)";
        case 443:
            return "Intermediate circuit voltage too low or asymmetric";
        case 445:
            return "– Compatability error (e.g. due to replacement of a PC board) – invalid power stage set configuration";
        case 447:
            return "Insulation fault";
        case 448:
            return "Neutral conductor not connected";
        case 450:
            return "Guard cannot be found";
        case 451:
            return "Memory error detected";
        case 452:
            return "Communication error between the processors";
        case 453:
            return "Grid voltage and power stage set are incompatible";
        case 454:
            return "Grid frequency and power stage set are incompatible";
        case 456:
            return "Anti-islanding function is no longer implemented correctly";
        case 457:
            return "Grid relay sticking or the neutral conductor ground voltage is too high";
        case 458:
            return "Error when recording the measuring signal";
        case 459:
            return "Error when recording the measuring signal for the insulation test";
        case 460:
            return "Reference voltage source for the digital signal processor (DSP) is working out of tolerance";
        case 461:
            return "Fault in the DSP data memory";
        case 462:
            return "Error with DC feed monitoring routine";
        case 463:
            return "Reversed AC polarity, AC connector inserted incorrectly";
        case 474:
            return "RCMU sensor faulty";
        case 475:
            return "Solar panel ground fault, insulation fault (connection between solar panel and ground)";
        case 476:
            return "Driver supply voltage too low";
        case 480:
        case 481:
            return "Functional incompatibility (one or more PC boards in the inverter are not compatible with each other, e.g. after a PC board has been replaced)";
        case 482:
            return "Setup after the initial start-up was interrupted";
        case 483:
            return "Voltage UDC fixed on MPP2 string out of limits";
        case 485:
            return "CAN transmit buffer is full";
        default:
            return "";
    }
}

function getStringErrorCode500(errorcode) {
    switch (errorcode) {
        case 502:
            return "Insulation error on the solar panels";
        case 509:
            return "No energy fed into the grid in the past 24 hours";
        case 515:
            return "No communication with filter possible";
        case 516:
            return "No communication possible with the storage unit";
        case 517:
            return "Power derating caused by too high a temperature";
        case 518:
            return "Internal DSP malfunction";
        case 519:
            return "No communication possible with the storage unit";
        case 520:
            return "No energy fed into the grid by MPPT1 in the past 24 hours";
        case 522:
            return "DC low string 1";
        case 523:
            return "DC low string 2";
        case 558:
        case 559:
            return "Functional incompatibility (one or more PC boards in the inverter are not compatible with each other, e.g. after a PC board has been replaced)";
        case 560:
            return "Derating caused by over-frequency";
        case 564:
            return "Functional incompatibility (one or more PC boards in the inverter are not compatible with each other, e.g. after a PC board has been replaced)";
        case 566:
            return "Arc detector switched off (e.g. during external arc monitoring)";
        case 567:
            return "Grid Voltage Dependent Power Reduction is active";
        default:
            return "";
    }
}

function getStringErrorCode600(errorcode) {
    switch (errorcode) {
        case 601:
            return "CAN bus is full";
        case 603:
            return "AC module temperature sensor faulty (L3)";
        case 604:
            return "DC module temperature sensor faulty";
        case 607:
            return "RCMU error";
        case 608:
            return "Functional incompatibility (one or more PC boards in the inverter are not compatible with each other, e.g. after a PC board has been replaced)";
        default:
            return "";
    }
}

function getStringErrorCode700(errorcode) {
    switch (errorcode) {
        case 701:
        case 702:
        case 703:
        case 704:
        case 705:
        case 706:
        case 707:
        case 708:
        case 709:
        case 710:
        case 711:
        case 712:
        case 713:
        case 714:
        case 715:
        case 716:
            return "Provides information about the internal processor status";
        case 721:
            return "EEPROM has been reinitialised";
        case 722:
        case 723:
        case 724:
        case 725:
        case 726:
        case 727:
        case 728:
        case 729:
        case 730:
            return "Provides information about the internal processor status";
        case 731:
            return "Initialisation error – USB flash drive is not supported";
        case 732:
            return "Initialisation erro – Over current on USB stick";
        case 733:
            return "No USB flash drive connected";
        case 734:
            return "Update file not recognised or not present";
        case 735:
            return "Update file does not match the device, update file too old";
        case 736:
            return "Write or read error occurred";
        case 737:
            return "File could not be opened";
        case 738:
            return "Log file cannot be saved (e.g. USB flash drive is write protected or full)";
        case 740:
            return "Initialisation error-error in file system on USB flash drive";
        case 741:
            return "Error during recording of logging data";
        case 743:
            return "Error occurred during update process";
        case 745:
            return "Update file corrupt";
        case 746:
            return "Error occurred during update process";
        case 751:
            return "Time lost";
        case 752:
            return "Real Time Clock module communication error";
        case 753:
            return "Internal error: Real Time Clock module is in emergency mode";
        case 754:
        case 755:
            return "Provides information about the processor status";
        case 757:
            return "Hardware error in the Real Time Clock module";
        case 758:
            return "Internal error: Real Time Clock module is in emergency mode";
        case 760:
            return "Internal hardware error";
        case 761:
        case 762:
        case 763:
        case 764:
        case 765:
            return "Provides information about the internal processor status";
        case 766:
            return "Emergency power de-rating has been activated";
        case 767:
            return "Provides information about the internal processor status";
        case 768:
            return "Different power limitation in the hardware modules";
        case 772:
            return "Storage unit not available";
        case 773:
            return "Software update group 0 (invalid country setup)";
        case 775:
            return "PMC power stage set not available";
        case 776:
            return "Invalid device type";
        case 781:
        case 782:
        case 783:
        case 784:
        case 785:
        case 786:
        case 787:
        case 788:
        case 789:
        case 790:
        case 791:
        case 792:
        case 793:
        case 794:
            return "Provides information about the internal processor status";
        default:
            return "";
    }
}

function getStringDeviceType(dt) {
    switch (dt) {
        case 54:
            return "Fronius Primo Hybrid 5.0-1 240";
        case 55:
            return "Fronius Primo Hybrid 6.0-1 240";
        case 56:
            return "Fronius Primo Hybrid 8.0-1 240";
        case 57:
            return "Fronius Primo Hybrid 10.0-1 240";
        case 58:
            return "Fronius Primo Hybrid 3.6-1";
        case 59:
            return "Fronius Primo Hybrid 4.0-1";
        case 60:
            return "Fronius Primo Hybrid 4.6-1";
        case 61:
            return "Fronius Primo Hybrid 5.0-1";
        case 62:
            return "Fronius Primo Hybrid 6.0-1";
        case 63:
            return "Fronius Primo Hybrid 8.0-1";
        case 64:
            return "Fronius Primo Hybrid 11.4-1";
        case 65:
            return "Fronius Primo Hybrid 10.0-1";
        case 66:
            return "Fronius Primo Hybrid 11.4-1 240";
        case 67:
            return "Fronius Primo 15.0-1 208-240";
        case 68:
            return "Fronius Primo 12.5-1 208-240";
        case 69:
            return "Fronius Primo 11.4-1 208-240";
        case 70:
            return "Fronius Primo 10.0-1 208-240";
        case 71:
            return "Fronius Symo 15.0-3 208";
        case 72:
            return "Fronius Eco 27.0-3-S";
        case 73:
            return "Fronius Eco 25.0-3-S";
        case 75:
            return "Fronius Primo 6.0-1";
        case 76:
            return "Fronius Primo 5.0-1";
        case 77:
            return "Fronius Primo 4.6-1";
        case 78:
            return "Fronius Primo 4.0-1";
        case 79:
            return "Fronius Primo 3.6-1";
        case 80:
            return "Fronius Primo 3.5-1";
        case 81:
            return "Fronius Primo 3.0-1";
        case 82:
            return "Fronius Symo Hybrid 4.0-3-S";
        case 83:
            return "Fronius Symo Hybrid 3.0-3-S";
        case 84:
            return "Fronius IG Plus 120 V-1";
        case 85:
            return "Fronius Primo 3.8-1 208-240";
        case 86:
            return "Fronius Primo 5.0-1 208-240";
        case 87:
            return "Fronius Primo 6.0-1 208-240";
        case 88:
            return "Fronius Primo 7.6-1 208-240";
        case 89:
            return "Fronius Symo 24.0-3 USA Dummy";
        case 90:
            return "Fronius Symo 24.0-3 480";
        case 91:
            return "Fronius Symo 22.7-3 480";
        case 92:
            return "Fronius Symo 20.0-3 480";
        case 93:
            return "Fronius Symo 17.5-3 480";
        case 94:
            return "Fronius Symo 15.0-3 480";
        case 95:
            return "Fronius Symo 12.5-3 480";
        case 96:
            return "Fronius Symo 10.0-3 480";
        case 97:
            return "Fronius Symo 12.0-3 208-240";
        case 98:
            return "Fronius Symo 10.0-3 208-240";
        case 99:
            return "Fronius Symo Hybrid 5.0-3-S";
        case 100:
            return "Fronius Primo 8.2-1 Dummy";
        case 101:
            return "Fronius Primo 8.2-1 208-240";
        case 102:
            return "Fronius Primo 8.2-1";
        case 103:
            return "Fronius Agilo TL 360.0-3";
        case 104:
            return "Fronius Agilo TL 460.0-3";
        case 105:
            return "Fronius Symo 7.0-3-M";
        case 106:
            return "Fronius Galvo 3.1-1 208-240";
        case 107:
            return "Fronius Galvo 2.5-1 208-240";
        case 108:
            return "Fronius Galvo 2.0-1 208-240";
        case 109:
            return "Fronius Galvo 1.5-1 208-240";
        case 110:
            return "Fronius Symo 6.0-3-M";
        case 111:
            return "Fronius Symo 4.5-3-M";
        case 112:
            return "Fronius Symo 3.7-3-M";
        case 113:
            return "Fronius Symo 3.0-3-M";
        case 114:
            return "Fronius Symo 17.5-3-M";
        case 115:
            return "Fronius Symo 15.0-3-M";
        case 116:
            return "Fronius Agilo 75.0-3 Outdoor";
        case 117:
            return "Fronius Agilo 100.0-3 Outdoor";
        case 118:
            return "Fronius IG Plus 55 V-1";
        case 119:
            return "Fronius IG Plus 55 V-2";
        case 120:
            return "Fronius Symo 20.0-3 Dummy";
        case 121:
            return "Fronius Symo 20.0-3-M";
        case 122:
            return "Fronius Symo 5.0-3-M";
        case 123:
            return "Fronius Symo 8.2-3-M";
        case 124:
            return "Fronius Symo 6.7-3-M";
        case 125:
            return "Fronius Symo 5.5-3-M";
        case 126:
            return "Fronius Symo 4.5-3-S";
        case 127:
            return "Fronius Symo 3.7-3-S";
        case 128:
            return "Fronius IG Plus 60 V-2";
        case 129:
            return "Fronius IG Plus 60 V-1";
        case 130:
            return "SPR 8001F - 3 EU";
        case 131:
            return "Fronius IG Plus 25 V - 1";
        case 132:
            return "Fronius IG Plus 100 V - 3";
        case 133:
            return "Fronius Agilo 100.0 - 3";
        case 134:
            return "SPR 3001F-1 EU";
        case 135:
            return "Fronius IG Plus V/A 10.0-3 Delta";
        case 136:
            return "Fronius IG 50";
        case 137:
            return "Fronius IG Plus 30 V-1";
        case 138:
            return "SPR - 11401f - 1 UNI";
        case 139:
            return "SPR-12001f-3 WYE277";
        case 140:
            return "SPR - 11401f - 3 Delta";
        case 141:
            return "SPR-10001f-1 UNI";
        case 142:
            return "SPR - 7501f - 1 UNI";
        case 143:
            return "SPR-6501f-1 UNI";
        case 144:
            return "SPR - 3801f - 1 UNI";
        case 145:
            return "SPR-3301f-1 UNI";
        case 146:
            return "SPR 12001F - 3 EU";
        case 147:
            return "SPR 10001F-3 EU";
        case 148:
            return "SPR 8001F - 2 EU";
        case 149:
            return "SPR 6501F-2 EU";
        case 150:
            return "SPR 4001F - 1 EU";
        case 151:
            return "SPR 3501F-1 EU";
        case 152:
            return "Fronius CL 60.0 WYE277 Dummy";
        case 153:
            return "Fronius CL 55.5 Delta Dummy";
        case 154:
            return "Fronius CL 60.0 Dummy";
        case 155:
            return "Fronius IG Plus V 12.0-3 Dummy";
        case 156:
            return "Fronius IG Plus V 7.5-1 Dummy";
        case 157:
            return "Fronius IG Plus V 3.8-1 Dummy";
        case 158:
            return "Fronius IG Plus 150 V-3 Dummy";
        case 159:
            return "Fronius IG Plus 100 V-2 Dummy";
        case 160:
            return "Fronius IG Plus 50 V-1 Dummy";
        case 161:
            return "Fronius IG Plus V/A 12.0-3 WYE";
        case 162:
            return "Fronius IG Plus V/A 11.4-3 Delta";
        case 163:
            return "Fronius IG Plus V/A 11.4-1 UNI";
        case 164:
            return "Fronius IG Plus V/A 10.0-1 UNI";
        case 165:
            return "Fronius IG Plus V/A 7.5-1 UNI";
        case 166:
            return "Fronius IG Plus V/A 6.0-1 UNI";
        case 167:
            return "Fronius IG Plus V/A 5.0-1 UNI";
        case 168:
            return "Fronius IG Plus V/A 3.8-1 UNI";
        case 169:
            return "Fronius IG Plus V/A 3.0-1 UNI";
        case 170:
            return "Fronius IG Plus 150 V-3";
        case 171:
            return "Fronius IG Plus 120 V-3";
        case 172:
            return "Fronius IG Plus 100 V-2";
        case 173:
            return "Fronius IG Plus 100 V-1";
        case 174:
            return "Fronius IG Plus 70 V-2";
        case 175:
            return "Fronius IG Plus 70 V-1";
        case 176:
            return "Fronius IG Plus 50 V-1";
        case 177:
            return "Fronius IG Plus 35 V-1";
        case 178:
            return "SPR 11400f - 3 208 / 240";
        case 179:
            return "SPR 12000f-277";
        case 180:
            return "SPR 10000f";
        case 181:
            return "SPR 10000F EU";
        case 182:
            return "Fronius CL 33.3 Delta";
        case 183:
            return "Fronius CL 44.4 Delta";
        case 184:
            return "Fronius CL 55.5 Delta";
        case 185:
            return "Fronius CL 36.0 WYE277";
        case 186:
            return "Fronius CL 48.0 WYE277";
        case 187:
            return "Fronius CL 60.0 WYE277";
        case 188:
            return "Fronius CL 36.0";
        case 189:
            return "Fronius CL 48.0";
        case 190:
            return "Fronius IG TL 3.0";
        case 191:
            return "Fronius IG TL 4.0";
        case 192:
            return "Fronius IG TL 5.0";
        case 193:
            return "Fronius IG TL 3.6";
        case 194:
            return "Fronius IG TL Dummy";
        case 195:
            return "Fronius IG TL 4.6";
        case 196:
            return "SPR 12000F EU";
        case 197:
            return "SPR 8000F EU";
        case 198:
            return "SPR 6500F EU";
        case 199:
            return "SPR 4000F EU";
        case 200:
            return "SPR 3300F EU";
        case 201:
            return "Fronius CL 60.0";
        case 202:
            return "SPR 12000f";
        case 203:
            return "SPR 8000f";
        case 204:
            return "SPR 6500f";
        case 205:
            return "SPR 4000f";
        case 206:
            return "SPR 3300f";
        case 207:
            return "Fronius IG Plus 12.0-3 WYE277";
        case 208:
            return "Fronius IG Plus 50";
        case 209:
            return "Fronius IG Plus 100";
        case 210:
            return "Fronius IG Plus 100";
        case 211:
            return "Fronius IG Plus 150";
        case 212:
            return "Fronius IG Plus 35";
        case 213:
            return "Fronius IG Plus 70";
        case 214:
            return "Fronius IG Plus 70";
        case 215:
            return "Fronius IG Plus 120";
        case 216:
            return "Fronius IG Plus 3.0-1 UNI";
        case 217:
            return "Fronius IG Plus 3.8-1 UNI";
        case 218:
            return "Fronius IG Plus 5.0-1 UNI";
        case 219:
            return "Fronius IG Plus 6.0-1 UNI";
        case 220:
            return "Fronius IG Plus 7.5-1 UNI";
        case 221:
            return "Fronius IG Plus 10.0-1 UNI";
        case 222:
            return "Fronius IG Plus 11.4-1 UNI";
        case 223:
            return "Fronius IG Plus 11.4-3 Delta";
        case 224:
            return "Fronius Galvo 3.0-1";
        case 225:
            return "Fronius Galvo 2.5-1";
        case 226:
            return "Fronius Galvo 2.0-1";
        case 227:
            return "Fronius IG 4500-LV";
        case 228:
            return "Fronius Galvo 1.5-1";
        case 229:
            return "Fronius IG 2500-LV";
        case 230:
            return "Fronius Agilo 75.0-3";
        case 231:
            return "Fronius Agilo 100.0-3 Dummy";
        case 232:
            return "Fronius Symo 10.0-3-M";
        case 233:
            return "Fronius Symo 12.5-3-M";
        case 234:
            return "Fronius IG 5100";
        case 235:
            return "Fronius IG 4000";
        case 236:
            return "Fronius Symo 8.2-3-M Dummy";
        case 237:
            return "Fronius IG 3000";
        case 238:
            return "Fronius IG 2000";
        case 239:
            return "Fronius Galvo 3.1-1 Dummy";
        case 240:
            return "Fronius IG Plus 80 V-3";
        case 241:
            return "Fronius IG Plus 60 V-3";
        case 242:
            return "Fronius IG Plus 55 V-3";
        case 243:
            return "Fronius IG 60 ADV";
        case 244:
            return "Fronius IG 500";
        case 245:
            return "Fronius IG 400";
        case 246:
            return "Fronius IG 300";
        case 247:
            return "Fronius Symo 3.0-3-S";
        case 248:
            return "Fronius Galvo 3.1-1";
        case 249:
            return "Fronius IG 60 HV";
        case 250:
            return "Fronius IG 40";
        case 251:
            return "Fronius IG 30 Dummy";
        case 252:
            return "Fronius IG 30";
        case 253:
            return "Fronius IG 20";
        case 254:
            return "Fronius IG 15";
        default:
            return "";
    }
}

function convertCustomname(nameraw) {
    var out = "";
    nameraw.split(';').forEach(function (entry) {
        if (entry != "") {
            out = out + String.fromCharCode(entry.replace("&#", ""));
        }
    });
    return out;
}

exports.getStringDeviceType = getStringDeviceType;
exports.getStringErrorCode100 = getStringErrorCode100;
exports.getStringErrorCode300 = getStringErrorCode300;
exports.getStringErrorCode400 = getStringErrorCode400;
exports.getStringErrorCode500 = getStringErrorCode500;
exports.getStringErrorCode600 = getStringErrorCode600;
exports.getStringErrorCode700 = getStringErrorCode700;
exports.convertCustomname = convertCustomname;

