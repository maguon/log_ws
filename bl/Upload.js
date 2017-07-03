'use strict'
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
            entrustId : params.entrustId
        }
        if(params.orderDate !=null && params.orderDate!=''){
            carObj.orderDate = params.orderDate;
        }
        return addCar(carObj);
    },(error)=>{
        msgObj.mcontent ={success:false,msg:error.message};
        ws.send(JSON.stringify(msgObj))
    }).then((result)=>{
        carRecordObj ={
            userId : params.userId,
            userType : carExtraObj.type || 99 ,
            username : carExtraObj.real_name || 'admin' ,
            content : '车辆信息批量录入系统 '+ params.uploadId,
            carId : result.insertId,
            vin : params.vin,
            op : 10
        }
        return addCarRecord(carRecordObj);
    },(error)=>{
        msgObj.mcontent ={success:false,msg:error.message};
        ws.send(JSON.stringify(msgObj))
    }).then((result)=>{
        logger.info(" uploadCar addCarRecord " + "success");
        msgObj.mcontent= {success:true};
    },(error)=>{
        logger.warn(" uploadCar addCarRecord " + "failed");
        msgObj.mcontent= {success:true};
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