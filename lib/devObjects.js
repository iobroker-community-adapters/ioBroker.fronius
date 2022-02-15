function createInverterObjects(adapter, id, obj) {

    adapter.setObjectNotExists('Inverters.' + id, {
        type: 'channel',
        common: {
            name: "Inverter with device ID " + id,
            role: "info"
        },
        native: {}
    });
    
    addObjectNotExists(adapter,"Inverters." + id,"UAC","AC voltage","number","V",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"IAC","AC current","number","A",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"PAC","AC power","number","W",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"SAC","AC apparent power","number","VA",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"FAC","Mains frequency","number","Hz",obj,"","value");

    addObjectNotExists(adapter,"Inverters." + id,"UAC_L1","AC voltage L1","number","V",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"IAC_L1","AC currrent L1","number","A",obj,"","value");

    addObjectNotExists(adapter,"Inverters." + id,"UAC_L2","AC voltage L2","number","V",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"IAC_L2","AC currrent L2","number","A",obj,"","value");

    addObjectNotExists(adapter,"Inverters." + id,"UAC_L3","AC voltage L3","number","V",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"IAC_L3","AC currrent L3","number","A",obj,"","value");

    addObjectNotExists(adapter,"Inverters." + id,"UDC","DC voltage tracker 1","number","V",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"IDC","DC current tracker 1","number","A",obj,"","value");
    if(obj.hasOwnProperty("UDC") && obj.hasOwnProperty("IDC")){
        addObjectNotExists(adapter,"Inverters." + id,"PDC","DC power tracker 1","number","W",null,"","value");
    }
    
    addObjectNotExists(adapter,"Inverters." + id,"UDC_2","DC voltage tracker 2","number","V",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"IDC_2","DC current tracker 2","number","A",obj,"","value");
    if(obj.hasOwnProperty("UDC_2") && obj.hasOwnProperty("IDC_2")){
        addObjectNotExists(adapter,"Inverters." + id,"PDC_2","DC power tracker 2","number","W",null,"","value");
    }

    addObjectNotExists(adapter,"Inverters." + id,"DAY_ENERGY","Produced energy current day","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"YEAR_ENERGY","Produced energy in current year","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"TOTAL_ENERGY","Overall produced Energy","number","Wh",obj,"","value");

    addObjectNotExists(adapter,"Inverters." + id,"T_AMBIENT","Inverter case temperature","number","°C",obj,"","value");
    
    // now crate all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Inverters." + id);
    },500);

/*
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
            name: "status code string",
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
            name: "error code string",
            type: "string",
            role: "value",
            read: true,
            write: false,
            desc: "Meaning of numerical error codes for the inverter"
        },
        native: {}
    });

    // wait a bit for creating the previous objects before creating the fallback once
    setTimeout(function() {
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
    */
}

function createArchiveObjects(adapter, id, obj) {

    adapter.setObjectNotExists('Inverters.' + id, {
        type: 'channel',
        common: {
            name: "Inverter with device ID " + id,
            role: "info"
        },
        native: {}
    });
    
    addObjectNotExists(adapter,"Inverters." + id,'Power_DC_String_2',"DC Power of string 2",'number',"W",null,"","value")
    addObjectNotExists(adapter,"Inverters." + id,'Current_DC_String_1',"DC Current of string 1",'number',"A",obj["inverter/"+id]["Data"],"","value")
    addObjectNotExists(adapter,"Inverters." + id,'Current_DC_String_2',"DC Current of string 2",'number',"A",obj["inverter/"+id]["Data"],"","value")
    addObjectNotExists(adapter,"Inverters." + id,'Voltage_DC_String_1',"DC Voltage of string 1",'number',"V",obj["inverter/"+id]["Data"],"","value")
    addObjectNotExists(adapter,"Inverters." + id,'Voltage_DC_String_2',"DC Voltage of string 2",'number',"V",obj["inverter/"+id]["Data"],"","value")
    addObjectNotExists(adapter,"Inverters." + id,'Temperature_Powerstage',"Temperature of Inverter Powerstage",'number',"°C",obj["inverter/"+id]["Data"],"","value")
   
    if (obj["inverter/"+id]["Data"].hasOwnProperty("Voltage_DC_String_1") & obj["inverter/"+id]["Data"].hasOwnProperty("Current_DC_String_1")) {
        addObjectNotExists(adapter,"Inverters." + id,'Power_DC_String_1',"DC Power of string 1",'number',"W",null,"","value")
    }
    if (obj["inverter/"+id]["Data"].hasOwnProperty("Voltage_DC_String_2") & obj["inverter/"+id]["Data"].hasOwnProperty("Current_DC_String_2")) {
        addObjectNotExists(adapter,"Inverters." + id,'Power_DC_String_2',"DC Power of string 2",'number',"W",null,"","value")
    }
}

function createStorageObjects(adapter, id, obj) {
    adapter.setObjectNotExists('Storage', {
        type: 'channel',
        common: {
            name: "Detailed information about Storage devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('Storage.' + id, {
        type: 'channel',
        common: {
            name: "Storage with device ID " + id,
            role: "info"
        },
        native: {}
    });

    addObjectNotExists(adapter,"Storage." + id,"Enable","Storage controller enabled","number","",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"StateOfCharge_Relative","Relative charging state of battery","number","%",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"Voltage_DC","Battery voltage","number","V",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"Current_DC","Battery current","number","A",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"Temperature_Cell","Battery cell temperature","number","°C",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"Voltage_DC_Maximum_Cell","Maximum cell voltage","number","V",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"Voltage_DC_Minimum_Cell","Minimum cell voltage","number","V",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"DesignedCapacity","Designed capacity of battery","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Storage." + id,"Capacity_Maximum","Designed capacity of battery","number","Wh",obj,"","value");

    // now crate all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Storage." + id);
    },500);
}

function createMeterObjects(adapter, id, obj) {

    adapter.setObjectNotExists('Meter', {
        type: 'channel',
        common: {
            name: "Detailed information about Meter devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('Meter.' + id, {
        type: 'channel',
        common: {
            name: "Meter with device ID " + id,
            role: "info"
        },
        native: {}
    });

    addObjectNotExists(adapter,"Meter." + id,"PowerReal_P_Sum","Actual power","number","W",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerReal_P_Phase_1","Actual power L1","number","W",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerReal_P_Phase_2","Actual power L2","number","W",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerReal_P_Phase_3","Actual power L3","number","W",obj,"","value");
    
    addObjectNotExists(adapter,"Meter." + id,"PowerReactive_Q_Sum","Actual reactive power","number","VAr",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerReactive_Q_Phase_1","Actual reactive power L1","number","VAr",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerReactive_Q_Phase_2","Actual reactive power L2","number","VAr",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerReactive_Q_Phase_3","Actual reactive power L3","number","VAr",obj,"","value");

    addObjectNotExists(adapter,"Meter." + id,"Current_AC_Sum","AC current sum","number","A",obj,"","value");
    
    addObjectNotExists(adapter,"Meter." + id,"Voltage_AC_Phase_1","AC voltage L1","number","V",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"Current_AC_Phase_1","AC current L1","number","A",obj,"","value");

    addObjectNotExists(adapter,"Meter." + id,"Voltage_AC_Phase_2","AC voltage L2","number","V",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"Current_AC_Phase_2","AC current L2","number","A",obj,"","value");
    
    addObjectNotExists(adapter,"Meter." + id,"Voltage_AC_Phase_3","AC voltage L3","number","V",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"Current_AC_Phase_3","AC current L3","number","A",obj,"","value");
    
    addObjectNotExists(adapter,"Meter." + id,"Voltage_AC_PhaseToPhase_12","AC voltage L1-L2","number","V",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"Voltage_AC_PhaseToPhase_23","AC voltage L2-L3","number","V",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"Voltage_AC_PhaseToPhase_31","AC voltage L3-L1","number","V",obj,"","value");

    addObjectNotExists(adapter,"Meter." + id,"Frequency_Phase_Average","AC Frequency","number","Hz",obj,"","value");

    addObjectNotExists(adapter,"Meter." + id,"PowerApparent_S_Sum","Actual apparent power","number","VA",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerApparent_S_Phase_1","Actual apparent power L1","number","VA",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerApparent_S_Phase_2","Actual apparent power L2","number","VA",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"PowerApparent_S_Phase_3","Actual apparent power L3","number","VA",obj,"","value");

    addObjectNotExists(adapter,"Meter." + id,"EnergyReal_WAC_Sum_Produced","Produced energy total","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"EnergyReal_WAC_Sum_Consumed","Consumed energy total","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"EnergyReal_WAC_Plus_Absolute","Consumed energy from Grid","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"EnergyReal_WAC_Minus_Absolute","Produced energy feed to Grid","number","Wh",obj,"","value");

    addObjectNotExists(adapter,"Meter." + id,"EnergyReactive_VArAC_Sum_Produced","Produced reactive energy","number","VArh",obj,"","value");
    addObjectNotExists(adapter,"Meter." + id,"EnergyReactive_VArAC_Sum_Consumed","Consumed reactive energy","number","VArh",obj,"","value");

    // now crate all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Meter." + id);
    },500);
}

function createSensorNowObjects(adapter, id, obj) {

    adapter.setObjectNotExists('Sensors', {
        type: 'channel',
        common: {
            name: "Detailed information about Sensor devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('Sensors.' + id, {
        type: 'channel',
        common: {
            name: "Sensor with device ID " + id,
            role: "info"
        },
        native: {}
    });

    // now create all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Sensors");
    },1000);

}

function createSensorMinMaxObjects(adapter, id, obj) {

    adapter.setObjectNotExists('Sensors', {
        type: 'channel',
        common: {
            name: "Detailed information about Sensor devices",
            role: "info"
        },
        native: {}
    });
    adapter.setObjectNotExists('Sensors.' + id, {
        type: 'channel',
        common: {
            name: "Sensor with device ID " + id,
            role: "info"
        },
        native: {}
    });

    // now create all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Sensors");
    },1000);

}

function createPowerFlowInverterObjects(adapter, id, obj) {

    addObjectNotExists(adapter,"Inverters." + id,"E_Day","Produced energy current day","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"E_Year","Produced energy current year","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"E_Total","Produced energy total","number","Wh",obj,"","value");
    addObjectNotExists(adapter,"Inverters." + id,"P","Actual PV power","number","W",obj,"","value");

    // now crate all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Inverters." + id);
    },1000);
    
}

function createPowerFlowObjects(adapter, obj) {
    adapter.log.info(JSON.stringify(obj.Site));
    addObjectNotExists(adapter,"Site","P_Grid","Actual grid power","number","W",obj.Site,"","value");
    addObjectNotExists(adapter,"Site","P_Load","Actual load power","number","W",obj.Site,"","value");
    addObjectNotExists(adapter,"Site","P_Akku","Actual akku power","number","W",obj.Site,"","value");
    addObjectNotExists(adapter,"Site","P_PV","Actual PV power","number","W",obj.Site,"","value");

    addObjectNotExists(adapter,"Site","E_Day","Produced energy current day","number","Wh",obj.Site,"","value");
    addObjectNotExists(adapter,"Site","E_Year","Produced energy current year","number","Wh",obj.Site,"","value");
    addObjectNotExists(adapter,"Site","E_Total","Produced energy total","number","Wh",obj.Site,"","value");

    addObjectNotExists(adapter,"Site","rel_Autonomy","Relative PV autonomy","number","%",obj.Site,"","value");
    addObjectNotExists(adapter,"Site","rel_SelfConsumption","Relative PV self consumption","number","%",obj.Site,"","value");

    // now crate all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj.Site, "Site");
        createStates(adapter,obj.Inverters, "Inverters");
    },1000);

}

function createInverterInfoObjects(adapter, obj) {
/*
Todo: create the predefined objects in a loop of the obj
    addObjectNotExists(adapter,"Inverters." + id,"DTString","Device type","string","",obj,"","info");
    addObjectNotExists(adapter,"Inverters." + id,"PVPower","PV peak power","number","W",obj,"","value");
*/
    // now create all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Inverters");
    },1000);

}

function createInfoObjects(adapter, obj) {
   
    addObjectNotExists(adapter,"Site","HWVersion","Hardware Version","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","SWVersion","Software Version","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","CO2Factor","CO2 Factor","number","",obj,"","meta")
    addObjectNotExists(adapter,"Site","CO2Unit","CO2 Unit","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","CashFactor","Cash factor","number","",obj,"","meta")
    addObjectNotExists(adapter,"Site","CashCurrency","Cash currency","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","DefaultLanguage","Default Language","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","DeliveryFactor","Delivery Factor","number","",obj,"","meta")
    addObjectNotExists(adapter,"Site","PlatformID","Platform ID","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","ProductID","Product ID","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","TimezoneLocation","Timezone Location","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","TimezoneName","Timezone Name","string","",obj,"","meta")
    addObjectNotExists(adapter,"Site","UTCOffset","UTC Offset [s]","number","",obj,"","meta")
    addObjectNotExists(adapter,"Site","UniqueID","Unique ID","string","",obj,"","meta")

    // now create all states that are not predefined above
    setTimeout(function(){
        createStates(adapter,obj, "Site");
    },1000);

}

function createStates(adapter,apiObject,prefix=""){
    if(prefix != "" && prefix.endsWith('.') == false){ // make sure the path ends with a . if set
        prefix = prefix + '.';
    }
    for (var key in apiObject){
        if(apiObject[key.toString()] != null && typeof(apiObject[key.toString()]) == "object"){ // this is a nested object to parse!
            if(apiObject[key.toString()].hasOwnProperty('Value')){ // handling object with value and Unit below
                addObjectNotExists(adapter,prefix,key.toString(),'','','',apiObject,'','');
            }else{ // standard nested object to parse
                var data2 = apiObject[key.toString()]
                for (var subKey in data2){
                    if(typeof(data2[subKey.toString()])== "object"){
                        for (var subsub in data2[subKey.toString()]){
                            addObjectNotExists(adapter,prefix + key.toString() + '.' + subKey.toString(),subsub.toString(),'','','',data2[subKey.toString()],'','')
                         }
                    }else{
                        addObjectNotExists(adapter,prefix + key.toString(),subKey.toString(),'','','',data2,'','')
                  }
                }
            }
        }else if(apiObject[key.toString()] === null){
            adapter.log.debug("API Objekt " + key.toString() + " ist null!");
         }else{ // standard object to parse
            addObjectNotExists(adapter,prefix,key.toString(),'','','',apiObject,'','');
        }
    }
}

function addObjectNotExists(adapter,path,stateId,stateName = '',stateType='', stateUnit='',apiObject=Object(null),stateDescription='',stateRole=''){
    var sObj = Object({type:'state', common:{read:true, write:false, name:stateName, type:stateType}});

    if(stateName == ""){
        sObj.common.name = stateId;
    }

    if(stateRole != ""){
        sObj.common.role = stateRole;
    }

    if(stateType == ''){ // ensure if not set to use 'mixed' as type
        sObj.common.type = 'mixed'
    }

    if(path != "" && path.endsWith('.') == false){ // make sure the path ends with a . if set
        path = path + '.';
    }

    if(stateDescription != ""){
        sObj.common.desc = stateDescription;
    }

    if(stateUnit != ""){
        sObj.common.unit = stateUnit;
    }
    
    if(apiObject === null || apiObject== 'undefined'){
        adapter.setObjectNotExists(path + stateId, sObj);
    }else if(apiObject.hasOwnProperty(stateId)){
        if(apiObject[stateId] === null){
            adapter.log.error("Property " + stateId + " is null. No object created!");
            return;
        }else if(apiObject[stateId] != null && typeof(apiObject[stateId]) == 'object'){
            if(apiObject[stateId].hasOwnProperty('Value') && typeof(apiObject[stateId]['Value']) != 'object'){ // check if it is a object with Value/Unit pair and overwrite in this case the stateType and stateUnit
                sObj.common.type = typeof(apiObject[stateId]['Value']);
            }
            if(apiObject[stateId].hasOwnProperty('Unit')){
                sObj.common.unit = apiObject[stateId]['Unit'];
            }
        }else if(apiObject[stateId] != null && typeof(apiObject[stateId]) != 'object'){
            sObj.common.type = typeof(apiObject[stateId]);
        }
        adapter.setObjectNotExists(path + stateId, sObj);
    }else{
        adapter.log.debug("Object " + JSON.stringify(apiObject) + " does not have a property " + stateId + ", therefore no State was created");
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