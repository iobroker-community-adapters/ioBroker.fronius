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
var utils =    require(__dirname + '/lib/utils'); // Get common adapter utils
var request = require('request');
var ping = require("ping");

// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluding extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.template.0
var adapter = utils.adapter('fronius');

var ip, baseurl, deviceid, apiver;
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

function getInverterRealtimeDataCommonInverterData(){
    request.get('http://' + ip + baseurl + 'GetInverterRealtimeData.cgi?Scope=Device&DeviceId=' + deviceid + '&DataCollection=CommonInverterData', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var data = JSON.parse(body);
                if("Body" in data) {
                    var resp = data.Body.Data;
                    adapter.setState("ird.CommonInverterData.DAY_ENERGY", {val: resp.DAY_ENERGY.Value, ack: true});
                    adapter.setState("ird.CommonInverterData.TOTAL_ENERGY", {val: resp.TOTAL_ENERGY.Value, ack: true});
                    adapter.setState("ird.CommonInverterData.YEAR_ENERGY", {val: resp.YEAR_ENERGY.Value, ack: true});

                    if("PAC" in data) {
                        adapter.setState("ird.CommonInverterData.FAC", {val: resp.FAC.Value, ack: true});
                        adapter.setState("ird.CommonInverterData.IAC", {val: resp.IAC.Value, ack: true});
                        adapter.setState("ird.CommonInverterData.IDC", {val: resp.IDC.Value, ack: true});
                        adapter.setState("ird.CommonInverterData.PAC", {val: resp.PAC.Value, ack: true});
                        adapter.setState("ird.CommonInverterData.UAC", {val: resp.UAC.Value, ack: true});
                        adapter.setState("ird.CommonInverterData.UDC", {val: resp.UDC.Value, ack: true});
                    }else{
                        adapter.setState("ird.CommonInverterData.FAC", {val: 0, ack: true});
                        adapter.setState("ird.CommonInverterData.IAC", {val: 0, ack: true});
                        adapter.setState("ird.CommonInverterData.IDC", {val: 0, ack: true});
                        adapter.setState("ird.CommonInverterData.PAC", {val: 0, ack: true});
                        adapter.setState("ird.CommonInverterData.UAC", {val: 0, ack: true});
                        adapter.setState("ird.CommonInverterData.UDC", {val: 0, ack: true});
                    }

                }else{
                    adapter.log.error(data.Head.Status.Reason);
                    return true;
                }
            }catch(e){
                adapter.log.error(e);
            }
            return false;
        }
        return true;
    });
}

function checkStatus() {
    ping.sys.probe(ip, function (isAlive) {
        adapter.setState("connected", {val: isAlive, ack: true});
        if (isAlive) {
            var error = getInverterRealtimeDataCommonInverterData();
            if(!error) {
                adapter.setState("lastsync", {val: new Date().toISOString(), ack: true});
            }
        }
    });
}

function main() {

	// The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    ip = adapter.config.ip;
    baseurl = adapter.config.baseurl;
    deviceid = adapter.config.deviceId;
    hybrid = adapter.config.hybrid;
    apiver = adapter.config.apiversion;
	
	 if (ip && baseurl && deviceid) {

         var secs = adapter.config.poll;
         if (isNaN(secs) || secs < 1) {
             secs = 10;
         }

         setInterval(checkStatus, secs * 1000);

    } else {
        adapter.log.error("Please configure the Fronius adapter");
    }


}
