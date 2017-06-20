'use strict'
const sysMsg = require('../util/SystemMsg.js');
const listOfValue = require('../util/ListOfValue.js');
const carDAO = require('../dao/CarDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('Upload.js');

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

module.exports ={
    uploadCarTmp
}