'use strict'

const serverLogger = require('../util/ServerLogger.js');
const httpUtil =  require('../util/HttpUtil.js');
const sysConfig =  require('../config/SystemConfig.js');

const addRecord =(params,callback) => {
    var url = '/api/car/'+params.carId+'/vin/'+params.vin+"/record";
    httpUtil.httpPost(sysConfig.hosts.record,url,{},params,(error,result)=>{
        callback(error,result);
    })
}

module.exports ={
    addRecord
}