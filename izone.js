const axios = require('axios');
 
class Api{

    constructor(url)
    {
        this.url = url;
    }

    _getaxios(method,response)
    {
        return axios.get(`${this.url}${method}`)
            .then(response)
            .catch(error =>{
                console.log(`REQUEST ERROR :${error}`);
            });
    }

    _postaxios(method,data,response=null)
    {
        return axios.post(`${this.url}${method}`,data)
        .then(response)
        .catch(error =>{
            console.log(`REQUEST ERROR :${error}`);
        });;
    }

    setOn(){
        return this._postaxios('SystemON',{"SystemOn":"on"});
    }

    setOff(){
        return this._postaxios('SystemON',{"SystemOn":"off"});
    }

    toggle(){
        return this.getState().then(response=>{
            if(response == 'on') this.setOff();
            else this.setOn();
        })
    }

    getDuctTemp(){
        return this._getMasterData((data) =>{
            return data.Supply;
        })
    }

    getACTarget(){
        return this._getMasterData((data) =>{
            return data.Setpoint;
        })
    }

    //sets the temperature the AC Will aim for
    setACTarget(state)
    {
        var data = {"UnitSetpoint":state.toString()};
        return this._postaxios('UnitSetpoint',data);
    }


    getZoneTarget(zone){
        var temperature = this.getZoneData(zone,'SetPoint');
        var state = this.getZoneData(zone,'Mode'); //open,close,auto
        if(state == 'auto')
            return temperature;
        else
            return state;
    }

    getZoneTargetTemperature(zone){
        return this.getZoneData(zone,'SetPoint');
    }

    //state should be avalue from 16 to 30
    //on 30 set to open, all others set to climate control
    setZoneTarget(zone,state)
    {
        var data = {"ZoneCommand":{"ZoneNo":zone.toString(),"Command":state.toString()}};
        //console.log(data);
        return this._postaxios('ZoneCommand',data);
    }

    getZoneData(zone,data){
        return this._getZoneData(zone,function(zoneObj){
            var Data = zoneObj[data];
            return Data;
        })
    }

    getZoneTemp(zone)
    {
        return this._getZoneData(zone,function(zoneObj){
            var Temp =  zoneObj.Temp;
            return Temp;
        });
    }

    setZoneState(zone,state){

    }

    async _getZoneData(zone,callback)
    {
        // console.log(`Getting Zone Data for ${zone}`);
        var method = 'Zones1_4';
        if(zone > 3) method = 'Zones5_8';
        var response = await this._getaxios(method);
        var zoneObj = response.data.find(obj => {return obj.Index === (zone);})
        return callback(zoneObj);
    }
    _getMasterData(callback){
        var method = 'SystemSettings';
        return this._getaxios(method,function(response){
            return callback(response.data);
        });
    }

    async getActiveZones()
    {
        try{
        var active_zones = [];
        for (let index = 0; index < 8; index++) {
            await this._getZoneData(index,function(object){
                if(object.Type != "opcl")
                {
                  active_zones.push(object);
                }
            });
        }
        return active_zones;
        }
        catch(error){
            console.log(error);
        }
    }

    getState()
    {
        return this._getaxios(`SystemSettings`,function(response){
            return response.data.SysOn;
        });
    }

    async getHeaterCoolerState()
    {
        try{
        var data = await this._getaxios(`SystemSettings`);
        if (data.SysOn)
        {
            return data.SysMode //returning heat, cool, dry,vent,auto
        }
        return data.SysOn; //is returning off
        }catch (err)
        {
            console.log(`ERROR: getHeaterCoolerState: ${err}`);
            console.log(err);
        }
    }

    async setSystemMode(mode){
        var data = {"SystemMODE":mode};
        return this._postaxios('SystemMODE',data);
    }
}
module.exports = Api;