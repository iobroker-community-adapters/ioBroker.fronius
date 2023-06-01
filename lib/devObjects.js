function createInverterObjects(adapter, id, obj) {

    try{
        adapter.log.silly("createInverterObjects: " + JSON.stringify(obj));
        adapter.setObjectNotExists('inverter.' + id, {
            type: 'channel',
            common: {
                name: "Inverter with device ID " + id,
                role: "info"
            },
            native: {}
        });
        
        addObjectNotExists(adapter,"inverter." + id,"UAC","AC voltage","number","V",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"IAC","AC current","number","A",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"PAC","AC power","number","W",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"SAC","AC apparent power","number","VA",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"FAC","Mains frequency","number","Hz",obj,"","value");

        addObjectNotExists(adapter,"inverter." + id,"UAC_L1","AC voltage L1","number","V",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"IAC_L1","AC currrent L1","number","A",obj,"","value");

        addObjectNotExists(adapter,"inverter." + id,"UAC_L2","AC voltage L2","number","V",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"IAC_L2","AC currrent L2","number","A",obj,"","value");

        addObjectNotExists(adapter,"inverter." + id,"UAC_L3","AC voltage L3","number","V",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"IAC_L3","AC currrent L3","number","A",obj,"","value");

        addObjectNotExists(adapter,"inverter." + id,"UDC","DC voltage tracker 1","number","V",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"IDC","DC current tracker 1","number","A",obj,"","value");
        if(Object.prototype.hasOwnProperty.call(obj,"UDC") && Object.prototype.hasOwnProperty.call(obj,"IDC")){
            addObjectNotExists(adapter,"inverter." + id,"PDC","DC power tracker 1","number","W",null,"","value");
        }
        
        addObjectNotExists(adapter,"inverter." + id,"UDC_2","DC voltage tracker 2","number","V",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"IDC_2","DC current tracker 2","number","A",obj,"","value");
        if(Object.prototype.hasOwnProperty.call(obj,"UDC_2") && Object.prototype.hasOwnProperty.call(obj,"IDC_2")){
            addObjectNotExists(adapter,"inverter." + id,"PDC_2","DC power tracker 2","number","W",null,"","value");
        }

        addObjectNotExists(adapter,"inverter." + id,"DAY_ENERGY","Produced energy current day","number","Wh",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"YEAR_ENERGY","Produced energy in current year","number","Wh",obj,"","value");
        addObjectNotExists(adapter,"inverter." + id,"TOTAL_ENERGY","Overall produced Energy","number","Wh",obj,"","value");

        addObjectNotExists(adapter,"inverter." + id,"T_AMBIENT","Inverter case temperature","number","°C",obj,"","value");

        addObjectNotExists(adapter,"inverter." + id,"DeviceStatus.InverterState","Inverter state","string","",null);
        addObjectNotExists(adapter,"inverter." + id,"DeviceStatus.InverterErrorState","Inverter Error state","string","",null);
        
        // now crate all states that are not predefined above
        setTimeout(function(obj,id){
            createStates(adapter,obj, "inverter." + id);
        },1000,obj,id);
    }catch(ex){
        adapter.log.error("Error on createInverterObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + obj)
    }
}

function createArchiveObjects(adapter, id, obj) {
    try{
        adapter.log.silly("createArchiveObjects: " + JSON.stringify(obj));
        adapter.setObjectNotExists('inverter.' + id, {
            type: 'channel',
            common: {
                name: "Inverter with device ID " + id,
                role: "info"
            },
            native: {}
        });
        
        addObjectNotExists(adapter,"inverter." + id,'Current_DC_String_1',"DC Current of string 1",'number',"A",obj,"","value")
        addObjectNotExists(adapter,"inverter." + id,'Current_DC_String_2',"DC Current of string 2",'number',"A",obj,"","value")
        addObjectNotExists(adapter,"inverter." + id,'Voltage_DC_String_1',"DC Voltage of string 1",'number',"V",obj,"","value")
        addObjectNotExists(adapter,"inverter." + id,'Voltage_DC_String_2',"DC Voltage of string 2",'number',"V",obj,"","value")
        addObjectNotExists(adapter,"inverter." + id,'Temperature_Powerstage',"Temperature of Inverter Powerstage",'number',"°C",obj,"","value")
        if (Object.prototype.hasOwnProperty.call(obj,"Voltage_DC_String_1") && Object.prototype.hasOwnProperty.call(obj,"Current_DC_String_1")) {
            addObjectNotExists(adapter,"inverter." + id,'Power_DC_String_1',"DC Power of string 1",'number',"W",null,"","value")
        }
        if (Object.prototype.hasOwnProperty.call(obj,"Voltage_DC_String_2") && Object.prototype.hasOwnProperty.call(obj,"Current_DC_String_2")) {
            addObjectNotExists(adapter,"inverter." + id,'Power_DC_String_2',"DC Power of string 2",'number',"W",null,"","value")
        }
    }catch(ex){
        adapter.log.error("Error on createArchiveObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + JSON.stringify(obj))
    }
}

function createStorageObjects(adapter, id, obj) {
    try{
        adapter.log.silly("createStorageObjects: " + JSON.stringify(obj));
        adapter.setObjectNotExists('storage', {
            type: 'channel',
            common: {
                name: "Detailed information about Storage devices",
                role: "info"
            },
            native: {}
        });
        adapter.setObjectNotExists('storage.' + id, {
            type: 'channel',
            common: {
                name: "Storage with device ID " + id,
                role: "info"
            },
            native: {}
        });

        addObjectNotExists(adapter,"storage." + id,"Enable","Storage controller enabled","number","",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"StateOfCharge_Relative","Relative charging state of battery","number","%",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"Voltage_DC","Battery voltage","number","V",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"Current_DC","Battery current","number","A",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"Temperature_Cell","Battery cell temperature","number","°C",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"Voltage_DC_Maximum_Cell","Maximum cell voltage","number","V",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"Voltage_DC_Minimum_Cell","Minimum cell voltage","number","V",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"DesignedCapacity","Designed capacity of battery","number","Wh",obj.Controller,"","value");
        addObjectNotExists(adapter,"storage." + id,"Capacity_Maximum","Designed capacity of battery","number","Wh",obj.Controller,"","value");

        // now crate all states that are not predefined above
        setTimeout(function(obj,id){
            createStates(adapter,obj.Controller, "storage." + id);
            createStates(adapter,obj.Modules, "storage." + id + '.module');
        },1000,obj,id);
    }catch(ex){
        adapter.log.error("Error on createStorageObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + obj)
    }
}

function createMeterObjects(adapter, id, obj) {
    try{
        adapter.log.silly("createMeterObjects: " + JSON.stringify(obj));
        adapter.setObjectNotExists('meter', {
            type: 'channel',
            common: {
                name: "Detailed information about Meter devices",
                role: "info"
            },
            native: {}
        });
        adapter.setObjectNotExists('meter.' + id, {
            type: 'channel',
            common: {
                name: "Meter with device ID " + id,
                role: "info"
            },
            native: {}
        });

        addObjectNotExists(adapter,"meter." + id,"PowerReal_P_Sum","Actual power","number","W",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerReal_P_Phase_1","Actual power L1","number","W",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerReal_P_Phase_2","Actual power L2","number","W",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerReal_P_Phase_3","Actual power L3","number","W",obj,"","value");
        
        addObjectNotExists(adapter,"meter." + id,"PowerReactive_Q_Sum","Actual reactive power","number","VAr",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerReactive_Q_Phase_1","Actual reactive power L1","number","VAr",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerReactive_Q_Phase_2","Actual reactive power L2","number","VAr",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerReactive_Q_Phase_3","Actual reactive power L3","number","VAr",obj,"","value");

        addObjectNotExists(adapter,"meter." + id,"Current_AC_Sum","AC current sum","number","A",obj,"","value");
        
        addObjectNotExists(adapter,"meter." + id,"Voltage_AC_Phase_1","AC voltage L1","number","V",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"Current_AC_Phase_1","AC current L1","number","A",obj,"","value");

        addObjectNotExists(adapter,"meter." + id,"Voltage_AC_Phase_2","AC voltage L2","number","V",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"Current_AC_Phase_2","AC current L2","number","A",obj,"","value");
        
        addObjectNotExists(adapter,"meter." + id,"Voltage_AC_Phase_3","AC voltage L3","number","V",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"Current_AC_Phase_3","AC current L3","number","A",obj,"","value");
        
        addObjectNotExists(adapter,"meter." + id,"Voltage_AC_PhaseToPhase_12","AC voltage L1-L2","number","V",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"Voltage_AC_PhaseToPhase_23","AC voltage L2-L3","number","V",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"Voltage_AC_PhaseToPhase_31","AC voltage L3-L1","number","V",obj,"","value");

        addObjectNotExists(adapter,"meter." + id,"Frequency_Phase_Average","AC Frequency","number","Hz",obj,"","value");

        addObjectNotExists(adapter,"meter." + id,"PowerApparent_S_Sum","Actual apparent power","number","VA",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerApparent_S_Phase_1","Actual apparent power L1","number","VA",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerApparent_S_Phase_2","Actual apparent power L2","number","VA",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"PowerApparent_S_Phase_3","Actual apparent power L3","number","VA",obj,"","value");

        addObjectNotExists(adapter,"meter." + id,"EnergyReal_WAC_Sum_Produced","Produced energy total","number","Wh",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"EnergyReal_WAC_Sum_Consumed","Consumed energy total","number","Wh",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"EnergyReal_WAC_Plus_Absolute","Consumed energy from Grid","number","Wh",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"EnergyReal_WAC_Minus_Absolute","Produced energy feed to Grid","number","Wh",obj,"","value");

        addObjectNotExists(adapter,"meter." + id,"EnergyReactive_VArAC_Sum_Produced","Produced reactive energy","number","VArh",obj,"","value");
        addObjectNotExists(adapter,"meter." + id,"EnergyReactive_VArAC_Sum_Consumed","Consumed reactive energy","number","VArh",obj,"","value");

        // now crate all states that are not predefined above
        setTimeout(function(obj,id){
            createStates(adapter,obj, "meter." + id);
        },1000,obj,id);
    }catch(ex){
        adapter.log.error("Error on createMeterObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + obj)
    }
}

function createSensorNowObjects(adapter, id, obj) {
    try{
        adapter.log.silly("createSensorNowObjects: " + JSON.stringify(obj));
        adapter.setObjectNotExists('sensorcard', {
            type: 'channel',
            common: {
                name: "Detailed information about Sensorcard devices",
                role: "info"
            },
            native: {}
        });
        adapter.setObjectNotExists('sensorcard.' + id, {
            type: 'channel',
            common: {
                name: "Sensorcard with device ID " + id,
                role: "info"
            },
            native: {}
        });

        // now create all states that are not predefined above
        setTimeout(function(obj,id){
            createStates(adapter,obj, "sensorcard." + id);
        },1000,obj,id);
    }catch(ex){
        adapter.log.error("Error on createSensorNowObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + obj)
    }

}

function createSensorMinMaxObjects(adapter, id, obj) {
    try{
        adapter.log.silly("createSensorMinMaxObjects: " + JSON.stringify(obj));
        adapter.setObjectNotExists('sensorcard', {
            type: 'channel',
            common: {
                name: "Detailed information about Sensorcard devices",
                role: "info"
            },
            native: {}
        });
        adapter.setObjectNotExists('sensorcard.' + id, {
            type: 'channel',
            common: {
                name: "Sensorcard with device ID " + id,
                role: "info"
            },
            native: {}
        });

        // now create all states that are not predefined above
        setTimeout(function(obj,id){
            createStates(adapter,obj, "sensorcard." + id);
        },1000,obj,id);
    }catch(ex){
        adapter.log.error("Error on createSensorMinMaxObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + obj)
    }

}

function createPowerFlowObjects(adapter, obj, testId="") {
    try{
        for (var id in obj.Inverters){
            adapter.log.silly("createPowerFlowObjects for Inverter " + id + ", " + JSON.stringify(obj.Inverters[id]));
            addObjectNotExists(adapter,"inverter." + testId + id,"E_Day","Produced energy current day","number","Wh",obj.Inverters[id],"","value");
            addObjectNotExists(adapter,"inverter." + testId + id,"E_Year","Produced energy current year","number","Wh",obj.Inverters[id],"","value");
            addObjectNotExists(adapter,"inverter." + testId + id,"E_Total","Produced energy total","number","Wh",obj.Inverters[id],"","value");
            addObjectNotExists(adapter,"inverter." + testId + id,"P","Actual PV AC power","number","W",obj.Inverters[id],"","value");
            addObjectNotExists(adapter,"inverter." + testId + id,"SOC","Relative charging state of battery","number","%",obj.Inverters[id],"","value");
        }

        adapter.log.silly("createPowerFlowObjects for site: " + JSON.stringify(obj.Site));
        addObjectNotExists(adapter,"site."+ testId,"P_Grid","Actual grid power","number","W",obj.Site,"","value");
        addObjectNotExists(adapter,"site."+ testId,"P_Load","Actual load power","number","W",obj.Site,"","value");
        addObjectNotExists(adapter,"site."+ testId,"P_Akku","Actual akku power","number","W",obj.Site,"","value");
        addObjectNotExists(adapter,"site."+ testId,"P_PV","Actual PV power","number","W",obj.Site,"","value");

        addObjectNotExists(adapter,"site."+ testId,"E_Day","Produced energy current day","number","Wh",obj.Site,"","value");
        addObjectNotExists(adapter,"site."+ testId,"E_Year","Produced energy current year","number","Wh",obj.Site,"","value");
        addObjectNotExists(adapter,"site."+ testId,"E_Total","Produced energy total","number","Wh",obj.Site,"","value");

        addObjectNotExists(adapter,"site."+ testId,"rel_Autonomy","Relative PV autonomy","number","%",obj.Site,"","value");
        addObjectNotExists(adapter,"site."+ testId,"rel_SelfConsumption","Relative PV self consumption","number","%",obj.Site,"","value");

        // now crate all states that are not predefined above
        setTimeout(function(obj){
            createStates(adapter,obj.Site, "site."+ testId);
            createStates(adapter,obj.Inverters, "inverter."+ testId);
        },1000,obj);
    }catch(ex){
        adapter.log.error("Error on createPowerFlowObjects: " + ex);
        adapter.log.error("Supplied testId=" + testId + " and object=" + obj)
    }
}

function createInverterInfoObjects(adapter, obj, testId="") {
    try{
        adapter.log.silly("createInverterInfoObjects: " + JSON.stringify(obj));
        // loop over all inverters found
        for (var id in obj){
            adapter.log.silly("createInverterInfoObjects for id " + id + ", " + JSON.stringify(obj[id]));
            addObjectNotExists(adapter,"inverter."+ testId + id,"PVPower","PV peak power","number","W",obj[id],"","value");
        }

        // now create all states that are not predefined above
        setTimeout(function(obj){
            createStates(adapter,obj, "inverter."+ testId);
        },1000,obj);
    }catch(ex){
        adapter.log.error("Error on createInverterInfoObjects: " + ex);
        adapter.log.error("Supplied testId=" + testId + " and object=" + obj)
    }
}

function createInfoObjects(adapter, obj) {
    try{
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

        adapter.log.silly("createInfoObjects: " + JSON.stringify(obj));
        addObjectNotExists(adapter,"site","HWVersion","Hardware Version","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","SWVersion","Software Version","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","CO2Factor","CO2 Factor","number","",obj,"","meta")
        addObjectNotExists(adapter,"site","CO2Unit","CO2 Unit","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","CashFactor","Cash factor","number","",obj,"","meta")
        addObjectNotExists(adapter,"site","CashCurrency","Cash currency","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","DefaultLanguage","Default Language","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","DeliveryFactor","Delivery Factor","number","",obj,"","meta")
        addObjectNotExists(adapter,"site","PlatformID","Platform ID","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","ProductID","Product ID","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","TimezoneLocation","Timezone Location","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","TimezoneName","Timezone Name","string","",obj,"","meta")
        addObjectNotExists(adapter,"site","UTCOffset","UTC Offset [s]","number","",obj,"","meta")
        addObjectNotExists(adapter,"site","UniqueID","Unique ID","string","",obj,"","meta")

        // now create all states that are not predefined above
        setTimeout(function(obj){
            createStates(adapter,obj, "site");
        },1000,obj);
    }catch(ex){
        adapter.log.error("Error on createPowerFlowObjects: " + ex);
        adapter.log.error("Supplied object=" + obj)
    }
}


function createStringRealtimeObjects(adapter, id, obj) {
    try{
        adapter.log.silly("createStringRealtimeObjects: " + JSON.stringify(obj));

        // now create all states that are not predefined above
        setTimeout(function(obj,id){
            createStates(adapter,obj, "string." + id);
        },1000,obj,id);
    }catch(ex){
        adapter.log.error("Error on createStringRealtimeObjects: " + ex);
        adapter.log.error("Supplied ID=" + id + " and object=" + obj)
    }
}

function createOhmPilotObjects(adapter, obj) {
    try{
        adapter.log.silly("createOhmPilotObjects: " + JSON.stringify(obj));

        // now create all states that are not predefined above
        setTimeout(function(obj){
            createStates(adapter,obj, "ohmpilot");
        },1000,obj);
    }catch(ex){
        adapter.log.error("Error on createOhmPilotObjects: " + ex);
        adapter.log.error("Supplied object=" + obj)
    }
}

function createStates(adapter,apiObject,prefix=""){
    if(prefix != "" && prefix.endsWith('.') == false){ // make sure the path ends with a . if set
        prefix = prefix + '.';
    }
    if(Object.prototype.hasOwnProperty.call(apiObject,'Value') && Object.prototype.hasOwnProperty.call(apiObject,'Unit')){ // value + unit on first level -> special handling
        addObjectNotExists(adapter,prefix,'Value','','',apiObject.Unit,apiObject,'','');
        apiObject = Object.assign({},apiObject) // create a copy for further processing to not delete it from source object
        delete apiObject.Value;
        delete apiObject.Unit;
    }
    for (var key in apiObject){
        if(apiObject[key.toString()] === null){
            adapter.log.debug("API Objekt " + key.toString() + " is null, no object created!");
        }else if(typeof(apiObject[key.toString()]) == "object"){ // this is a nested object to parse!
            if(Object.prototype.hasOwnProperty.call(apiObject[key.toString()],'Value')){ // handling object with value and Unit below
                addObjectNotExists(adapter,prefix,key.toString(),'','','',apiObject,'','');
            }else{ // nested object to create -> recurse
                createStates(adapter,apiObject[key.toString()],prefix + key.toString())
            }
        }else{ // standard object to create
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
    }else if(Object.prototype.hasOwnProperty.call(apiObject, stateId)){
        if(apiObject[stateId] === null){
            adapter.log.debug("Property " + stateId + " is null. No object created!");
            return;
        }else if(apiObject[stateId] != null && typeof(apiObject[stateId]) == 'object'){
            if(Object.prototype.hasOwnProperty.call(apiObject[stateId],'Value') && apiObject[stateId]['Value'] === null){
                adapter.log.debug("Property " + stateId + " is null. No object created!");
                return;
            }else if(Object.prototype.hasOwnProperty.call(apiObject[stateId],'Value') && typeof(apiObject[stateId]['Value']) != 'object'){ // check if it is a object with Value/Unit pair and overwrite in this case the stateType and stateUnit
                sObj.common.type = typeof(apiObject[stateId]['Value']);               
            }
            if(Object.prototype.hasOwnProperty.call(apiObject[stateId],'Unit')){
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
exports.createPowerFlowObjects = createPowerFlowObjects;
exports.createInverterInfoObjects = createInverterInfoObjects;
exports.createInfoObjects = createInfoObjects;
exports.createStringRealtimeObjects = createStringRealtimeObjects;
exports.createOhmPilotObjects = createOhmPilotObjects