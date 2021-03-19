/**
 *
 *      ioBroker Fronius inverters Adapter
 *
 *      (c) 2017 ldittmar <iobroker@lmdsoft.de>
 *      (c) 2020 nkleber
 *
 *      MIT License
 * 
 *  changes:
 *  19.09.2020, nkleber:
 *      Modified creating and filling objects in a way that this will happen mostly dynamic.
 *      So if a object is not predefined, it will created with default settings and filled
 * 29.9.2020, nkleber
 *      Modified check of reachable Inverter in a way that a valid response is necessary to set the adapter to connected
 *
 * 21.11.2020, nkleber
 *      Improved object evaluation for Smartmeter (Type, Serial, Manufacturer) and Powerflow objects to get Battery info
 *
 * 16.1.2021, nkleber
 *      Improved the errorhandling vor Archive data (check prior if the specific object exists)
 */

/* global __dirname */
/* jshint -W097 */ // jshint strict:false
/*jslint node: true */
"use strict";

// you have to require the utils module and call adapter function
const utils = require('@iobroker/adapter-core'); // Get common adapter utils

const request = require('request');
const ping = require(__dirname + '/lib/ping');
const devStrings = require(__dirname + '/lib/devStrings');
const devObjects = require(__dirname + '/lib/devObjects');

let ip, baseurl, apiver, requestType;
let isConnected = null,
    isObjectsCreated = false,
    downCount = 5 /* this variable is used to ensure the object creation over multiple read cycles */;


// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluding extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.template.0
let adapter;

function startAdapter(options) {
    isObjectsCreated = false; // create missing objects if necessary only on start
    options = options || {};
    Object.assign(options, {
        name: 'fronius',
        undload: function(callback) {
            // is called when adapter shuts down - callback has to be called under any circumstances!
            try {
                adapter.log.info('cleaned everything up...');
                callback();
            } catch (e) {
                callback();
            }
        },
        objectChange: function(id, obj) {
            // is called if a subscribed object changes
            adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
        },
        stateChange: function(id, state) {
            // is called if a subscribed state changes
            // Warning, state can be null if it was deleted
            adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

            // you can use the ack flag to detect if it is status (true) or command (false)
            if (state && !state.ack) {
                adapter.log.info('ack is not set!');
            }
        },
        message: function(obj) {
            // Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
            let wait = false;
            if (obj) {
                switch (obj.command) {
                    case 'checkIP':
                        checkIP(obj.message, function(res) {
                            if (obj.callback)
                                adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                        });
                        wait = true;
                        break;
                    case 'getDeviceInfo':
                        getActiveDeviceInfo("System", obj.message, function(res) {
                            adapter.log.debug("DeviceInfoSystem: " + JSON.stringify(res))
                            if (obj.callback)
                                adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                        });
                        wait = true;
                        break;
                    case 'getDeviceInfoInverter':
                        getActiveDeviceInfo("Inverter", obj.message, function(res) {
                            adapter.log.debug("DeviceInfo Inverter: " + JSON.stringify(res))
                            if (obj.callback)
                                adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                        });
                        wait = true;
                        break;
                    case 'getDeviceInfoSensor':
                        getActiveDeviceInfo("SensorCard", obj.message, function(res) {
                            if (obj.callback)
                                adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                        });
                        wait = true;
                        break;
                    case 'getDeviceInfoString':
                        getActiveDeviceInfo("StringControl", obj.message, function(res) {
                            if (obj.callback)
                                adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                        });
                        wait = true;
                        break;
                    default:
                        adapter.log.warn("Unknown command: " + obj.command);
                        break;
                }
            }
            if (!wait && obj.callback) {
                adapter.sendTo(obj.from, obj.command, obj.message, obj.callback);
            }
            return true;
        },
        ready: main
    });
    adapter = new utils.Adapter(options);
    return adapter;
}

function resetStateToZero(API_response, basePath, state) {
    if (state in API_response) {
        return;
    } else {
        adapter.getState(basePath + "." + state, (err, stat) => {
            if (stat) {
                adapter.log.debug("State is found in objects but not on API: " + JSON.stringify(stat));
                if (stat.val != 0) {
                    adapter.setState(basePath + "." + state, 0, true);
                }
            }
        });
    }
}

//Check if IP is a Fronius inverter
function checkIP(ipToCheck, callback) {
    request.get(requestType + ipToCheck + '/solar_api/GetAPIVersion.cgi', function(error, response, body) {
        try {
            const testData = JSON.parse(body);
            if (!error && response.statusCode == 200 && 'BaseURL' in testData) {
                callback({ error: 0, message: testData });
            } else {
                adapter.log.error("IP invalid");
                callback({ error: 1, message: {} });
            }
        } catch (e) {
            adapter.log.error("IP is not a Fronis inverter");
            callback({ error: 1, message: {} });
        }
    });
}

//Check Fronius devices v1
function getActiveDeviceInfo(type, url, callback) {
    request.get(requestType + url + 'GetActiveDeviceInfo.cgi?DeviceClass=' + type, function(error, response, body) {
        try {
            const deviceData = JSON.parse(body);
            if (!error && response.statusCode == 200 && 'Body' in deviceData) {
                callback({ error: 0, message: deviceData.Body.Data });
            } else {
                adapter.log.warn(deviceData.Head.Status.Reason);
                callback({ error: 1, message: {} });
            }
        } catch (e) {
            callback({ error: 1, message: {} });
        }
    });
}

//Get Infos from Inverter
function getInverterRealtimeData(id) {
    // fallback if no id set
    if (id == "") {
        id = 1; // ensure that it is correct working for symoGEN24
    }
    request.get(requestType + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=3PInverterData', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {

                    const resp = data.Body.Data;
                    if (!isObjectsCreated) {
                        devObjects.createInverterObjects(adapter, id, resp);
                    }

                    for (var par in resp) {
                        adapter.setState("inverter." + id + "." + par.toString(), { val: resp[par.toString()].Value, ack: true });
                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " inverter: " + id);
                }
            } catch (e) {
                adapter.log.warn("getInverterRealtimeData (3PInverterData): " + e);
            }
        }
    });

    request.get(requestType + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=CommonInverterData', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {

                    const resp = data.Body.Data;
                    if (!isObjectsCreated) {
                        devObjects.createInverterObjects(adapter, id, resp);
                    }

                    for (var par in resp) {
                        adapter.setState("inverter." + id + "." + par.toString(), { val: resp[par.toString()].Value, ack: true });
                    }

                    // make sure to reset the values if they are no longer reported by the API
                    // Fixes issue #87 from Adapter
                    if (!("PAC" in resp)) {
                        resetStateToZero(resp, "inverter." + id, "FAC");
                        resetStateToZero(resp, "inverter." + id, "IAC");
                        resetStateToZero(resp, "inverter." + id, "IAC_L1");
                        resetStateToZero(resp, "inverter." + id, "IAC_L2");
                        resetStateToZero(resp, "inverter." + id, "IAC_L3");
                        resetStateToZero(resp, "inverter." + id, "IDC");
                        resetStateToZero(resp, "inverter." + id, "IDC_2");
                        resetStateToZero(resp, "inverter." + id, "PAC");
                        resetStateToZero(resp, "inverter." + id, "UAC");
                        resetStateToZero(resp, "inverter." + id, "UAC_L1");
                        resetStateToZero(resp, "inverter." + id, "UAC_L2");
                        resetStateToZero(resp, "inverter." + id, "UDC");
                        resetStateToZero(resp, "inverter." + id, "UDC_2");
                    }

                    const status = resp.DeviceStatus;
                    if (status) {
                        let statusCode = parseInt(status.StatusCode);
                        adapter.setState("inverter." + id + ".DeviceStatus", { val: JSON.stringify(status), ack: true });

                        adapter.setState("inverter." + id + ".StatusCode", { val: statusCode, ack: true });

                        let statusCodeString = "Startup";
                        if (statusCode === 7) {
                            statusCodeString = "Running";
                        } else if (statusCode === 8) {
                            statusCodeString = "Standby";
                        } else if (statusCode === 9) {
                            statusCodeString = "Bootloading";
                        } else if (statusCode === 10) {
                            statusCodeString = "Error";
                        }
                        if (status.hasOwnProperty("InverterState")) {
                            statusCodeString = status.InverterState;
                        }
                        adapter.setState("inverter." + id + ".StatusCodeString", { val: statusCodeString, ack: true });

                        statusCode = parseInt(status.ErrorCode);
                        adapter.setState("inverter." + id + ".ErrorCode", { val: statusCode, ack: true });

                        if (statusCode >= 700) {
                            statusCodeString = devStrings.getStringErrorCode700(statusCode);
                        } else if (statusCode >= 600) {
                            statusCodeString = devStrings.getStringErrorCode600(statusCode);
                        } else if (statusCode >= 500) {
                            statusCodeString = devStrings.getStringErrorCode500(statusCode);
                        } else if (statusCode >= 400) {
                            statusCodeString = devStrings.getStringErrorCode400(statusCode);
                        } else if (statusCode >= 300) {
                            statusCodeString = devStrings.getStringErrorCode300(statusCode);
                        } else {
                            statusCodeString = devStrings.getStringErrorCode100(statusCode);
                        }
                        adapter.setState("inverter." + id + ".ErrorCodeString", { val: statusCodeString, ack: true });
                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " inverter: " + id);
                }
            } catch (e) {
                adapter.log.warn("getInverterRealtimeData (CommonInverterData): " + e);
            }
        }
    });
}

//Get Infos from Inverter
function GetArchiveData(id) {
    // fallback if no id set
    if (id == "") {
        id = 1; // ensure correct working for symoGEN24 if no ID is set
    }

    var today = new Date();
    var datum = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
    request.get(requestType + ip + baseurl + 'GetArchiveData.cgi?Scope=System&StartDate=' + datum + '&EndDate=' + datum + '&Channel=Current_DC_String_1&Channel=Current_DC_String_2&Channel=Temperature_Powerstage&Channel=Voltage_DC_String_1&Channel=Voltage_DC_String_2', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data && "Data" in data.Body) {
                    var inverter = data.Body.Data["inverter/" + id];
                    var s1current, s2current;
                    if (typeof inverter === 'undefined' || inverter === null || !inverter.hasOwnProperty("Data")) { // if inverter object does not exists or does not have data property just exit
                        return;
                    }
                    const resp = inverter.Data;
                    if (!isObjectsCreated) {
                        devObjects.createArchiveObjects(adapter, id, resp);
                    }
                    if (resp.hasOwnProperty('Current_DC_String_1')) {
                        var values = inverter.Data.Current_DC_String_1.Values;
                        var keys = Object.keys(values);
                        s1current = values[keys[keys.length - 1]];
                        adapter.setState("inverter." + id + ".Current_DC_String_1", { val: s1current, ack: true });
                    }
                    if (resp.hasOwnProperty('Current_DC_String_2')) {
                        var values = inverter.Data.Current_DC_String_2.Values;
                        var keys = Object.keys(values);
                        s2current = values[keys[keys.length - 1]];
                        adapter.setState("inverter." + id + ".Current_DC_String_2", { val: s2current, ack: true });
                    }
                    if (resp.hasOwnProperty('Temperature_Powerstage')) {
                        var values = inverter.Data.Temperature_Powerstage.Values;
                        var keys = Object.keys(values);
                        var daten = values[keys[keys.length - 1]];
                        adapter.setState("inverter." + id + ".Temperature_Powerstage", { val: daten, ack: true });
                    }
                    if (resp.hasOwnProperty('Voltage_DC_String_1')) {
                        var values = inverter.Data.Voltage_DC_String_1.Values;
                        var keys = Object.keys(values);
                        var s1voltage = values[keys[keys.length - 1]];
                        adapter.setState("inverter." + id + ".Voltage_DC_String_1", { val: s1voltage, ack: true });
                        if (typeof s1current !== 'undefined') {
                            adapter.setState("inverter." + id + ".Power_DC_String_1", { val: s1voltage * s1current, ack: true });
                        }
                    }
                    if (resp.hasOwnProperty('Voltage_DC_String_2')) {
                        var values = inverter.Data.Voltage_DC_String_2.Values;
                        var keys = Object.keys(values);
                        var s2voltage = values[keys[keys.length - 1]];
                        adapter.setState("inverter." + id + ".Voltage_DC_String_2", { val: s2voltage, ack: true });
                        if (typeof s2current !== 'undefined') {
                            adapter.setState("inverter." + id + ".Power_DC_String_2", { val: s2voltage * s2current, ack: true });
                        }
                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " archive: " + id);
                }

            } catch (e) {
                adapter.log.warn("GetArchiveData: " + e);
            }
        }
    });
}

function getStorageRealtimeData(id) {
    request.get(requestType + ip + baseurl + 'GetStorageRealtimeData.cgi?Scope=Device&DeviceId=' + id, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    if (data.Body.Data != null) {
                        adapter.log.debug("Storage object is not supported: " + JSON.stringify(data));
                        return;
                    }
                    if (!isObjectsCreated) {
                        devObjects.createStorageObjects(adapter, id);
                    }

                    const resp = data.Body.Data.Controller;

                    adapter.setState("storage." + id + ".controller.Model", { val: resp.Details.Manufacturer + ' ' + resp.Details.Model, ack: true });
                    adapter.setState("storage." + id + ".controller.Enable", { val: resp.Enable === '1', ack: true });
                    adapter.setState("storage." + id + ".controller.StateOfCharge_Relative", { val: resp.StateOfCharge_Relative, ack: true });
                    adapter.setState("storage." + id + ".controller.Voltage_DC", { val: resp.Voltage_DC, ack: true });
                    adapter.setState("storage." + id + ".controller.Current_DC", { val: resp.Current_DC, ack: true });
                    adapter.setState("storage." + id + ".controller.Temperature_Cell", { val: resp.Temperature_Cell, ack: true });
                    adapter.setState("storage." + id + ".controller.Voltage_DC_Maximum_Cell", { val: resp.Voltage_DC_Maximum_Cell, ack: true });
                    adapter.setState("storage." + id + ".controller.Voltage_DC_Minimum_Cell", { val: resp.Voltage_DC_Minimum_Cell, ack: true });
                    adapter.setState("storage." + id + ".controller.DesignedCapacity", { val: resp.DesignedCapacity, ack: true });


                } else {
                    adapter.log.warn(data.Head.Status.Reason + " storage: " + id);
                }
            } catch (e) {
                adapter.log.warn("getStorageRealtimeData: " + e);
            }
        }
    });
}

function getMeterRealtimeData(id) {
    request.get(requestType + ip + baseurl + 'GetMeterRealtimeData.cgi?Scope=Device&DeviceId=' + id, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    const resp = data.Body.Data;
                    if (!isObjectsCreated) {
                        devObjects.createMeterObjects(adapter, id, resp);
                    }
                    for (var par in resp) {
                        if (par == "Details") {
                            if (resp.Details.hasOwnProperty("Manufacturer") & resp.Details.hasOwnProperty("Model") & resp.Details.hasOwnProperty("Serial")) {
                                adapter.setState("meter." + id + ".Model", { val: resp.Details.Manufacturer + " " + resp.Details.Model, ack: true });
                                adapter.setState("meter." + id + ".Serial", { val: resp.Details.Serial, ack: true });
                            }
                        } else {
                            adapter.setState("meter." + id + "." + par.toString(), { val: resp[par.toString()], ack: true });
                        }

                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " meter: " + id);
                }
            } catch (e) {
                adapter.log.warn("getMeterRealtimeData: " + e);
            }
        }
    });
}

function getSensorRealtimeDataNowSensorData(id) {
    request.get(requestType + ip + baseurl + 'GetSensorRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=NowSensorData', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    if (!isObjectsCreated) {
                        devObjects.createSensorNowObjects(adapter, id);
                    }
                    const resp = data.Body.Data;

                } else {
                    adapter.log.warn(data.Head.Status.Reason + " sensor: " + id);
                }
            } catch (e) {
                adapter.log.warn("getSensorRealtimeDataNowSensorData: " + e);
            }
        }
    });
}

function getSensorRealtimeDataMinMaxSensorData(id) {
    request.get(requestType + ip + baseurl + 'GetSensorRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=MinMaxSensorData', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    if (!isObjectsCreated) {
                        devObjects.createSensorMinMaxObjects(adapter, id);
                    }
                    const resp = data.Body.Data;

                } else {
                    adapter.log.warn(data.Head.Status.Reason + " sensor: " + id);
                }
            } catch (e) {
                adapter.log.warn("getSensorRealtimeDataMinMaxSensorData: " + e);
            }
        }
    });
}

function getStringRealtimeData(id) {

}

function getPowerFlowRealtimeData() {
    request.get(requestType + ip + baseurl + 'GetPowerFlowRealtimeData.fcgi', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    var resp = data.Body.Data.Site;
                    if (!isObjectsCreated) {
                        devObjects.createPowerFlowObjects(adapter, resp);
                    }
                    for (var par in resp) {
                        adapter.setState("powerflow." + par.toString(), { val: resp[par.toString()] == null ? 0 : resp[par.toString()], ack: true });
                    }

                    if (data.Body.Data.hasOwnProperty("Inverters")) {
                        var keys = Object.keys(data.Body.Data.Inverters);
                        for (var inv in keys) {
                            resp = data.Body.Data.Inverters[keys[inv]];
                            if (!isObjectsCreated) {
                                devObjects.createPowerFlowInverterObjects(adapter, keys[inv], resp);
                            }
                            for (var par in resp) {
                                if (par.toString() == "DT") {
                                    adapter.setState("powerflow.inverter" + keys[inv].toString() + ".DT", { val: resp[par.toString()], ack: true });
                                    adapter.setState("powerflow.inverter" + keys[inv].toString() + ".DTString", { val: devStrings.getStringDeviceType(resp[par.toString()]), ack: true });
                                } else {
                                    adapter.setState("powerflow.inverter" + keys[inv].toString() + "." + par.toString(), { val: resp[par.toString()] == null ? 0 : resp[par.toString()], ack: true });
                                }
                            }
                        }
                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " powerflow");
                }
            } catch (e) {
                adapter.log.warn("getPowerFlowRealtimeData: " + e);
            }
        }
    });
}

function getInverterInfo() {
    request.get(requestType + ip + baseurl + 'GetInverterInfo.cgi', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    var keys = Object.keys(data.Body.Data);
                    for (var inv in keys) {
                        var resp = data.Body.Data[keys[inv]];
                        if (!isObjectsCreated) {
                            devObjects.createInverterInfoObjects(adapter, keys[inv], resp);
                        }
                        for (var par in resp) {
                            if (par.toString() == "CustomName") {
                                adapter.setState("inverterinfo." + keys[inv].toString() + "." + par.toString(), { val: devStrings.convertCustomname(resp[par.toString()]), ack: true });
                            } else if (par.toString() == "DT") {
                                adapter.setState("inverterinfo." + keys[inv].toString() + ".DT", { val: resp[par.toString()], ack: true });
                                adapter.setState("inverterinfo." + keys[inv].toString() + ".DTString", { val: devStrings.getStringDeviceType(resp[par.toString()]), ack: true });
                            } else {
                                adapter.setState("inverterinfo." + keys[inv].toString() + "." + par.toString(), { val: resp[par.toString()], ack: true });
                            }
                        }
                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " inverterinfo");
                }
            } catch (e) {
                adapter.log.warn("getInverterInfo: " + e);
            }
        }
    });
}

function setConnected(_isConnected) {
    if (isConnected !== _isConnected) {
        isConnected = _isConnected;
        adapter.setState('info.connection', { val: isConnected, ack: true });
    }
}

function checkStatus() {
    if(isObjectsCreated == false && isConnected){
        if(--downCount <= 0){
            isObjectsCreated = true
        }
    }

    ping.probe(ip, { log: adapter.log.debug }, function(err, result) {
        if (err) {
            adapter.log.error(err);
        }
        if (result) {
            // now try if we can really read data from the API. If not do not further process
            request.get(requestType + ip + '/solar_api/GetAPIVersion.cgi', function(error, response, body) {
                var testData = null
                try {
                    testData = JSON.parse(body);
                } catch (e) {
                    adapter.log.debug("Exception thrown in check API: " + e);
                }
                if (!error && response.statusCode == 200 && 'BaseURL' in testData) {
                    // it seems everything is working, therefore proceed with readout
                    setConnected(result.alive);
                    if (result.alive) {
                        adapter.config.inverter.split(',').forEach(function(entry) {
                            getInverterRealtimeData(entry);
                        });
                        if (adapter.config.sensorCard) {
                            adapter.config.sensorCard.split(',').forEach(function(entry) {
                                getSensorRealtimeDataNowSensorData(entry);
                                getSensorRealtimeDataMinMaxSensorData(entry);
                            });
                        }
                        if (adapter.config.stringControl) {
                            adapter.config.stringControl.split(',').forEach(function(entry) {
                                getStringRealtimeData(entry);
                            });
                        }

                        if (apiver === 1) {
                            if (adapter.config.meter) {
                                adapter.config.meter.split(',').forEach(function(entry) {
                                    getMeterRealtimeData(entry);
                                });
                            }
                            if (adapter.config.storage) {
                                adapter.config.storage.split(',').forEach(function(entry) {
                                    getStorageRealtimeData(entry);
                                });
                            }
                            getPowerFlowRealtimeData();
                            getInverterInfo();
                        }

                        adapter.setState("info.lastsync", { val: new Date().toISOString(), ack: true });
                    }
                } else {
                    adapter.log.debug("Unable to read data from inverters solarAPI");
                    setConnected(false);
                }

            });
        }
    });
}

function checkArchiveStatus() {
    ping.probe(ip, { log: adapter.log.debug }, function(err, result) {
        if (err) {
            adapter.log.error(err);
        }
        if (result) {
            // now try if we can really read data from the API. If not do not further process
            request.get(requestType + ip + '/solar_api/GetAPIVersion.cgi', function(error, response, body) {
                var testData = null
                try {
                    testData = JSON.parse(body);
                } catch (e) {
                    adapter.log.debug("Exception thrown in check API: " + e);
                }
                if (!error && response.statusCode == 200 && 'BaseURL' in testData) {
                    // it seems everything is working, therefore proceed with readout
                    setConnected(result.alive);
                    if (result.alive) {
                        if (apiver === 1) {
                            adapter.config.inverter.split(',').forEach(function(entry) {
                                GetArchiveData(entry);
                            });
                        }

                        adapter.setState("info.lastsyncarchive", { val: new Date().toISOString(), ack: true });
                    }
                } else {
                    adapter.log.debug("Unable to read data from inverters solarAPI");
                    setConnected(false);
                }

            });
        }
    });
}

//Hardware and Software Version
function getLoggerInfo() {
    request.get(requestType + ip + baseurl + 'GetLoggerInfo.cgi', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                const data = JSON.parse(body);
                if ("Body" in data) {
                    const resp = data.Body.LoggerInfo;
                    if (!isObjectsCreated) {
                        devObjects.createInfoObjects(adapter, resp);
                    }
                    if (resp && resp.hasOwnProperty("HWVersion")) {
                        adapter.setState("info.HWVersion", { val: resp.HWVersion, ack: true });
                        adapter.setState("info.SWVersion", { val: resp.SWVersion, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("CO2Factor")) {
                        adapter.setState("info.CO2Factor", { val: resp.CO2Factor, ack: true });
                        adapter.setState("info.CO2Unit", { val: resp.CO2Unit, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("CashFactor")) {
                        adapter.setState("info.CashFactor", { val: resp.CashFactor, ack: true });
                        adapter.setState("info.CashCurrency", { val: resp.CashCurrency, ack: true });
                        adapter.setState("info.DeliveryFactor", { val: resp.DeliveryFactor, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("DefaultLanguage")) {
                        adapter.setState("info.DefaultLanguage", { val: resp.DefaultLanguage, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("PlatformID")) {
                        adapter.setState("info.PlatformID", { val: resp.PlatformID, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("ProductID")) {
                        adapter.setState("info.ProductID", { val: resp.ProductID, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("TimezoneLocation")) {
                        adapter.setState("info.TimezoneLocation", { val: resp.TimezoneLocation, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("TimezoneName")) {
                        adapter.setState("info.TimezoneName", { val: resp.TimezoneName, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("UTCOffset")) {
                        adapter.setState("info.UTCOffset", { val: resp.UTCOffset, ack: true });
                    }
                    if (resp && resp.hasOwnProperty("UniqueID")) {
                        adapter.setState("info.UniqueID", { val: resp.UniqueID, ack: true });
                    }
                } else {
                    adapter.log.warn(data.Head.Status.Reason);
                }
            } catch (e) {
                adapter.log.warn("getLoggerInfo: " + e);
            }
        }
        if (error != null) {
            adapter.log.warn("getLoggerInfo: " + error);
        }
    });
}

function main() {

    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    ip = adapter.config.ip;
    baseurl = adapter.config.baseurl;
    apiver = parseInt(adapter.config.apiversion);
    requestType = adapter.config.requestType;
    downCount = 5;

    if (ip && baseurl) {
        getLoggerInfo();
        checkStatus();
        checkArchiveStatus();

        let secs = adapter.config.poll;
        if (isNaN(secs) || secs < 1) {
            secs = 10;
        }

        setInterval(checkStatus, secs * 1000);

        let archivesecs = adapter.config.pollarchive;
        if (isNaN(archivesecs) || archivesecs < 1) {
            archivesecs = 150;
        }

        setInterval(checkArchiveStatus, archivesecs * 1000);

    } else {
        adapter.log.error("Please configure the Fronius adapter");
    }


}

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
}