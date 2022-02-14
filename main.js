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

const axios = require('axios');
const he = require('he')
const ping = require(__dirname + '/lib/ping');
const devStrings = require(__dirname + '/lib/devStrings');
const devObjects = require(__dirname + '/lib/devObjects');

let ip, baseurl, apiver, requestType;
let isConnected = null,
    isObjectsCreated = false,
    isArchiveObjectsCreated = false,
    /* this variable is used to ensure the object creation over multiple read cycles */
    downCount = 5,
    /* this variable is used to ensure the object creation over multiple read cycles for archive data */
    downCountArchive = 5;


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
    adapter.log.warn(requestType + ipToCheck + '/solar_api/GetAPIVersion.cgi');
    axios.get(requestType + ipToCheck + '/solar_api/GetAPIVersion.cgi')
    .then(function(response){ 
        adapter.log.warn(response.status);
        adapter.log.warn(JSON.stringify(response.data));
        if (response.status == 200 && 'BaseURL' in response.data) {
            callback({ error: 0, message: response.data });
        } else {
            adapter.log.error("IP invalid");
            callback({ error: 1, message: {} });
        }
    })
    .catch(function(error){
        adapter.log.error("IP is not a Fronius inverter");
        callback({ error: 1, message: {} });
    });
}

//Check Fronius devices v1
function getActiveDeviceInfo(type, url, callback) {
    axios.get(requestType + url + 'GetActiveDeviceInfo.cgi?DeviceClass=' + type)
    .then(function(response){
        const deviceData = response.data;
        adapter.log.warn(JSON.stringify(deviceData));
        if (response.status == 200 && 'Body' in deviceData) {
            callback({ error: 0, message: deviceData.Body.Data });
        } else {
            adapter.log.warn(deviceData.Head.Status.Reason);
            callback({ error: 1, message: {} });
        }
    })
    .catch(function(error){
        callback({ error: 1, message: {} });
    });
}

//Get Infos from Inverter
function getInverterRealtimeData(id) {
    // fallback if no id set
    if (id == "") {
        id = 1; // ensure that it is correct working for symoGEN24
    }
    axios.get(requestType + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=3PInverterData')
    .then(function(response){
        if (response.status == 200) {
            if ("Body" in response.data) {
                if (!isObjectsCreated) {
                    devObjects.createInverterObjects(adapter, id, response.data.Body.Data);
                }
                fillData(adapter,response.data.Body.Data,"Inverters." + id + '.');
            } else {
                adapter.log.warn(response.data.Head.Status.Reason + " inverter: " + id);
            }
        }
    })
    .catch(function(error){
        adapter.log.warn("getInverterRealtimeData (3PInverterData): " + error);
    });

    axios.get(requestType + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=CommonInverterData')
    .then(function(response){
        if (response.status == 200) {
            const data = response.data;
            if ("Body" in data) {

                const resp = data.Body.Data;
                if (!isObjectsCreated) {
                    devObjects.createInverterObjects(adapter, id, resp);
                }

                fillData(adapter,response.data.Body.Data,"Inverters." + id + '.');


                if(resp.hasOwnProperty("UDC") && resp.hasOwnProperty("IDC")){
                    adapter.setState("inverter." + id + ".PDC", { val: resp["IDC"].Value * resp["UDC"].Value, ack: true });
                }
                if(resp.hasOwnProperty("UDC_2") && resp.hasOwnProperty("IDC_2")){
                    adapter.setState("inverter." + id + ".PDC_2", { val: resp["IDC_2"].Value * resp["UDC_2"].Value, ack: true });
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
                    resetStateToZero(resp, "inverter." + id, "PDC");
                    resetStateToZero(resp, "inverter." + id, "PDC_2");
                }
/*
                const status = resp.DeviceStatus;
                if (status) {
                    let statusCode = parseInt(status.StatusCode);
                    adapter.setState("inverter." + id + ".DeviceStatus", { val: JSON.stringify(status), ack: true });
                    adapter.log.debug("inverter." + id + ".StatusCode=" + statusCode)
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
                */
            } else {
                adapter.log.warn(data.Head.Status.Reason + " inverter: " + id);
            }
        }
    })
    .catch(function(error){
        //adapter.log.warn("getInverterRealtimeData (CommonInverterData): " + error);
    });
}

//Get Infos from Inverters
function GetArchiveData(ids) {
    // fallback if no ids set
    if (ids == "") {
        ids = 1; // ensure correct working for symoGEN24 if no ID is set
    }

    var today = new Date();
    var datum = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
    axios.get(requestType + ip + baseurl + 'GetArchiveData.cgi?Scope=System&StartDate=' + datum + '&EndDate=' + datum + '&Channel=Current_DC_String_1&Channel=Current_DC_String_2&Channel=Temperature_Powerstage&Channel=Voltage_DC_String_1&Channel=Voltage_DC_String_2')
    .then(function(response){
        if (response.status == 200) {
            try {
                const data = response.data;
                if ("Body" in data && "Data" in data.Body) {
                    ids.split(',').forEach(function(id) { // loop over all ids just to process the data. All data is read with 1 request
                        var inverter = data.Body.Data["inverter/" + id];
                        var s1current, s2current;
                        if (typeof inverter === 'undefined' || inverter === null || !inverter.hasOwnProperty("Data")) { // if inverter object does not exists or does not have data property just exit
                            return;
                        }
                        const resp = inverter.Data;
                        if (!isArchiveObjectsCreated) {
                            devObjects.createArchiveObjects(adapter, id, resp);
                        }

                        var c1 = GetArchiveValue(adapter,response.data.Body.Data,"Inverters." + id + '.',id,'Current_DC_String_1');
                        var c2 = GetArchiveValue(adapter,response.data.Body.Data,"Inverters." + id + '.',id,'Current_DC_String_2');
                        var v1 = GetArchiveValue(adapter,response.data.Body.Data,"Inverters." + id + '.',id,'Voltage_DC_String_1');
                        var v2 = GetArchiveValue(adapter,response.data.Body.Data,"Inverters." + id + '.',id,'Voltage_DC_String_2');
                        if(c1 != null && v1 != null)
                        adapter.setState("Inverters." + id + '.Power_DC_String_1',Math.round((c1*v1 + Number.EPSILON)*100)/100,true);
                        if(c2 != null && v2 != null)
                        adapter.setState("Inverters." + id + '.Power_DC_String_2',Math.round((c2*v2 + Number.EPSILON)*100)/100,true);
                        GetArchiveValue(adapter,response.data.Body.Data,"Inverters." + id + '.',id,'Temperature_Powerstage');

                    });
                    
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " archive: " + ids);
                }

            } catch (e) {
                adapter.log.warn("GetArchiveData: " + e);
            }
        }
    });
}

function getStorageRealtimeData(id) {
    axios.get(requestType + ip + baseurl + 'GetStorageRealtimeData.cgi?Scope=Device&DeviceId=' + id)
    .then(function (response) {
        if (response.status == 200) {
            try {
                const data = response.data;
                if ("Body" in data) {
                    if (data.Body.Data === null) {
                        adapter.log.debug("Storage object is not supported: " + JSON.stringify(data));
                        return;
                    }

                    if (!isObjectsCreated) {
                        devObjects.createStorageObjects(adapter, id,response.data.Body.Data.Controller);
                        devObjects.createStorageObjects(adapter, id,response.data.Body.Data.Modules);
                    }
                    fillData(adapter,response.data.Body.Data.Controller,'Storage.' + id);
                    fillData(adapter,response.data.Body.Data.Modules,'Storage.' + id);

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
    axios.get(requestType + ip + baseurl + 'GetMeterRealtimeData.cgi?Scope=Device&DeviceId=' + id)
    .then(function (response) {
        if (response.status == 200) {
            try {
                const data = response.data;
                if ("Body" in data) {
                    const resp = data.Body.Data;
                    if (!isObjectsCreated) {
                        devObjects.createMeterObjects(adapter, id, resp);
                    }
                    fillData(adapter,response.data.Body.Data, "Meter." + id);
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
    axios.get(requestType + ip + baseurl + 'GetSensorRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=NowSensorData')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createSensorNowObjects(adapter, id);
                    }
                    fillData(adapter,response.data.Body.Data,"Sensors." + id);
                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " sensor: " + id);
                }
            } catch (e) {
                adapter.log.warn("getSensorRealtimeDataNowSensorData: " + e);
            }
        }
    });
}

function getSensorRealtimeDataMinMaxSensorData(id) {
    axios.get(requestType + ip + baseurl + 'GetSensorRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=MinMaxSensorData')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createSensorMinMaxObjects(adapter, id);
                    }
                    fillData(adapter,response.data.Body.Data,"Sensors." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " sensor: " + id);
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
    axios.get(requestType + ip + baseurl + 'GetPowerFlowRealtimeData.fcgi')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    var resp = response.data.Body.Data;
                    if (!isObjectsCreated) {
                        devObjects.createPowerFlowObjects(adapter, resp);
                    }
                    fillData(adapter,resp.Inverters,"Inverters.");
                    fillData(adapter,resp.Site,"Site.");
                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " powerflow");
                }
            } catch (e) {
                adapter.log.warn("getPowerFlowRealtimeData: " + e);
            }
        }
    });
}

function getInverterInfo() {
    axios.get(requestType + ip + baseurl + 'GetInverterInfo.cgi')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createInverterInfoObjects(adapter, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"Inverters.");
                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " inverterinfo");
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
    if (isObjectsCreated == false && isConnected) {
        adapter.log.debug("Object creation will be done for " + downCount + " times")
        if (--downCount < 0) {
            isObjectsCreated = true
        }
    }

    ping.probe(ip, { log: adapter.log.debug }, function(err, result) {
        if (err) {
            adapter.log.error(err);
        }
        if (result) {
            // now try if we can really read data from the API. If not do not further process
            axios.get(requestType + ip + '/solar_api/GetAPIVersion.cgi')
            .then(function (response) {
                var testData = null
                try {
                    testData = response.data;
                } catch (e) {
                    adapter.log.debug("Exception thrown in check API: " + e);
                    if (response.data != null) {
                        adapter.log.debug("API Response for " + requestType + ip + '/solar_api/GetAPIVersion.cgi:' + JSON.stringify(response.data));
                    }
                }
                if (response.status == 200 && 'BaseURL' in testData) {
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
    if (isArchiveObjectsCreated == false && isConnected) {
        adapter.log.debug("Object creation for archive will be done for " + downCountArchive + " times")
        if (--downCountArchive < 0) {
            isArchiveObjectsCreated = true
        }
    }
    ping.probe(ip, { log: adapter.log.debug }, function(err, result) {
        if (err) {
            adapter.log.error(err);
        }
        if (result) {
            // now try if we can really read data from the API. If not do not further process
            axios.get(requestType + ip + '/solar_api/GetAPIVersion.cgi')
            .then(function (response) {
                var testData = null
                try {
                    testData = response.data;
                } catch (e) {
                    adapter.log.debug("Exception thrown in archive check API: " + e);
                    if (response.data != null) {
                        adapter.log.debug("API Response for " + requestType + ip + '/solar_api/GetAPIVersion.cgi:' + JSON.stringify(body));
                    }
                }
                if (response.statusCode == 200 && 'BaseURL' in testData) {
                    // it seems everything is working, therefore proceed with readout
                    setConnected(result.alive);
                    if (result.alive) {
                        if (apiver === 1) {
                            GetArchiveData(adapter.config.inverter);
                        }

                        adapter.setState("info.lastsyncarchive", { val: new Date().toISOString(), ack: true });
                    }
                } else {
                    adapter.log.debug("Unable to read archive data from inverters solarAPI");
                    setConnected(false);
                }

            });
        }
    });
}

//Hardware and Software Version
function getLoggerInfo() {
    axios.get(requestType + ip + baseurl + 'GetLoggerInfo.cgi')
    .then(function (response) {
        if (response.status == 200) {
            try {
                const data = response.data;
                if ("Body" in data) {
                    const resp = data.Body.LoggerInfo;
                    if (!isObjectsCreated) {
                        devObjects.createInfoObjects(adapter, resp);
                    }
                    fillData(adapter,resp,"Site.");
                } else {
                    adapter.log.warn(data.Head.Status.Reason);
                }
            } catch (e) {
                adapter.log.warn("getLoggerInfo: " + e);
            }
        }
    })
    .catch(function(error){
        adapter.log.warn("getLoggerInfo: " + error);
    });
}

function GetArchiveValue(adapter,data,prefix,id,key){
    if(!data.hasOwnProperty("inverter/" + id) || !data["inverter/" + id].hasOwnProperty('Data'))
        return;
    var invData = data["inverter/" + id].Data;
    if(invData.hasOwnProperty(key) && invData[key].hasOwnProperty('Values')){ // key exists
        var keys = Object.keys(invData[key].Values);
        var val = invData[key].Values[keys[keys.length - 1]];
        if(typeof(val) == 'number'){
            val = Math.round((val + Number.EPSILON)*100)/100;
        }
        //log(prefix + key + " = " +val,"info")
        adapter.setState(prefix + key,val,true);
        return val;
    }
    return null;
}

function fillData(adapter,data,prefix=""){
    for (var key in data){
        if(data[key.toString()] != null && typeof(data[key.toString()]) == "object"){ // this is a nested object to parse!
            if(data[key.toString()].hasOwnProperty('Value')){ // handling object with value and Unit below
                var val = data[key.toString()].Value;
                if(typeof(val) == 'number'){
                    val = Math.round((val + Number.EPSILON)*100)/100;
                }
                adapter.setState(prefix + key.toString(),val,true);
                adapter.log.debug(key.toString() + ", Value=" + val);
            }else{ // standard nested object to parse
                var data2 = data[key.toString()]
                for (var subKey in data2){
                    if(typeof(data2[subKey.toString()])== "object"){
                        for (var subsub in data2[subKey.toString()]){
                            var val = data2[subKey.toString()][subsub.toString()]
                            if(typeof(val) == 'string'){
                                val = he.unescape(data2[subKey.toString()][subsub.toString()])
                            }else if(typeof(val) == 'number'){
                                val = Math.round((val + Number.EPSILON)*100)/100;
                            }
                            adapter.setState(prefix + key.toString() + '.' + subKey.toString() + '.' + subsub.toString(),val,true);
                            adapter.log.debug(subsub.toString() + ', Value= ' + data2[subKey.toString()][subsub.toString()]);
                        }
                    }else{
                        var val = data2[subKey.toString()]
                        if(typeof(val) == 'string'){
                            val = he.unescape(data2[subKey.toString()])
                        }else if(typeof(val) == 'number'){
                            val = Math.round((val + Number.EPSILON)*100)/100;
                        }
                        adapter.setState(prefix + key.toString() + '.' + subKey.toString(),val,true);
                        adapter.log.debug(key.toString() + '.' + subKey.toString() + ', Value=' + data2[subKey.toString()]);
                    }
                }
            }
        }else{ // standard object to parse
            if(data[key.toString()] != null && typeof(data[key.toString()]) != "object"){ //dont fill objects!
                var val = data[key.toString()]
                if(typeof(val) == 'string'){
                    val = he.unescape(data[key.toString()])
                }else if(typeof(val) == 'number'){
                    val = Math.round((val + Number.EPSILON)*100)/100;
                }
                adapter.setState(prefix + key.toString(),val,true);
                adapter.log.debug(key.toString() + ', Value=' + data[key.toString()]);
            }
        }
        
    }
}

function main() {

    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    ip = adapter.config.ip;
    baseurl = adapter.config.baseurl;
    apiver = parseInt(adapter.config.apiversion);
    requestType = adapter.config.requestType;
    downCount = 5; // do the objects creation 5 times after restarting the Adapter
    downCountArchive = 5; // do the objects creation for archive data 5 times after restarting the Adapter

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
