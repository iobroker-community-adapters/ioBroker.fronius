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
const testMode = true; // defines that the testmode is activated. In this mode only objects are created and filled from the solarApiJson.js

// you have to require the utils module and call adapter function
const utils = require('@iobroker/adapter-core'); // Get common adapter utils
const apiTest = require(__dirname + '/test/solarApiJson.js')
const axios = require('axios');
const he = require('he')
const devStrings = require(__dirname + '/lib/devStrings');
const devObjects = require(__dirname + '/lib/devObjects');

let ip, baseurl, apiver, requestType;
let isConnected = null,
    isObjectsCreated = false,
    isArchiveObjectsCreated = false,
    /* this variable is used to ensure the object creation over multiple read cycles */
    downCount = 2,
    /* this variable is used to ensure the object creation over multiple read cycles for archive data */
    downCountArchive = 2;


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
                adapter.log.debug("State " + state + " is found in objects but not on API: " + JSON.stringify(API_response));
                if (stat.val != 0) {
                    adapter.setState(basePath + "." + state, 0, true);
                }
            }
        });
    }
}


//Check if IP is a Fronius inverter
function checkIP(ipToCheck, callback) {
    var primary = "https://"
    var secondary = "http://"
    if(testMode){
        callback({ error: 0, message: apiTest.testApiVersion});
        return;
    }

    axios.get(primary + ipToCheck + '/solar_api/GetAPIVersion.cgi')
    .then(function(response){
        if (response.status == 200 && 'BaseURL' in response.data) {
            if(requestType != primary){
                adapter.log.warn("Adapter requestType " + requestType + " was not matching, changed to " + primary + " and trigger restart.")
                requestType = primary;
                adapter.getForeignObject('system.adapter.'+ adapter.namespace,function(err,obj){
                    if(obj != null){
                        obj.native.requestType = requestType;
                        adapter.setForeignObject('system.adapter.'+ adapter.namespace,obj);
                    }
                });
            }
            adapter.log.debug("Passed with " + requestType);
            callback({ error: 0, message: response.data});
            return;
        } else {
            adapter.log.debug("requestType " + primary + " is not working! Now trying with " + secondary);
            axios.get(secondary + ipToCheck + '/solar_api/GetAPIVersion.cgi')
            .then(function(response){
                if (response.status == 200 && 'BaseURL' in response.data) {
                    if(requestType != secondary){
                        adapter.log.warn("Adapter requestType " + requestType + " was not matching, changed to " + secondary + " and trigger restart.")
                        requestType = secondary;
                        adapter.getForeignObject('system.adapter.'+ adapter.namespace,function(err,obj){
                            if(obj != null){
                                obj.native.requestType = requestType;
                                adapter.setForeignObject('system.adapter.'+ adapter.namespace,obj);
                            }
                        });
                    }
                    callback({ error: 0, message: response.data});
                } else {
                    adapter.log.error("IP invalid");
                    callback({ error: 1, message: {} });
                }
            }).catch(function(error){
                adapter.log.error("IP is not a Fronius inverter");
                callback({ error: 1, message: {} });
            });
        }
    }).catch(function(error){
        adapter.log.debug("Unable to communicate with Device! Error: " + error);
    });
}

//Check Fronius devices v1
function getActiveDeviceInfo(type, url, callback) {
    if(testMode){
        var info = apiTest.testActiveDeviceInfo;
        adapter.log.warn("getActiveDeviceInfoTest:" + JSON.stringify(info))
        callback({ error: 0, message: info.Body.Data});
        return;
    }
    axios.get(requestType + url + 'GetActiveDeviceInfo.cgi?DeviceClass=' + type)
    .then(function(response){
        const deviceData = response.data;
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

// this function is used to check the existing config. If the config stored does not match
// then the settings are updated (only if the request was successful)
function checkExistingConfig(){
    if(testMode){
        return;
    }
    getActiveDeviceInfo('System',ip + baseurl,function(result){
        if(result.error == 0){
            result = result.message;
            adapter.log.debug("Current result of System deviceINFO: " + JSON.stringify(result));
            var inverter = result.hasOwnProperty('Inverter') ? Object.keys(result.Inverter).toString() : '';
            var sensorCard = result.hasOwnProperty('SensorCard') ? Object.keys(result.SensorCard).toString() : '1';
            var stringControl = result.hasOwnProperty('StringControl') ? Object.keys(result.StringControl).toString() : '';
            var meter = result.hasOwnProperty('Meter') ? Object.keys(result.Meter).toString() : '';
            var storage = result.hasOwnProperty('Storage') ? Object.keys(result.Storage).toString() : '';
            if(adapter.config.inverter == inverter &&
                    adapter.config.sensorCard == sensorCard &&
                    adapter.config.stringControl == stringControl &&
                    adapter.config.meter == meter &&
                    adapter.config.storage == storage ){

                adapter.log.debug("The current system configuration is up to date");
            }else{
                adapter.log.info("The current system configuration is not up to date. Settings are updated and adapter restarted!");
                adapter.getForeignObject('system.adapter.'+ adapter.namespace,function(err,obj){
                    if(obj != null){
                        adapter.log.debug(JSON.stringify(obj));
                        obj.native.inverter = inverter
                        obj.native.sensorCard = sensorCard
                        obj.native.stringControl = stringControl
                        obj.native.meter = meter
                        obj.native.storage = storage
                        adapter.log.debug(JSON.stringify(obj.native));
                        adapter.setForeignObject('system.adapter.'+ adapter.namespace,obj);
                    }
                });
            }
            // Restart the creation of objects. This is usefull in case that some data was not availlable during start
            downCountArchive = 1;
            isArchiveObjectsCreated = false;
            downCount = 1;
            isObjectsCreated = false;
        }
    });

}

//Get Infos from Inverter
function getInverterRealtimeData(id) {
    if(testMode){
        var data = apiTest.testInverterRealtimeData3Phase;
        adapter.log.warn("getInverterRealtimeData 3Phase -> inverter.0:  " + JSON.stringify(data));
        devObjects.createInverterObjects(adapter,0,data.Body.Data);
        fillData(adapter,data.Body.Data,'inverter.0');

        data = apiTest.testInverterRealtimeDataCommon;
        adapter.log.warn("getInverterRealtimeData Common -> inverter.0:  " + JSON.stringify(data));
        devObjects.createInverterObjects(adapter,0,data.Body.Data);
        fillData(adapter,data.Body.Data,'inverter.0');

        data = apiTest.testInverterRealtimeData3PhaseGen24;
        adapter.log.warn("getInverterRealtimeData 3Phase Gen24 -> inverter.1:  " + JSON.stringify(data));
        devObjects.createInverterObjects(adapter,1,data.Body.Data);
        fillData(adapter,data.Body.Data,'inverter.1'); 

        data = apiTest.testInverterRealtimeDataCommonGen24;
        adapter.log.warn("getInverterRealtimeData Common Gen24 -> inverter.1:  " + JSON.stringify(data));
        devObjects.createInverterObjects(adapter,1,data.Body.Data);
        fillData(adapter,data.Body.Data,'inverter.1');

        data = apiTest.testInverterRealtimeDataCumGen24;
        adapter.log.warn("getInverterRealtimeData Cummulative Gen24 -> inverter.1:  " + JSON.stringify(data));
        devObjects.createInverterObjects(adapter,1,data.Body.Data);
        fillData(adapter,data.Body.Data,'inverter.1');
        return;
    }
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
                fillData(adapter,response.data.Body.Data,"inverter." + id + '.');
            } else {
                adapter.log.warn(response.data.Head.Status.Reason + " 3PInverterData inverter: " + id);
            }
        }
    })
    .catch(function(error){
        adapter.log.debug("getInverterRealtimeData (3PInverterData) raised following error: " + error);
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
                
                fillData(adapter,response.data.Body.Data,"inverter." + id + '.');

                setTimeout(function(id,resp) {

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

                    const status = resp.DeviceStatus;
                    if (status) {
                        let statusCode = parseInt(status.StatusCode);

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
                        if (!status.hasOwnProperty("InverterState")) { // only needed if not delivered from the API
                            adapter.setState("inverter." + id + ".DeviceStatus.InverterState", { val: statusCodeString, ack: true });
                        }

                        statusCode = parseInt(status.ErrorCode);

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
                        } else if (statusCode >= 100) {
                            statusCodeString = devStrings.getStringErrorCode100(statusCode);
                        } else if (statusCode > 0){
                            statusCodeString = "Unknown error with id " + statusCode.toString()
                        }else{
                            statusCodeString = "No error"
                        }
                        adapter.setState("inverter." + id + ".DeviceStatus.InverterErrorState", { val: statusCodeString, ack: true });
                    }
                },isObjectsCreated?1:3000,id,resp);
            } else {
                adapter.log.warn(data.Head.Status.Reason + " CommonInverterData inverter: " + id);
            }
        }
    })
    .catch(function(error){
        adapter.log.debug("getInverterRealtimeData (CommonInverterData) raised following error: " + error);
    });

    axios.get(requestType + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=MinMaxInverterData')
    .then(function(response){
        if (response.status == 200) {
            if ("Body" in response.data) {
                if (!isObjectsCreated) {
                    devObjects.createInverterObjects(adapter, id, response.data.Body.Data);
                }
                fillData(adapter,response.data.Body.Data,"inverter." + id + '.');
            } else {
                adapter.log.warn(response.data.Head.Status.Reason + " MinMaxInverterData inverter: " + id);
            }
        }
    })
    .catch(function(error){
        adapter.log.debug("getInverterRealtimeData (MinMaxInverterData) raised following error: " + error);
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

                        setTimeout(function(id,rsp){
                            var c1 = GetArchiveValue(adapter,rsp,"inverter." + id + '.',id,'Current_DC_String_1');
                            var c2 = GetArchiveValue(adapter,rsp,"inverter." + id + '.',id,'Current_DC_String_2');
                            var v1 = GetArchiveValue(adapter,rsp,"inverter." + id + '.',id,'Voltage_DC_String_1');
                            var v2 = GetArchiveValue(adapter,rsp,"inverter." + id + '.',id,'Voltage_DC_String_2');
                            if(c1 != null && v1 != null){
                                adapter.setState("inverter." + id + '.Power_DC_String_1',Math.round((c1*v1 + Number.EPSILON)*100)/100,true);
                            }
                            if(c2 != null && v2 != null){
                                adapter.setState("inverter." + id + '.Power_DC_String_2',Math.round((c2*v2 + Number.EPSILON)*100)/100,true);
                            }
                            GetArchiveValue(adapter,resp,"inverter." + id + '.',id,'Temperature_Powerstage');
                        },isArchiveObjectsCreated?1:3000,id,response.data.Body.Data);
                    });
                    
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " archive: " + ids);
                }

            } catch (e) {
                adapter.log.warn("GetArchiveData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetArchiveData has thrown following error: " + error);
    });
}
function getOhmPilotRealtimeData() {
    if(testMode){
        var data = apiTest.testOhmpilotRealtimeDataSystem;
        adapter.log.warn("Ohmpilot: " + JSON.stringify(data));
        devObjects.createOhmPilotObjects(adapter,data.Body.Data);
        fillData(adapter,data.Body.Data,'ohmpilot');
        return;
    }
    axios.get(requestType + ip + baseurl + 'GetOhmPilotRealtimeData.cgi?Scope=System')
    .then(function (response) {
        if (response.status == 200) {
            try {
                const data = response.data;
                if ("Body" in data) {
                    if (data.Body.Data === null) {
                        adapter.log.debug("GetOhmPilotRealtimeData is not supported: " + JSON.stringify(data));
                        return;
                    }

                    if (!isObjectsCreated) {
                        devObjects.createOhmPilotObjects(adapter,response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,'ohmpilot');

                } else {
                    adapter.log.warn(data.Head.Status.Reason + " ohmpilot");
                }
            } catch (e) {
                adapter.log.warn("GetOhmPilotRealtimeData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetOhmPilotRealtimeData has thrown following error: " + error);
    });
}

function getStorageRealtimeData(id) {
    if(testMode){
        var data = apiTest.testStorageRealtimeDataSolarBattery;
        adapter.log.warn("getStorageRealtimeDataTest Solar Battery -> storage.0:" + JSON.stringify(data))
        devObjects.createStorageObjects(adapter, 0 ,data.Body.Data['0']);
        fillData(adapter,data.Body.Data['0'].Controller,'storage.' + '0');
        fillData(adapter,data.Body.Data['0'].Modules,'storage.' + '0' + '.module');

        data = apiTest.testStorageRealtimeDataLgChem;
        adapter.log.warn("getStorageRealtimeDataTest LG CHEM -> storage.1:" + JSON.stringify(data))
        devObjects.createStorageObjects(adapter, 1 ,data.Body.Data);
        fillData(adapter,data.Body.Data.Controller,'storage.' + '1');
        fillData(adapter,data.Body.Data.Modules,'storage.' + '1' + '.module');

        data = apiTest.testStorageRealtimeDataBydBbox;
        adapter.log.warn("getStorageRealtimeDataTest BYD B-Box -> storage.2:" + JSON.stringify(data))
        devObjects.createStorageObjects(adapter, 2 ,data.Body.Data['0']);
        fillData(adapter,data.Body.Data['0'].Controller,'storage.' + '2');
        fillData(adapter,data.Body.Data['0'].Modules,'storage.' + '2' + '.module');
        return;
    }
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
                        devObjects.createStorageObjects(adapter, id,response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data.Controller,'storage.' + id);
                    fillData(adapter,response.data.Body.Data.Modules,'storage.' + id + '.module');

                } else {
                    adapter.log.warn(data.Head.Status.Reason + " storage: " + id);
                }
            } catch (e) {
                adapter.log.warn("getStorageRealtimeData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetStorageRealtimeData has thrown following error: " + error);
    });
}

function getMeterRealtimeData(id) {
    if(testMode){
        var data = apiTest.testMeterRealtimeDataDevice;
        adapter.log.warn("getMeterRealtimeDataTest:" + JSON.stringify(data))
        devObjects.createMeterObjects(adapter, 0 ,data.Body.Data);
        fillData(adapter,data.Body.Data,'meter.' + '0');
        return;
    }
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
                    fillData(adapter,resp, "meter." + id);
                } else {
                    adapter.log.warn(data.Head.Status.Reason + " meter: " + id);
                }
            } catch (e) {
                adapter.log.warn("getMeterRealtimeData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetMeterRealtimeData has thrown following error: " + error);
    });
}

function getSensorRealtimeDataNow(id) {
    if(testMode){
        var data = apiTest.testSensorRealtimeDataNow;
        adapter.log.warn("getSensorRealtimeDataNowTest:" + JSON.stringify(data))
        devObjects.createSensorNowObjects(adapter, 1 ,data.Body.Data);
        fillData(adapter,data.Body.Data,'sensor.1');
        return;
    }
    axios.get(requestType + ip + baseurl + 'GetSensorRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=NowSensorData')
    .then(function (response) {
        if (response.status == 200 && response.data.Head.Status.Code == 0) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createSensorNowObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"sensor." + id);
                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " sensor: " + id);
                }
            } catch (e) {
                adapter.log.warn("getSensorRealtimeDataNowSensorData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("getSensorRealtimeDataNowSensorData has thrown following error: " + error);
    });
}

function getSensorRealtimeDataMinMax(id) {
    if(testMode){
        var data = apiTest.testSensorRealtimeDataMinMax;
        adapter.log.warn("getSensorRealtimeDataMinMaxTest:" + JSON.stringify(data))
        devObjects.createSensorMinMaxObjects(adapter, 1 ,data.Body.Data);
        fillData(adapter,data.Body.Data,'sensor.1');
        return;
    }
    axios.get(requestType + ip + baseurl + 'GetSensorRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=MinMaxSensorData')
    .then(function (response) {
        if (response.status == 200 && response.data.Head.Status.Code == 0) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createSensorMinMaxObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"sensor." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " sensor: " + id);
                }
            } catch (e) {
                adapter.log.warn("getSensorRealtimeDataMinMaxSensorData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("getSensorRealtimeDataMinMaxSensorData has thrown following error: " + error);
    });
}

function getStringRealtimeData(id) {
    if(testMode){
        var data = apiTest.testStringRealtimeDataNow;
        adapter.log.warn("getStringRealtimeDataTest Now -> string.1:" + JSON.stringify(data))
        devObjects.createStringRealtimeObjects(adapter, 1 ,data.Body.Data['1']);
        fillData(adapter,data.Body.Data['1'],'string.' + '1');

        var data = apiTest.testStringRealtimeDataNowGen24;
        adapter.log.warn("getStringRealtimeDataTest Now Gen24 -> string.2:" + JSON.stringify(data))
        devObjects.createStringRealtimeObjects(adapter, 2 ,data.Body.Data['1']);
        fillData(adapter,data.Body.Data['1'],'string.' + '2');

        data = apiTest.testStringRealtimeDataNow;
        adapter.log.warn("getStringRealtimeDataTest Last error -> string.3:" + JSON.stringify(data))
        devObjects.createStringRealtimeObjects(adapter, 3 ,data.Body.Data.Channels['1']);
        fillData(adapter,data.Body.Data.Channels['1'],'string.' + '3');

        data = apiTest.testStringRealtimeDataCurrentSumDay;
        adapter.log.warn("getStringRealtimeDataTest Current sum day -> string.4:" + JSON.stringify(data))
        devObjects.createStringRealtimeObjects(adapter, 4 ,data.Body.Data['1']);
        fillData(adapter,data.Body.Data['1'],'string.' + '4');
        return;
    }
    axios.get(requestType + ip + baseurl + 'GetStringRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=NowStringControlData')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createStringRealtimeObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"string." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " NowStringControlData: " + id);
                }
            } catch (e) {
                adapter.log.warn("GetStringRealtimeData for NowStringControlData raised following error: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetStringRealtimeData for NowStringControlData has thrown following error: " + error);
    });

    axios.get(requestType + ip + baseurl + 'GetStringRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=LastErrorStringControlData')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createStringRealtimeObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"string." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " LastErrorStringControlData: " + id);
                }
            } catch (e) {
                adapter.log.warn("GetStringRealtimeData for LastErrorStringControlData raised following error: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetStringRealtimeData for LastErrorStringControlData has thrown following error: " + error);
    });

    axios.get(requestType + ip + baseurl + 'GetStringRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=CurrentSumStringControlData&TimePeriod=Day')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createStringRealtimeObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"string." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " CurrentSumStringControlData&TimePeriod=Day: " + id);
                }
            } catch (e) {
                adapter.log.warn("GetStringRealtimeData for CurrentSumStringControlData&TimePeriod=Day raised following error: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetStringRealtimeData for CurrentSumStringControlData&TimePeriod=Day has thrown following error: " + error);
    });

    axios.get(requestType + ip + baseurl + 'GetStringRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=CurrentSumStringControlData&TimePeriod=Year')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createStringRealtimeObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"string." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " CurrentSumStringControlData&TimePeriod=Year: " + id);
                }
            } catch (e) {
                adapter.log.warn("GetStringRealtimeData for CurrentSumStringControlData&TimePeriod=Year raised following error: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetStringRealtimeData for CurrentSumStringControlData&TimePeriod=Year has thrown following error: " + error);
    });

    axios.get(requestType + ip + baseurl + 'GetStringRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=CurrentSumStringControlData&TimePeriod=Total')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createStringRealtimeObjects(adapter, id, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"string." + id);

                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " CurrentSumStringControlData&TimePeriod=Total: " + id);
                }
            } catch (e) {
                adapter.log.warn("GetStringRealtimeData for CurrentSumStringControlData&TimePeriod=Total raised following error: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("GetStringRealtimeData for CurrentSumStringControlData&TimePeriod=Total has thrown following error: " + error);
    });
}

function getPowerFlowRealtimeData() {
    if (testMode){
        var data = apiTest.testPowerflowRealtimeData;
        adapter.log.warn("getPowerFlowRealtimeDataTest -> Standard:" + JSON.stringify(data))
        devObjects.createPowerFlowObjects(adapter ,data.Body.Data,"standard.");
        fillData(adapter,data.Body.Data.Inverters,'inverter.standard');
        fillData(adapter,data.Body.Data.Site,'site.standard');

        data = apiTest.testPowerflowRealtimeDataHybrid;
        adapter.log.warn("getPowerFlowRealtimeDataTest -> Hybrid:" + JSON.stringify(data))
        devObjects.createPowerFlowObjects(adapter ,data.Body.Data,"hybrid.");
        fillData(adapter,data.Body.Data.Inverters,'inverter.hybrid');
        fillData(adapter,data.Body.Data.Site,'site.hybrid');

        data = apiTest.testPowerflowRealtimeDataGen24;
        adapter.log.warn("getPowerFlowRealtimeDataTest -> GEN24:" + JSON.stringify(data))
        devObjects.createPowerFlowObjects(adapter ,data.Body.Data,"gen24.");
        fillData(adapter,data.Body.Data.Inverters,'inverter.gen24');
        fillData(adapter,data.Body.Data.Site,'site.gen24');
        return;
    }
    axios.get(requestType + ip + baseurl + 'GetPowerFlowRealtimeData.fcgi')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    var resp = response.data.Body.Data;
                    if (!isObjectsCreated) {
                        devObjects.createPowerFlowObjects(adapter,resp);
                    }
                    fillData(adapter,resp.Inverters,"inverter");
                    fillData(adapter,resp.Site,"site");
                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " powerflow");
                }
            } catch (e) {
                adapter.log.warn("getPowerFlowRealtimeData: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("getPowerFlowRealtimeData has thrown following error: " + error);
    });
}

function getInverterInfo() {
    if(testMode){
        var data = apiTest.testInverterInfo;
        adapter.log.warn("getInverterInfoTest -> Standard:" + JSON.stringify(data))
        devObjects.createInverterInfoObjects(adapter ,data.Body.Data,"standard.");
        fillData(adapter,data.Body.Data,'inverter.standard');

        data = apiTest.testInverterInfoGen24;
        adapter.log.warn("getInverterInfoTest -> GEN24:" + JSON.stringify(data))
        devObjects.createInverterInfoObjects(adapter ,data.Body.Data,"gen24.");
        fillData(adapter,data.Body.Data,'inverter.gen24');
        return;
    }
    axios.get(requestType + ip + baseurl + 'GetInverterInfo.cgi')
    .then(function (response) {
        if (response.status == 200) {
            try {
                if ("Body" in response.data) {
                    if (!isObjectsCreated) {
                        devObjects.createInverterInfoObjects(adapter, response.data.Body.Data);
                    }
                    fillData(adapter,response.data.Body.Data,"inverter");
                } else {
                    adapter.log.warn(response.data.Head.Status.Reason + " inverterinfo");
                }
            } catch (e) {
                adapter.log.warn("getInverterInfo: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("getInverterInfo has thrown following error: " + error);
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
            setConnected(false);
            return;
        }
        
        if (response.status == 200 && 'BaseURL' in testData) {
            // it seems everything is working, therefore proceed with readout
            setConnected(true);
            adapter.config.inverter.split(',').forEach(function(entry) {
                getInverterRealtimeData(entry);
            });

            if (adapter.config.sensorCard) {
                adapter.config.sensorCard.split(',').forEach(function(entry) {
                    getSensorRealtimeDataNow(entry);
                    getSensorRealtimeDataMinMax(entry);
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
                getOhmPilotRealtimeData();
            }

            adapter.setState("info.lastsync", { val: new Date().toISOString(), ack: true });
        } else {
            adapter.log.debug("Unable to read data from inverters solarAPI");
            setConnected(false);
        }

    }).catch(function(error){
        adapter.log.debug("checkStatus has thrown following error: " + error);
        setConnected(false);
    });
}

function checkArchiveStatus() {
    if (isArchiveObjectsCreated == false && isConnected) {
        adapter.log.debug("Object creation for archive will be done for " + downCountArchive + " times")
        if (--downCountArchive < 0) {
            isArchiveObjectsCreated = true
        }
    }

    // now try if we can really read data from the API. If not do not further process
    axios.get(requestType + ip + '/solar_api/GetAPIVersion.cgi')
    .then(function (response) {
        var testData = null
        try {
            testData = response.data;
        } catch (e) {
            adapter.log.debug("Exception thrown in archive check API: " + e);
            if (response.data != null) {
                adapter.log.debug("API Response for " + requestType + ip + '/solar_api/GetAPIVersion.cgi:' + JSON.stringify(response.data));
            }
            return;
        }
        if (response.statusCode == 200 && 'BaseURL' in testData) {
            // it seems everything is working, therefore proceed with readout
            if (apiver === 1) {
                GetArchiveData(adapter.config.inverter);
            }

            adapter.setState("info.lastsyncarchive", { val: new Date().toISOString(), ack: true });
        } else {
            adapter.log.debug("Unable to read archive data from inverters solarAPI");
        }

    }).catch(function(error){
        adapter.log.debug("checkArchiveStatus has thrown following error: " + error);
    });
}

//Hardware and Software Version
function getLoggerInfo() {
    axios.get(requestType + ip + baseurl + 'GetLoggerInfo.cgi')
    .then(function (response) {
        if (response.status == 200) {
            try {
                const data = response.data;
                if ("Body" in data && Object.keys(data.Body.Data).length > 0) {
                    const resp = data.Body.LoggerInfo;
                    if (!isObjectsCreated) {
                        devObjects.createInfoObjects(adapter, resp);
                    }
                    fillData(adapter,resp,"site");
                } else {
                    adapter.log.debug("getLoggerInfo: " + data.Head.Status.Reason);
                }
            } catch (e) {
                adapter.log.warn("getLoggerInfo: " + e);
            }
        }
    }).catch(function(error){
        adapter.log.debug("getLoggerInfo has thrown following error: " + error);
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
        adapter.setState(prefix + key,val,true);
        return val;
    }
    return null;
}

// this function should not be called directly, better is to call through fillData function as this includes a timeout handling
function fillDataObject(adapter,apiObject,prefix=""){
    if(prefix != "" && prefix.endsWith('.') == false){ // make sure the path ends with a . if set
        prefix = prefix + '.';
    }
    if(apiObject.hasOwnProperty('Value') && apiObject.hasOwnProperty('Unit')){ // value + unit on first level -> special handling
        var val = apiObject.Value;
        if(typeof(val) == 'number'){
            val = Math.round((val + Number.EPSILON)*100)/100;
        }
        adapter.setState(prefix + "Value",val,true);
        apiObject = Object.assign({},apiObject) // create a copy for further processing to not delete it from source object
        delete apiObject.Value;
        delete apiObject.Unit;
    }
    for (var key in apiObject){
        if(apiObject[key.toString()] === null){
            adapter.log.debug("API Objekt " + key.toString() + " is null, no object filled!");
        }else if(typeof(apiObject[key.toString()]) == "object"){ // this is a nested object to fill!
            if(apiObject[key.toString()].hasOwnProperty('Value')){ // handling object with value and Unit below
                var val = apiObject[key.toString()].Value;
                if(typeof(val) == 'number'){
                    val = Math.round((val + Number.EPSILON)*100)/100;
                }
                adapter.setState(prefix + key.toString(),val,true);
            }else{ // nested object to fill -> recurse
                fillDataObject(adapter,apiObject[key.toString()],prefix + key.toString())
            }
        }else{ // standard object to fill
            var val = apiObject[key.toString()];
            if(typeof(val) == 'number'){
                val = Math.round((val + Number.EPSILON)*100)/100;
            }
            adapter.setState(prefix + key.toString(),val,true);
        }
    }
}

// function to be called to fill the data 
function fillData(adapter,apiObject,prefix=""){
    setTimeout(function(adapt,data,pref){
        fillDataObject(adapt,data,pref);
    },isObjectsCreated?1:3000,adapter,apiObject,prefix);
}

function main() {

    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    ip = adapter.config.ip;
    baseurl = adapter.config.baseurl;
    apiver = parseInt(adapter.config.apiversion);
    requestType = adapter.config.requestType;
    downCount = 2; // do the objects creation 2 times after restarting the Adapter
    downCountArchive = 2; // do the objects creation for archive data 2 times after restarting the Adapter

    if (ip && baseurl) {

        checkIP(ip,function(res){
            adapter.log.debug("checkIP is executed with result error=" + res.error + ", message=" + JSON.stringify(res.message));
            getLoggerInfo();
            checkStatus();
            checkArchiveStatus();

            let secs = adapter.config.poll;
            if (isNaN(secs) || secs < 1) {
                secs = 10;
            }

            // run cyclic requests for values
            setInterval(checkStatus, secs * 1000);

            let archivesecs = adapter.config.pollarchive;
            if (isNaN(archivesecs) || archivesecs < 1) {
                archivesecs = 150;
            }

            // run cyclic requests for archive values
            setInterval(checkArchiveStatus, archivesecs * 1000);

            // check every hour if something has changed on the bus (number of devices)
            setInterval(checkExistingConfig, 3600 * 1000);
        });

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