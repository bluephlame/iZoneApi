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

    getZoneTarget(zone){
        return this.getZoneData(zone,'SetPoint');
    }


    //state should be avalue from 16 to 30
    //on 30 set to open, all others set to climate control
    setZoneTarget(zone,state)
    {
        var data = {"ZoneCommand":{"ZoneNo":zone.toString(),"Command":state.toString()}};
        console.log(data);
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
    _getZoneData(zone,callback)
    {
        var method = 'Zones1_4';
        if(zone > 4) method = 'Zones5_8';

        return this._getaxios(method,function(response){
            var zoneObj = response.data.find(obj => {return obj.Index === (zone - 1);})
            return callback(zoneObj);
        });
    }

    getState()
    {
        return this._getaxios(`SystemSettings`,function(response){
            return response.data.SysOn;
        });
    }


}
module.exports = Api;