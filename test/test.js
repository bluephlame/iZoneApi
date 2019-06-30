'use strict';
var api = require('../izone.js');
var expect = require('chai').expect;

describe('Air Con Data', function() {
    var client = new api("http://192.168.178.132/");

    it('should get zone 1 temp', function() {
        return client.getZoneTemp(1).then(response => {
            console.log(`TEMP1: ${response}`);
           expect(response).to.be.a('number');
        });
    });

    it('should ge zone 2 temp',function(){
        return client.getZoneTemp(2).then(response =>{
            console.log(`TEMP2: ${response}`);
            expect(response).to.be.a('number'); 
        });
    })

    it('should ge zone 3 temp',function(){
        return client.getZoneTemp(3).then(response =>{
            console.log(`TEMP3: ${response}`);
            expect(response).to.be.a('number');
        });
    })

    it('should ge zone 4 temp',function(){
        return client.getZoneTemp(4).then(response =>{
            console.log(`TEMP4: ${response}`);
            expect(response).to.be.a('number');
        });
    })

    it('should ge zone 5 temp',function(){
        return client.getZoneTemp(5).then(response =>{
            console.log(`TEMP5: ${response}`);
            expect(response).to.be.a('number');
        });
    })

    it('should get aircon status',function(){
        return client.getState().then(response=>{
            console.log(`AirCon State ${response}`);
            expect(response).to.satisfy(state => {
                return state == 'on' || state == 'off'
            })
        })
    })

    it('should change zone status',function(){
        return client.setZoneTarget(2,"23").then(response=>{
            expect(response.status).to.equal(200);
        })
    })

    it('should get zone status',function(){
        return client.getZoneTarget(4).then( response => {
            console.log(`Zone is ${response}`);
            expect(response).to.be.a('number');
        })
    });

    //  it('should toggle the A/C',function(done){

    //    return client.getState().then(response =>{
    //         var initial = response;
    //         client.toggle().then( response =>{
    //             client.getState().then(response =>{
    //                 expect(response).to.not.equal(initial);
    //             })
    //         })
    //     })
    // })

    // it('should set the A/C off',function(){
    //    return client.setOff().then( response =>{
    //         client.getState().then(response =>{
    //             console.log(`AirCon State ${response}`);
    //             expect(response).to.equal('off');
    //         })
    //     });
    // })
});