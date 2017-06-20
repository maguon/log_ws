'use strict'

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarDAO.js');

function addCarTmp(params,callback){
    let query = " insert into car_info_tmp (upload_id,vin,make_id,route_start_id,route_end_id,receive_id,entrust_id,order_date) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.uploadId;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.entrustId;
    paramsArray[i]=params.orderDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarTmp ');
        return callback(error,rows);
    });
}

module.exports ={
    addCarTmp
}