/**
 *
 *      ioBroker Fronius inverters Adapter
 *
 *      (c) 2017 ldittmar <iobroker@lmdsoft.de>
 *
 *      MIT License
 *
 */

/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

// you have to require the utils module and call adapter function
var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var request = require('request');
var ping = require("ping");

// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluding extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.template.0
var adapter = utils.adapter('fronius');

var ip, baseurl, apiver;
var hybrid = false;

// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});

// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});

// is called if a subscribed state changes
adapter.on('stateChange', function (id, state) {
    // Warning, state can be null if it was deleted
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

    // you can use the ack flag to detect if it is status (true) or command (false)
    if (state && !state.ack) {
        adapter.log.info('ack is not set!');
    }
});

// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
adapter.on('message', function (obj) {
    var wait = false;
    if (obj) {
        switch (obj.command) {
            case 'checkIP':
                checkIP(obj.message, function (res) {
                    if (obj.callback) adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                });
                wait = true;
                break;
            case 'getDeviceInfo':
                getActiveDeviceInfo("System", obj.message, function (res) {
                    if (obj.callback) adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                });
                wait = true;
                break;
            case 'getDeviceInfoInverter':
                getActiveDeviceInfo("Inverter", obj.message, function (res) {
                    if (obj.callback) adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                });
                wait = true;
                break;
            case 'getDeviceInfoSensor':
                getActiveDeviceInfo("SensorCard", obj.message, function (res) {
                    if (obj.callback) adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
                });
                wait = true;
                break;
            case 'getDeviceInfoString':
                getActiveDeviceInfo("StringControl", obj.message, function (res) {
                    if (obj.callback) adapter.sendTo(obj.from, obj.command, JSON.stringify(res), obj.callback);
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
});

// is called when databases are connected and adapter received configuration.
// start here!
adapter.on('ready', function () {
    main();
});

//Check if IP is a Fronius inverter
function checkIP(ipToCheck, callback) {
    request.get('http://' + ipToCheck + '/solar_api/GetAPIVersion.cgi', function (error, response, body) {
        try {
            var testData = JSON.parse(body);
            if (!error && response.statusCode == 200 && 'BaseURL' in testData) {
                callback({error: 0, message: testData});
            }else{
                adapter.log.error("IP invalid");
                callback({error: 1, message: {}});
            }
        } catch (e) {
            adapter.log.error("IP is not a Fronis inverter");
            callback({error: 1, message: {}});
        }
    });
}

//Check Fronius devices v1
function getActiveDeviceInfo(type, url, callback) {
    adapter.log.info("scheissssseeeeee " + type + url);
    request.get('http://' + url + 'GetActiveDeviceInfo.cgi?DeviceClass=' + type, function (error, response, body) {
        adapter.log.info(body);
        try {
            var deviceData = JSON.parse(body);
            if (!error && response.statusCode == 200 && 'Body' in deviceData) {
                callback({error: 0, message: deviceData.Body.Data});
            }else{
                adapter.log.error(data.Head.Status.Reason);
                callback({error: 1, message: {}});
            }
        } catch (e) {
            callback({error: 1, message: {}});
        }
    });
}

function createInverterObjects(id){
    adapter.setObjectNotExists('inverter.' + id, {
        type: 'channel',
        common: {
            name: "inverter with device ID " + id,
            role: "info"
        },
        native: {}
    });
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

//Get Infos from Inverter
function getInverterRealtimeData(id){
    request.get('http://' + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + id + '&DataCollection=CommonInverterData', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var data = JSON.parse(body);
                if("Body" in data) {

                    createInverterObjects(id);

                    var resp = data.Body.Data;
                    adapter.setState("inverter." + id + ".DAY_ENERGY", {val: resp.DAY_ENERGY.Value, ack: true});
                    adapter.setState("inverter." + id + ".TOTAL_ENERGY", {val: resp.TOTAL_ENERGY.Value, ack: true});
                    adapter.setState("inverter." + id + ".YEAR_ENERGY", {val: resp.YEAR_ENERGY.Value, ack: true});

                    if("PAC" in data) {
                        adapter.setState("inverter." + id + ".FAC", {val: resp.FAC.Value, ack: true});
                        adapter.setState("inverter." + id + ".IAC", {val: resp.IAC.Value, ack: true});
                        adapter.setState("inverter." + id + ".IDC", {val: resp.IDC.Value, ack: true});
                        adapter.setState("inverter." + id + ".PAC", {val: resp.PAC.Value, ack: true});
                        adapter.setState("inverter." + id + ".UAC", {val: resp.UAC.Value, ack: true});
                        adapter.setState("inverter." + id + ".UDC", {val: resp.UDC.Value, ack: true});
                    }else{
                        adapter.setState("inverter." + id + ".FAC", {val: 0, ack: true});
                        adapter.setState("inverter." + id + ".IAC", {val: 0, ack: true});
                        adapter.setState("inverter." + id + ".IDC", {val: 0, ack: true});
                        adapter.setState("inverter." + id + ".PAC", {val: 0, ack: true});
                        adapter.setState("inverter." + id + ".UAC", {val: 0, ack: true});
                        adapter.setState("inverter." + id + ".UDC", {val: 0, ack: true});
                    }

                }else{
                    adapter.log.error(data.Head.Status.Reason + " inverter: " + id);
                }
            }catch(e){
                adapter.log.error(e);
            }
        }
    });
}

function getStorageRealtimeData(id){

}

function getMeterRealtimeData(id){

}

function getSensorRealtimeData(id){

}

function getStringRealtimeData(id){

}

function getPowerFlowRealtimeData(){

}

function checkStatus() {
    ping.sys.probe(ip, function (isAlive) {
        adapter.setState("connected", {val: isAlive, ack: true});
        if (isAlive) {
            var inverterIds = adapter.config.inverter;
            adapter.log.info(inverterIds);
            adapter.log.info(inverterIds instanceof Array);
            adapter.log.info(inverterIds.split(',') instanceof Array);
            inverterIds.split(',').forEach(function(entry){
                getInverterRealtimeData(entry);
            });
            adapter.config.sensorCard.split(',').forEach(function(entry){
                getSensorRealtimeData(entry);
            });
            adapter.config.stringControl.split(',').forEach(function(entry){
                getStringRealtimeData(entry);
            });

            if(apiver === 1) {
                adapter.config.meter.split(',').forEach(function(entry){
                    getMeterRealtimeData(entry);
                });
                adapter.config.storage.split(',').forEach(function (entry) {
                    getStorageRealtimeData(entry);
                });
                getPowerFlowRealtimeData();
            }

            adapter.setState("lastsync", {val: new Date().toISOString(), ack: true});
        }
    });
}

//Hardware and Software Version
function getLoggerInfo(){
    request.get('http://' + ip + baseurl + 'GetLoggerInfo.cgi', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var data = JSON.parse(body);
                if("Body" in data) {
                    var resp = data.Body.LoggerInfo;
                    adapter.setState("HWVersion", {val: resp.HWVersion, ack: true});
                    adapter.setState("SWVersion", {val: resp.SWVersion, ack: true});
                }else{
                    adapter.log.error(data.Head.Status.Reason);
                }
            }catch(e){
                adapter.log.error(e);
            }
        }
        adapter.log.error(error);
    });
}

function main() {

	// The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    ip = adapter.config.ip;
    baseurl = adapter.config.baseurl;
    apiver = parseInt(adapter.config.apiversion);
	
	 if (ip && baseurl) {

         getLoggerInfo();

         var secs = adapter.config.poll;
         if (isNaN(secs) || secs < 1) {
             secs = 10;
         }

         setInterval(checkStatus, secs * 1000);

    } else {
        adapter.log.error("Please configure the Fronius adapter");
    }


}
