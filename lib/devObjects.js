function createInverterObjects(adapter, id, obj) {
    
    adapter.setObjectNotExists('inverter.' + id, {
        type: 'channel',
        common: {
            name: "inverter with device ID " + id,
            role: "info"
        },
        native: {}
    });
    if (obj.hasOwnProperty("DAY_ENERGY")) {
        adapter.setObjectNotExists('inverter.' + id + '.DAY_ENERGY', {
            type: 'state',
            common: {
                name: "day energy",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "Energy generated on current day"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("FAC")) {
        adapter.setObjectNotExists('inverter.' + id + '.FAC', {
            type: 'state',
            common: {
                name: "FAC",
                type: "number",
                role: "value",
                unit: "Hz",
                read: true,
                write: false,
                desc: "AC frequency"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("IAC")) {
        adapter.setObjectNotExists('inverter.' + id + '.IAC', {
            type: "state",
            common: {
                name: "IAC",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "AC current"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("IDC")) {
        adapter.setObjectNotExists('inverter.' + id + '.IDC', {
            type: "state",
            common: {
                name: "IDC",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "DC current"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PAC")) {
        adapter.setObjectNotExists('inverter.' + id + '.PAC', {
            type: "state",
            common: {
                name: "PAC",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "AC power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SAC")) {
        adapter.setObjectNotExists('inverter.' + id + '.SAC', {
            type: "state",
            common: {
                name: "Apparent power",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "Apparent power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("TOTAL_ENERGY")) {
        adapter.setObjectNotExists('inverter.' + id + '.TOTAL_ENERGY', {
            type: "state",
            common: {
                name: "total energy",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "Energy generated overall"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("UAC")) {
        adapter.setObjectNotExists('inverter.' + id + '.UAC', {
            type: "state",
            common: {
                name: "UAC",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "AC voltage"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("UDC")) {
        adapter.setObjectNotExists('inverter.' + id + '.UDC', {
            type: "state",
            common: {
                name: "UDC",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "DC voltage"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("YEAR_ENERGY")) {
        adapter.setObjectNotExists('inverter.' + id + '.YEAR_ENERGY', {
            type: "state",
            common: {
                name: "year energy",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "Energy generated in current year"
            },
            native: {}
        });
    }
    adapter.setObjectNotExists('inverter.' + id + '.StatusCode', {
        type: "state",
        common: {
            name: "status code",
            type: "number",
            role: "value",
            read: true,
            write: false,
            desc: "Status code for the inverter"
        },
        native: {}
    });
    adapter.setObjectNotExists('inverter.' + id + '.StatusCodeString', {
        type: "state",
        common: {
            name: "status code",
            type: "string",
            role: "value",
            read: true,
            write: false,
            desc: "Meaning of numerical status codes for the inverter"
        },
        native: {}
    });
    adapter.setObjectNotExists('inverter.' + id + '.ErrorCode', {
        type: "state",
        common: {
            name: "error code",
            type: "number",
            role: "value",
            read: true,
            write: false,
            desc: "Error code for the inverter"
        },
        native: {}
    });
    adapter.setObjectNotExists('inverter.' + id + '.ErrorCodeString', {
        type: "state",
        common: {
            name: "error code",
            type: "string",
            role: "value",
            read: true,
            write: false,
            desc: "Meaning of numerical error codes for the inverter"
        },
        native: {}
    });

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function () {
        adapter.log.debug("Fallback Missing Inverter Objects started")
        // fallback for not predefined parameters -> defined as number without unit
        for (var para in obj) {
            adapter.setObjectNotExists('inverter.' + id + '.' + para.toString(), {
                type: "state",
                common: {
                    name: para.toString(),
                    type: "mixed",
                    role: "value",
                    unit: "",
                    read: true,
                    write: false,
                    desc: para.toString()
                },
                native: {}
            });
        }
        adapter.log.debug("Fallback Missing Inverter Objects created!")
    }, 2000);
}

function createArchiveObjects(adapter, id, obj) {
    
    adapter.setObjectNotExists('inverter.' + id, {
        type: 'channel',
        common: {
            name: "inverter with device ID " + id,
            role: "info"
        },
        native: {}
    });

    if (obj.hasOwnProperty("Current_DC_String_1")) {
        adapter.setObjectNotExists('inverter.' + id + '.Current_DC_String_1', {
            type: "state",
            common: {
                name: "Current_DC_String_1",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "Current_DC_String_1"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Current_DC_String_2")) {
        adapter.setObjectNotExists('inverter.' + id + '.Current_DC_String_2', {
            type: "state",
            common: {
                name: "Current_DC_String_1",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "Current_DC_String_1"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Temperature_Powerstage")) {
        adapter.setObjectNotExists('inverter.' + id + '.Temperature_Powerstage', {
            type: "state",
            common: {
                name: "Temperature_Powerstage",
                type: "number",
                role: "value",
                unit: "°C",
                read: true,
                write: false,
                desc: "Temperature_Powerstage"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_DC_String_1")) {
        adapter.setObjectNotExists('inverter.' + id + '.Voltage_DC_String_1', {
            type: "state",
            common: {
                name: "Voltage_DC_String_1",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "Voltage_DC_String_1"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_DC_String_2")) {
        adapter.setObjectNotExists('inverter.' + id + '.Voltage_DC_String_2', {
            type: "state",
            common: {
                name: "Voltage_DC_String_2",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "Voltage_DC_String_2"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_DC_String_1") & obj.hasOwnProperty("Current_DC_String_1")) {
        adapter.setObjectNotExists('inverter.' + id + '.Power_DC_String_1', {
            type: "state",
            common: {
                name: "Power_DC_String_1",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "Power_DC_String_1"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_DC_String_2") & obj.hasOwnProperty("Current_DC_String_2")) {
        adapter.setObjectNotExists('inverter.' + id + '.Power_DC_String_2', {
            type: "state",
            common: {
                name: "Power_DC_String_2",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "Power_DC_String_2"
            },
            native: {}
        });
    }

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function () {
        adapter.log.debug("Fallback Missing Archive Objects started")
        // fallback for not predefined parameters -> defined as number without unit
        for (var para in obj) {
            adapter.setObjectNotExists('inverter.' + id + '.' + para.toString(), {
                type: "state",
                common: {
                    name: para.toString(),
                    type: "mixed",
                    role: "value",
                    unit: "",
                    read: true,
                    write: false,
                    desc: para.toString()
                },
                native: {}
            });
        }
        adapter.log.debug("Fallback Missing Archive Objects created!")
    }, 2000);
}

function createStorageObjects(adapter, id) {
    
    adapter.setObjectNotExists('storage', {
        type: 'channel',
        common: {
            name: "detailed information about Storage devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id, {
        type: 'channel',
        common: {
            name: "storage with device ID " + id,
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller', {
        type: 'channel',
        common: {
            name: "controller",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Model', {
        type: "state",
        common: {
            name: "ManufacturerModel Controller",
            type: "string",
            role: "value",
            read: true,
            write: false,
            desc: "Manufacturer & Model from controller"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Enable', {
        type: "state",
        common: {
            name: "enable",
            type: "boolean",
            role: "value",
            read: true,
            write: false,
            desc: "controller enabled"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.StateOfCharge_Relative', {
        type: "state",
        common: {
            name: "State of charge",
            type: "number",
            role: "value",
            unit: "?",
            read: true,
            write: false,
            desc: "Realative state of charge"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Voltage_DC', {
        type: "state",
        common: {
            name: "Voltage DC",
            type: "number",
            role: "value",
            unit: "V",
            read: true,
            write: false,
            desc: "Voltage DC"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Current_DC', {
        type: "state",
        common: {
            name: "Current DC",
            type: "number",
            role: "value",
            unit: "?",
            read: true,
            write: false,
            desc: "Current DC"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Temperature_Cell', {
        type: "state",
        common: {
            name: "Cell temperature",
            type: "number",
            role: "value",
            unit: "°C",
            read: true,
            write: false,
            desc: "Cell temperature"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Voltage_DC_Maximum_Cell', {
        type: "state",
        common: {
            name: "Voltage DC Maximum Cell",
            type: "number",
            role: "value",
            unit: "?",
            read: true,
            write: false,
            desc: "Voltage DC Maximum Cell"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.Voltage_DC_Minimum_Cell', {
        type: "state",
        common: {
            name: "Voltage DC Minimum Cell",
            type: "number",
            role: "value",
            unit: "?",
            read: true,
            write: false,
            desc: "Voltage DC Minimum Cell"
        },
        native: {}
    });
    adapter.setObjectNotExists('storage.' + id + '.controller.DesignedCapacity', {
        type: "state",
        common: {
            name: "Designed capacity",
            type: "number",
            role: "value",
            unit: "W",
            read: true,
            write: false,
            desc: "Designed capacity"
        },
        native: {}
    });

}

function createMeterObjects(adapter, id, obj) {

    

    adapter.log.debug("Creating missed MeterObjects...")
    adapter.setObjectNotExists('meter', {
        type: 'channel',
        common: {
            name: "detailed information about Meter devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('meter.' + id, {
        type: 'channel',
        common: {
            name: "meter with device ID " + id,
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('meter.' + id + '.Model', {
        type: "state",
        common: {
            name: "ManufacturerModel",
            type: "string",
            role: "value",
            read: true,
            write: false,
            desc: "Manufacturer & Model"
        },
        native: {}
    });
    adapter.setObjectNotExists('meter.' + id + '.Serial', {
        type: "state",
        common: {
            name: "Serialnumber",
            type: "string",
            role: "value",
            read: true,
            write: false,
            desc: "Smartmeter serial number"
        },
        native: {}
    });
    if (obj.hasOwnProperty("PowerReal_P_Sum")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReal_P_Sum', {
            type: "state",
            common: {
                name: "current power",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "current total power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReal_P_Phase_1")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReal_P_Phase_1', {
            type: "state",
            common: {
                name: "PowerReal_P_Phase_1",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReal_P_Phase_2")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReal_P_Phase_2', {
            type: "state",
            common: {
                name: "PowerReal_P_Phase_2",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReal_P_Phase_3")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReal_P_Phase_3', {
            type: "state",
            common: {
                name: "PowerReal_P_Phase_3",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReactive_Q_Sum")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReactive_Q_Sum', {
            type: "state",
            common: {
                name: "REACTIVE Power total",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERREACTIVE_MEAN_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERREACTIVE_MEAN_SUM_F64', {
            type: "state",
            common: {
                name: "REACTIVE Power total",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERREACTIVE_MEAN_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReactive_Q_Phase_1")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReactive_Q_Phase_1', {
            type: "state",
            common: {
                name: "REACTIVE Power L1",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERREACTIVE_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERREACTIVE_01_F64', {
            type: "state",
            common: {
                name: "REACTIVE Power L1",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERREACTIVE_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReactive_Q_Phase_2")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReactive_Q_Phase_2', {
            type: "state",
            common: {
                name: "REACTIVE Power L2",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERREACTIVE_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERREACTIVE_02_F64', {
            type: "state",
            common: {
                name: "REACTIVE Power L2",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERREACTIVE_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerReactive_Q_Phase_3")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerReactive_Q_Phase_3', {
            type: "state",
            common: {
                name: "REACTIVE Power L3",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERREACTIVE_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERREACTIVE_03_F64', {
            type: "state",
            common: {
                name: "REACTIVE Power L3",
                type: "number",
                role: "value",
                unit: "VAr",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERREACTIVE_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Current_AC_Phase_1")) {
        adapter.setObjectNotExists('meter.' + id + '.Current_AC_Phase_1', {
            type: "state",
            common: {
                name: "AC current L1",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ACBRIDGE_CURRENT_ACTIVE_MEAN_01_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.ACBRIDGE_CURRENT_ACTIVE_MEAN_01_F32', {
            type: "state",
            common: {
                name: "AVG AC current L1",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "ACBRIDGE_CURRENT_ACTIVE_MEAN_01_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Current_AC_Phase_2")) {
        adapter.setObjectNotExists('meter.' + id + '.Current_AC_Phase_2', {
            type: "state",
            common: {
                name: "AC current L2",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ACBRIDGE_CURRENT_ACTIVE_MEAN_02_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.ACBRIDGE_CURRENT_ACTIVE_MEAN_02_F32', {
            type: "state",
            common: {
                name: "AVG AC current L2",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "ACBRIDGE_CURRENT_ACTIVE_MEAN_02_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Current_AC_Phase_3")) {
        adapter.setObjectNotExists('meter.' + id + '.Current_AC_Phase_3', {
            type: "state",
            common: {
                name: "AC current L3",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ACBRIDGE_CURRENT_ACTIVE_MEAN_03_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.ACBRIDGE_CURRENT_ACTIVE_MEAN_03_F32', {
            type: "state",
            common: {
                name: "AVG AC current L3",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "ACBRIDGE_CURRENT_ACTIVE_MEAN_03_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_AC_Phase_1")) {
        adapter.setObjectNotExists('meter.' + id + '.Voltage_AC_Phase_1', {
            type: "state",
            common: {
                name: "AC VOLTAGE L1",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_VOLTAGE_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_VOLTAGE_01_F64', {
            type: "state",
            common: {
                name: "AC VOLTAGE L1",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "SMARTMETER_VOLTAGE_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_VOLTAGE_MEAN_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_VOLTAGE_MEAN_01_F64', {
            type: "state",
            common: {
                name: "AVG AC VOLTAGE L1",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "SMARTMETER_VOLTAGE_MEAN_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_AC_Phase_2")) {
        adapter.setObjectNotExists('meter.' + id + '.Voltage_AC_Phase_2', {
            type: "state",
            common: {
                name: "AC VOLTAGE L2",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_VOLTAGE_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_VOLTAGE_02_F64', {
            type: "state",
            common: {
                name: "AC VOLTAGE L2",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "SMARTMETER_VOLTAGE_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_VOLTAGE_MEAN_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_VOLTAGE_MEAN_02_F64', {
            type: "state",
            common: {
                name: "AVG AC VOLTAGE L2",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "SMARTMETER_VOLTAGE_MEAN_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_AC_Phase_3")) {
        adapter.setObjectNotExists('meter.' + id + '.Voltage_AC_Phase_3', {
            type: "state",
            common: {
                name: "AC VOLTAGE L3",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_VOLTAGE_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_VOLTAGE_03_F64', {
            type: "state",
            common: {
                name: "AC VOLTAGE L3",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "SMARTMETER_VOLTAGE_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_VOLTAGE_MEAN_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_VOLTAGE_MEAN_03_F64', {
            type: "state",
            common: {
                name: "AVG AC VOLTAGE L3",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "SMARTMETER_VOLTAGE_MEAN_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_AC_PhaseToPhase_12")) {
        adapter.setObjectNotExists('meter.' + id + '.Voltage_AC_PhaseToPhase_12', {
            type: "state",
            common: {
                name: "Voltage_AC_PhaseToPhase_12",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ACBRIDGE_VOLTAGE_MEAN_12_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.ACBRIDGE_VOLTAGE_MEAN_12_F32', {
            type: "state",
            common: {
                name: "AVG AC voltage L1-L2",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "ACBRIDGE_VOLTAGE_MEAN_12_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_AC_PhaseToPhase_23")) {
        adapter.setObjectNotExists('meter.' + id + '.Voltage_AC_PhaseToPhase_23', {
            type: "state",
            common: {
                name: "Voltage_AC_PhaseToPhase_23",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ACBRIDGE_VOLTAGE_MEAN_23_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.ACBRIDGE_VOLTAGE_MEAN_23_F32', {
            type: "state",
            common: {
                name: "AVG AC voltage L2-L3",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "ACBRIDGE_VOLTAGE_MEAN_23_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Voltage_AC_PhaseToPhase_31")) {
        adapter.setObjectNotExists('meter.' + id + '.Voltage_AC_PhaseToPhase_31', {
            type: "state",
            common: {
                name: "Voltage_AC_PhaseToPhase_31",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ACBRIDGE_VOLTAGE_MEAN_31_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.ACBRIDGE_VOLTAGE_MEAN_31_F32', {
            type: "state",
            common: {
                name: "AVG AC voltage L3-L1",
                type: "number",
                role: "value",
                unit: "V",
                read: true,
                write: false,
                desc: "ACBRIDGE_VOLTAGE_MEAN_31_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Frequency_Phase_Average")) {
        adapter.setObjectNotExists('meter.' + id + '.Frequency_Phase_Average', {
            type: "state",
            common: {
                name: "AVG GRID FREQUENCY",
                type: "number",
                role: "value",
                unit: "Hz",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("GRID_FREQUENCY_MEAN_F32")) {
        adapter.setObjectNotExists('meter.' + id + '.GRID_FREQUENCY_MEAN_F32', {
            type: "state",
            common: {
                name: "AVG GRID FREQUENCY",
                type: "number",
                role: "value",
                unit: "Hz",
                read: true,
                write: false,
                desc: "GRID_FREQUENCY_MEAN_F32"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerApparent_S_Sum")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerApparent_S_Sum', {
            type: "state",
            common: {
                name: "APPARENT POWER total",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_01_F64', {
            type: "state",
            common: {
                name: "APPARENT POWER L1",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_02_F64', {
            type: "state",
            common: {
                name: "APPARENT POWER L2",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_03_F64', {
            type: "state",
            common: {
                name: "APPARENT Power L3",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_MEAN_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_MEAN_01_F64', {
            type: "state",
            common: {
                name: "AVG APPARENT Power L1",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_MEAN_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_MEAN_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_MEAN_02_F64', {
            type: "state",
            common: {
                name: "AVG APPARENT Power L2",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_MEAN_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_MEAN_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_MEAN_03_F64', {
            type: "state",
            common: {
                name: "AVG APPARENT Power L3",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_MEAN_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERAPPARENT_MEAN_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERAPPARENT_MEAN_SUM_F64', {
            type: "state",
            common: {
                name: "AVG APPARENT Power total",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERAPPARENT_MEAN_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerFactor_Sum")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerFactor_Sum', {
            type: "state",
            common: {
                name: "POWERFACTOR total",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_FACTOR_POWER_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_FACTOR_POWER_SUM_F64', {
            type: "state",
            common: {
                name: "POWERFACTOR total",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: "SMARTMETER_FACTOR_POWER_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerFactor_Phase_1")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerFactor_Phase_1', {
            type: "state",
            common: {
                name: "POWERFACTOR L1",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_FACTOR_POWER_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_FACTOR_POWER_01_F64', {
            type: "state",
            common: {
                name: "POWERFACTOR L1",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: "SMARTMETER_FACTOR_POWER_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerFactor_Phase_2")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerFactor_Phase_2', {
            type: "state",
            common: {
                name: "POWERFACTOR L2",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_FACTOR_POWER_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_FACTOR_POWER_02_F64', {
            type: "state",
            common: {
                name: "POWERFACTOR L2",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: "SMARTMETER_FACTOR_POWER_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerFactor_Phase_3")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerFactor_Phase_3', {
            type: "state",
            common: {
                name: "POWERFACTOR L3",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_FACTOR_POWER_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_FACTOR_POWER_03_F64', {
            type: "state",
            common: {
                name: "POWERFACTOR L3",
                type: "number",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: "SMARTMETER_FACTOR_POWER_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("EnergyReal_WAC_Sum_Produced")) {
        adapter.setObjectNotExists('meter.' + id + '.EnergyReal_WAC_Sum_Produced', {
            type: "state",
            common: {
                name: "SUM ACTIVE ENERGY PRODUCED",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_ENERGYACTIVE_PRODUCED_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_ENERGYACTIVE_PRODUCED_SUM_F64', {
            type: "state",
            common: {
                name: "SUM ACTIVE ENERGY PRODUCED",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "SMARTMETER_ENERGYACTIVE_PRODUCED_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("EnergyReal_WAC_Sum_Consumed")) {
        adapter.setObjectNotExists('meter.' + id + '.EnergyReal_WAC_Sum_Consumed', {
            type: "state",
            common: {
                name: "SUM ACTIVE ENERGY CONSUMED",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_ENERGYACTIVE_CONSUMED_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_ENERGYACTIVE_CONSUMED_SUM_F64', {
            type: "state",
            common: {
                name: "SUM ACTIVE ENERGY CONSUMED",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "SMARTMETER_ENERGYACTIVE_CONSUMED_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("EnergyReactive_VArAC_Sum_Produced")) {
        adapter.setObjectNotExists('meter.' + id + '.EnergyReactive_VArAC_Sum_Produced', {
            type: "state",
            common: {
                name: "SUM REACTIVE ENERGY PRODUCED",
                type: "number",
                role: "value",
                unit: "VArh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_ENERGYREACTIVE_PRODUCED_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_ENERGYREACTIVE_PRODUCED_SUM_F64', {
            type: "state",
            common: {
                name: "SUM REACTIVE ENERGY PRODUCED",
                type: "number",
                role: "value",
                unit: "VArh",
                read: true,
                write: false,
                desc: "SMARTMETER_ENERGYREACTIVE_PRODUCED_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("EnergyReactive_VArAC_Sum_Consumed")) {
        adapter.setObjectNotExists('meter.' + id + '.EnergyReactive_VArAC_Sum_Consumed', {
            type: "state",
            common: {
                name: "SUM REACTIVE ENERGY CONSUMED",
                type: "number",
                role: "value",
                unit: "VArh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_ENERGYREACTIVE_CONSUMED_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_ENERGYREACTIVE_CONSUMED_SUM_F64', {
            type: "state",
            common: {
                name: "SUM REACTIVE ENERGY CONSUMED",
                type: "number",
                role: "value",
                unit: "VArh",
                read: true,
                write: false,
                desc: "SMARTMETER_ENERGYREACTIVE_CONSUMED_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("EnergyReal_WAC_Plus_Absolute")) {
        adapter.setObjectNotExists('meter.' + id + '.EnergyReal_WAC_Plus_Absolute', {
            type: "state",
            common: {
                name: "ACTIVE Energy consumed from grid",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_ENERGYACTIVE_ABSOLUT_PLUS_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_ENERGYACTIVE_ABSOLUT_PLUS_F64', {
            type: "state",
            common: {
                name: "ACTIVE Energy consumed from grid",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "SMARTMETER_ENERGYACTIVE_ABSOLUT_PLUS_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("EnergyReal_WAC_Minus_Absolute")) {
        adapter.setObjectNotExists('meter.' + id + '.EnergyReal_WAC_Minus_Absolute', {
            type: "state",
            common: {
                name: "ACTIVE Energy feed in",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_ENERGYACTIVE_ABSOLUT_MINUS_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_ENERGYACTIVE_ABSOLUT_MINUS_F64', {
            type: "state",
            common: {
                name: "ACTIVE Energy feed in",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "SMARTMETER_ENERGYACTIVE_ABSOLUT_MINUS_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_01_F64', {
            type: "state",
            common: {
                name: "ACTIVE POWER L1",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_02_F64', {
            type: "state",
            common: {
                name: "ACTIVE POWER L2",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_03_F64', {
            type: "state",
            common: {
                name: "ACTIVE POWER L3",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_MEAN_01_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_MEAN_01_F64', {
            type: "state",
            common: {
                name: "AVG ACTIVE POWER L1",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_MEAN_01_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_MEAN_02_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_MEAN_02_F64', {
            type: "state",
            common: {
                name: "AVG ACTIVE POWER L2",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_MEAN_02_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_MEAN_03_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_MEAN_03_F64', {
            type: "state",
            common: {
                name: "AVG ACTIVE POWER L3",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_MEAN_03_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SMARTMETER_POWERACTIVE_MEAN_SUM_F64")) {
        adapter.setObjectNotExists('meter.' + id + '.SMARTMETER_POWERACTIVE_MEAN_SUM_F64', {
            type: "state",
            common: {
                name: "AVG ACTIVE POWER total",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "SMARTMETER_POWERACTIVE_MEAN_SUM_F64"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Current_AC_Sum")) {
        adapter.setObjectNotExists('meter.' + id + '.Current_AC_Sum', {
            type: "state",
            common: {
                name: "AC current Sum",
                type: "number",
                role: "value",
                unit: "A",
                read: true,
                write: false,
                desc: "Sum of all currents"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerApparent_S_Phase_1")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerApparent_S_Phase_1', {
            type: "state",
            common: {
                name: "PowerApparent_S_Phase_1",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerApparent_S_Phase_2")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerApparent_S_Phase_2', {
            type: "state",
            common: {
                name: "PowerApparent_S_Phase_2",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PowerApparent_S_Phase_3")) {
        adapter.setObjectNotExists('meter.' + id + '.PowerApparent_S_Phase_3', {
            type: "state",
            common: {
                name: "PowerApparent_S_Phase_3",
                type: "number",
                role: "value",
                unit: "VA",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    adapter.log.debug("MeterObjects created!")

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function () {
        adapter.log.debug("Fallback MissingMeterObjects started")
        // fallback for not predefined parameters -> defined as number without unit
        for (var para in obj) {
            if (para != "Details") {
                adapter.setObjectNotExists('meter.' + id + '.' + para.toString(), {
                    type: "state",
                    common: {
                        name: para.toString(),
                        type: "mixed",
                        role: "value",
                        unit: "",
                        read: true,
                        write: false,
                        desc: para.toString()
                    },
                    native: {}
                });
            }
        }
        adapter.log.debug("FAllback MissingMeterObjects created!")
    }, 2000);
}

function createSensorNowObjects(adapter, id) {
    
    adapter.setObjectNotExists('sensor', {
        type: 'channel',
        common: {
            name: "detailed information about Sensor devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('sensor.' + id, {
        type: 'channel',
        common: {
            name: "sensor with device ID " + id,
            role: "info"
        },
        native: {}
    });

}

function createSensorMinMaxObjects(adapter, id) {
    
    adapter.setObjectNotExists('sensor', {
        type: 'channel',
        common: {
            name: "detailed information about Sensor devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('sensor.' + id, {
        type: 'channel',
        common: {
            name: "sensor with device ID " + id,
            role: "info"
        },
        native: {}
    });

}

function createPowerFlowInverterObjects(adapter, inverter, obj) {
    

    if (obj.hasOwnProperty("E_Day")) {
        adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + '.E_Day', {
            type: "state",
            common: {
                name: "pv power day inverter " + inverter.toString(),
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("E_Total")) {
        adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + '.E_Total', {
            type: "state",
            common: {
                name: "pv power total inverter " + inverter.toString(),
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("E_Year")) {
        adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + '.E_Year', {
            type: "state",
            common: {
                name: "pv power year inverter " + inverter.toString(),
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P")) {
        adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + '.P', {
            type: "state",
            common: {
                name: "pv power inverter " + inverter.toString(),
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("DT")) {
        adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + '.DT', {
            type: "state",
            common: {
                name: "device type inverter " + inverter.toString(),
                type: "number",
                role: "value",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("DT")) {
        adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + '.DTString', {
            type: "state",
            common: {
                name: "device type inverter " + inverter.toString(),
                type: "string",
                role: "value",
                read: true,
                write: false,
                desc: ""
            },
            native: {}
        });
    }

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function () {
        adapter.log.debug("Fallback creating missing PowerflowInverter objects started");
        // fallback for not predefined parameters -> defined as number without unit
        for (var para in obj) {
            adapter.setObjectNotExists('powerflow.inverter' + inverter.toString() + "." + para.toString(), {
                type: "state",
                common: {
                    name: para.toString(),
                    type: "mixed",
                    role: "value",
                    unit: "",
                    read: true,
                    write: false,
                    desc: para.toString()
                },
                native: {}
            });
        }
        adapter.log.debug("Fallback creating missing PowerflowInverter objects finished!");
    }, 2000);
}

function createPowerFlowObjects(adapter, obj) {
    
    adapter.setObjectNotExists('powerflow', {
        type: 'channel',
        common: {
            name: "detailed information about the power flow",
            role: "info"
        },
        native: {}
    });

    if (obj.hasOwnProperty("Mode")) {
        adapter.setObjectNotExists('powerflow.Mode', {
            type: "state",
            common: {
                name: "Mode",
                type: "string",
                role: "value",
                read: true,
                write: false,
                desc: "Power Flow Mode"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P_Grid")) {
        adapter.setObjectNotExists('powerflow.P_Grid', {
            type: "state",
            common: {
                name: "grid power",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "grid power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P_Load")) {
        adapter.setObjectNotExists('powerflow.P_Load', {
            type: "state",
            common: {
                name: "load power",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "load power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P_Akku")) {
        adapter.setObjectNotExists('powerflow.P_Akku', {
            type: "state",
            common: {
                name: "akku power",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "akku power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P_PV")) {
        adapter.setObjectNotExists('powerflow.P_PV', {
            type: "state",
            common: {
                name: "pv power",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "pv power"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("E_Day")) {
        adapter.setObjectNotExists('powerflow.E_Day', {
            type: "state",
            common: {
                name: "pv power day",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "pv power day"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("E_Year")) {
        adapter.setObjectNotExists('powerflow.E_Year', {
            type: "state",
            common: {
                name: "pv power year",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "pv power year"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("E_Total")) {
        adapter.setObjectNotExists('powerflow.E_Total', {
            type: "state",
            common: {
                name: "pv power total",
                type: "number",
                role: "value",
                unit: "Wh",
                read: true,
                write: false,
                desc: "pv power total"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P_Autonomy")) {
        adapter.setObjectNotExists('powerflow.P_Autonomy', {
            type: "state",
            common: {
                name: "pv Autonomy",
                type: "number",
                role: "value",
                unit: "%",
                read: true,
                write: false,
                desc: "pv autonomy"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("rel_Autonomy")) {
        adapter.setObjectNotExists('powerflow.rel_Autonomy', {
            type: "state",
            common: {
                name: "pv Autonomy",
                type: "number",
                role: "value",
                unit: "%",
                read: true,
                write: false,
                desc: "pv autonomy"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("P_SelfConsumption")) {
        adapter.setObjectNotExists('powerflow.P_SelfConsumption', {
            type: "state",
            common: {
                name: "pv SelfConsumption",
                type: "number",
                role: "value",
                unit: "%",
                read: true,
                write: false,
                desc: "pv self consumption"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("rel_SelfConsumption")) {
        adapter.setObjectNotExists('powerflow.rel_SelfConsumption', {
            type: "state",
            common: {
                name: "pv SelfConsumption",
                type: "number",
                role: "value",
                unit: "%",
                read: true,
                write: false,
                desc: "pv self consumption"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("BatteryStandby")) {
        adapter.setObjectNotExists('powerflow.BatteryStandby', {
            type: "state",
            common: {
                name: "Battery standby",
                type: "boolean",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: "Battery standby"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("Meter_Location")) {
        adapter.setObjectNotExists('powerflow.Meter_Location', {
            type: "state",
            common: {
                name: "SmartMeter location",
                type: "string",
                role: "value",
                unit: "",
                read: true,
                write: false,
                desc: "Smartmeter location"
            },
            native: {}
        });
    }

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function () {
        adapter.log.debug("Fallback creating missing Powerflow objects started")
        // fallback for not predefined parameters -> defined as number without unit
        for (var para in obj) {
            adapter.setObjectNotExists('powerflow.' + para.toString(), {
                type: "state",
                common: {
                    name: para.toString(),
                    type: "mixed",
                    role: "value",
                    unit: "",
                    read: true,
                    write: false,
                    desc: para.toString()
                },
                native: {}
            });
        }
        adapter.log.debug("Fallback creating missing Powerflow objects finished!")
    }, 2000);
}

function createInverterInfoObjects(adapter, id, obj) {
    
    adapter.setObjectNotExists('inverterinfo', {
        type: 'channel',
        common: {
            name: "general information about the inverter",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('inverterinfo.' + id, {
        type: 'channel',
        common: {
            name: "inverterinfo with device ID " + id,
            role: "info"
        },
        native: {}
    });

    if (obj.hasOwnProperty("CustomName")) {
        adapter.setObjectNotExists('inverterinfo.' + id + '.CustomName', {
            type: "state",
            common: {
                name: "Custom name of the inverter",
                type: "string",
                role: "value",
                read: true,
                write: false,
                desc: "Custom name of the inverter"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("DT")) {
        adapter.setObjectNotExists('inverterinfo.' + id + '.DT', {
            type: "state",
            common: {
                name: "device type inverter " + id,
                type: "number",
                role: "value",
                read: true,
                write: false,
                desc: "device type inverter " + id
            },
            native: {}
        });
        adapter.setObjectNotExists('inverterinfo.' + id + '.DTString', {
            type: "state",
            common: {
                name: "device type inverter " + id,
                type: "string",
                role: "value",
                read: true,
                write: false,
                desc: "device type inverter " + id
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PVPower")) {
        adapter.setObjectNotExists('inverterinfo.' + id + '.PVPower', {
            type: "state",
            common: {
                name: "pv peak power",
                type: "number",
                role: "value",
                unit: "W",
                read: true,
                write: false,
                desc: "pv peak power"
            },
            native: {}
        });
    }

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function () {
        adapter.log.debug("Fallback creating missing InverterInfo objects started")
        // fallback for not predefined parameters -> defined as number without unit
        for (var para in obj) {
            adapter.setObjectNotExists('inverterinfo.' + id + '.' + para.toString(), {
                type: "state",
                common: {
                    name: para.toString(),
                    type: "mixed",
                    role: "value",
                    unit: "",
                    read: true,
                    write: false,
                    desc: para.toString()
                },
                native: {}
            });
        }
        adapter.log.debug("Fallback creating missing InverterInfo objects finished!")
    }, 2000);
}

function createInfoObjects(adapter, obj) {
    
    adapter.delObject('connection');
    adapter.delObject('lastsync');
    adapter.delObject('lastsyncarchive');
    adapter.delObject('HWVersion');
    adapter.delObject('SWVersion');

    adapter.setObjectNotExists('info', {
        type: 'channel',
        common: {
            name: "Information"
        },
        native: {}
    });
    adapter.setObjectNotExists('info.connection', {
        type: 'state',
        common: {
            name: "Fronius connected",
            type: "boolean",
            role: "indicator.connected",
            read: true,
            write: false,
            def: false,
            desc: "Is Fronius inverter connected?"
        },
        native: {}
    });
    adapter.setObjectNotExists('info.lastsync', {
        type: 'state',
        common: {
            name: "Last successful sync",
            type: "string",
            role: "value.datetime",
            read: true,
            write: false,
            desc: "Last successful synchronization"
        },
        native: {}
    });
    adapter.setObjectNotExists('info.lastsyncarchive', {
        type: 'state',
        common: {
            name: "Last successful sync of archive data",
            type: "string",
            role: "value.datetime",
            read: true,
            write: false,
            desc: "Last successful synchronization of archive data"
        },
        native: {}
    });
    if(obj === undefined){
        return;
    }
    if (obj.hasOwnProperty("HWVersion")) {
        adapter.setObjectNotExists('info.HWVersion', {
            type: 'state',
            common: {
                name: "Hardware Version",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "Hardware Version"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("SWVersion")) {
        adapter.setObjectNotExists('info.SWVersion', {
            type: 'state',
            common: {
                name: "Software Version",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "Software Version"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("CO2Factor")) {
        adapter.setObjectNotExists('info.CO2Factor', {
            type: 'state',
            common: {
                name: "CO2Factor",
                type: "number",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "CO2Factor"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("CO2Unit")) {
        adapter.setObjectNotExists('info.CO2Unit', {
            type: 'state',
            common: {
                name: "CO2Unit",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "CO2Unit"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("CashFactor")) {
        adapter.setObjectNotExists('info.CashFactor', {
            type: 'state',
            common: {
                name: "CashFactor",
                type: "number",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "CashFactor"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("CashCurrency")) {
        adapter.setObjectNotExists('info.CashCurrency', {
            type: 'state',
            common: {
                name: "CashCurrency",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "CashCurrency"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("DefaultLanguage")) {
        adapter.setObjectNotExists('info.DefaultLanguage', {
            type: 'state',
            common: {
                name: "DefaultLanguage",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "DefaultLanguage"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("DeliveryFactor")) {
        adapter.setObjectNotExists('info.DeliveryFactor', {
            type: 'state',
            common: {
                name: "DeliveryFactor",
                type: "number",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "DeliveryFactor"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("PlatformID")) {
        adapter.setObjectNotExists('info.PlatformID', {
            type: 'state',
            common: {
                name: "PlatformID",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "PlatformID"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("ProductID")) {
        adapter.setObjectNotExists('info.ProductID', {
            type: 'state',
            common: {
                name: "ProductID",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "ProductID"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("TimezoneLocation")) {
        adapter.setObjectNotExists('info.TimezoneLocation', {
            type: 'state',
            common: {
                name: "TimezoneLocation",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "TimezoneLocation"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("TimezoneName")) {
        adapter.setObjectNotExists('info.TimezoneName', {
            type: 'state',
            common: {
                name: "TimezoneName",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "TimezoneName"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("UTCOffset")) {
        adapter.setObjectNotExists('info.UTCOffset', {
            type: 'state',
            common: {
                name: "UTCOffset",
                type: "number",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "UTCOffset"
            },
            native: {}
        });
    }
    if (obj.hasOwnProperty("UniqueID")) {
        adapter.setObjectNotExists('info.UniqueID', {
            type: 'state',
            common: {
                name: "UniqueID",
                type: "string",
                role: "meta",
                read: true,
                write: false,
                def: "",
                desc: "UniqueID"
            },
            native: {}
        });
    }
}

exports.createInverterObjects = createInverterObjects;
exports.createArchiveObjects = createArchiveObjects;
exports.createStorageObjects = createStorageObjects;
exports.createMeterObjects = createMeterObjects;
exports.createSensorNowObjects = createSensorNowObjects;
exports.createSensorMinMaxObjects = createSensorMinMaxObjects;
exports.createPowerFlowInverterObjects = createPowerFlowInverterObjects;
exports.createPowerFlowObjects = createPowerFlowObjects;
exports.createInverterInfoObjects = createInverterInfoObjects;
exports.createInfoObjects = createInfoObjects;
