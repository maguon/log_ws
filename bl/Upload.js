'use strict'
const moment = require('moment')
const listOfValue = require('../util/ListOfValue.js');
const carDAO = require('../dao/CarDAO.js');
const sysRecordDAO = require('../dao/SysRecordDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('Upload.js');
const Promise = require('promise');

const uploadCarTmp = (ws,msgObj)=>{
    let params = msgObj.mcontent;

    carDAO.addCarTmp(params,(error,result)=>{
        if(error){
            logger.error(" uploadCarTmp " + error.stack);
            msgObj.mcontent ={success:false,msg:error.message};
        }else{
            if(result && result.insertId>0){
                logger.info(" uploadCarTmp " + "success");
                msgObj.mcontent= {success:true};
            }else{
                logger.info(" uploadCarTmp " + "failed");
                msgObj.mcontent ={success:false,msg:"Internal Error"};
            }

        }
        ws.send(JSON.stringify(msgObj))
    })
};


const uploadCar = (ws,msgObj)=>{
    let params = msgObj.mcontent;
    let carExtraObj = {};
    let carRecordObj = {};

    const getCarExtra = () =>{
        return new Promise((resolve,reject)=>{
            carDAO.queryCarExtraInfo(params,(error,result)=>{
                if(error){
                    reject(error);
                }else{
                    if(result && result.length==1){
                        carExtraObj = result[0]
                        resolve(result[0]);
                    }else{
                        reject({message:'数据错误'});
                    }
                }
            })
        })
    }

    const addCar = (carObj) => {
        return new Promise((resolve,reject)=>{
            carDAO.addCar(carObj,(error,result)=>{
                if(error){
                    if(error.errno =1062){
                        reject({message:'车辆vin码重复'});
                    }else{
                        reject(error);
                    }

                }else{
                    if(result && result.insertId>0){

                        resolve(result);
                    }else{
                        reject({message:'数据错误'})
                    }

                }
            })
        })
    }

    const addCarRecord = (recordObj)=>{
        return new Promise((resolve,reject)=>{
            sysRecordDAO.addRecord(recordObj,(error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    }

    getCarExtra().then((carExtra)=>{
        let carObj = {
            vin : params.vin,
            userId : params.userId,
            uploadId : params.uploadId,
            makeId : params.makeId,
            makeName : carExtra.makeName,
            routeStartId : params.routeStartId,
            routeStart : carExtra.routeStart,
            baseAddrId : params.baseAddrId,
            routeEndId : params.routeEndId,
            routeEnd : carExtra.routeEnd,
            receiveId : params.receiveId,
            entrustId : params.entrustId,
            shipName : params.shipName,
            companyId : params.companyId,
            qaLevel : params.qaLevel
        }
        if(params.orderDate !=null && params.orderDate!=''){
            carObj.orderDate = params.orderDate;
            carObj.orderDateId = parseInt(moment(params.orderDate).format('YYYYMMDD'));
        }
        return addCar(carObj);
    },(error)=>{
        msgObj.mcontent ={success:false,msg:error.message};
        return{success:false,msg:error.message};
    }).then((result)=>{
        if(result.insertId > 0){
            carRecordObj ={
                userId : params.userId,
                userType : carExtraObj.type || 99 ,
                username : carExtraObj.real_name || 'admin' ,
                content : '车辆信息批量录入系统 '+ params.uploadId,
                carId : result.insertId,
                vin : params.vin,
                op : 1
            }
            return addCarRecord(carRecordObj);
        }else{
            return result;
        }

    },(error)=>{
        msgObj.mcontent ={success:false,msg:error.message};
        logger.error('uploadCar addCarRecord' + error.stack);
        return {success:false,msg:error.message};
    }).then((result)=>{
        if(result&&result.insertId>0){
            logger.info(" uploadCar addCarRecord " + "success");
            msgObj.mcontent= {success:true};

        }else{
            msgObj.mcontent = result;
        }
        return ws.send(JSON.stringify(msgObj))
    },(error)=>{
        logger.warn(" uploadCar addCarRecord " + "failed");
        msgObj.mcontent= {success:true};
        return ws.send(JSON.stringify(msgObj))
    })

    /*carDAO.addCarTmp(params,(error,result)=>{
        if(error){
            logger.error(" uploadCarTmp " + error.stack);
            msgObj.mcontent ={success:false,msg:error.message};
        }else{
            if(result && result.insertId>0){
                logger.info(" uploadCarTmp " + "success");
                msgObj.mcontent= {success:true};
            }else{
                logger.info(" uploadCarTmp " + "failed");
                msgObj.mcontent ={success:false,msg:"Internal Error"};
            }

        }
        ws.send(JSON.stringify(msgObj))
    })*/
};

module.exports ={
    uploadCarTmp ,uploadCar
}