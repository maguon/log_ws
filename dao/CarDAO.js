'use strict'

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarDAO.js');

const  addCarTmp = (params,callback) =>{
    let query = " insert into car_info_tmp (user_id,upload_id,vin,make_id,route_start_id,base_addr_id,route_end_id,receive_id,entrust_id,order_date) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.entrustId;
    paramsArray[i]=params.orderDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarTmp ');
        return callback(error,rows);
    });
}

const addCar = (params,callback) => {
    let query = " insert into car_info (vin,user_id,upload_id,make_id,make_name,model_id,model_name," +
        " route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,entrust_id,order_date,colour,engine_num,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.orderDate;
    paramsArray[i++]=params.colour;
    paramsArray[i++]=params.engineNum;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCar ');
        return callback(error,rows);
    });
}

const queryCarExtraInfo = (params,callback) => {
    let propString = 'select ';
    let tableString = ' from ';
    let whereString =  ' where ' ;
    let paramsArray=[],i=0;

    propString = propString + " u.uid,u.type,u.real_name,u.mobile ";
    tableString = tableString + " user_info u " ;
    whereString = whereString + " u.uid = ?"
    paramsArray[i++] = params.userId;


    if(params.makeId){
        propString = propString + " ,cm.id,cm.make_name  as makeName";
        tableString = tableString + "  ,car_make cm " ;
        whereString = whereString + " and cm.id= ? "
        paramsArray[i++] = params.makeId;
    }
    if(params.routeStartId){
        propString = propString + " ,cs.id as routeStartId,cs.city_name  as routeStart  ";
        tableString = tableString + "  , city_info cs " ;
        whereString = whereString + " and cs.id=? "
        paramsArray[i++] = params.routeStartId;
    }
    if(params.routeEndId){
        propString = propString + " ,ce.id as routeEndId,ce.city_name  as routeEnd  ";
        tableString = tableString + "  , city_info ce " ;
        whereString = whereString + " and ce.id=? "
        paramsArray[i++] = params.routeEndId;
    }
    let queryString = propString + tableString + whereString;
    db.dbQuery(queryString,paramsArray,function(error,rows){
        logger.debug(' queryCarExtraInfo ');
        return callback(error,rows);
    });

}

module.exports ={
    addCarTmp ,addCar ,queryCarExtraInfo
}