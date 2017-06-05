'use strict'

const msgEvent = 'event';
const msgSender = 'sender';
const msgReceiver = 'receiver';
const msgContent = 'content';

const socketEvent = {
    system : 0,
    connect : 1 ,
    quit : 2 ,
    speak : 3 ,
    broadcast : 4 ,
    clients : 5,
    error : 9
}

const msgType = {
    system : 0 ,
    close : 1 ,
    connect : 2 ,
    clients : 3 ,
    upload : 4 ,
    message : 9

}

const msgConnectContent = {
    _id : "userId",
    _name : "userName",
    _type : "userType"
}
const msgCloseContent = {
    _id : "userId",
    _name : "userName",
    _type : "userType"
}



const getSystemMsg = (msgContent) =>{
    let msgId = new Date().getTime();
    return {
        mid : msgId,
        mtype : msgType.system ,
        mcontent : {msg:msgContent}
    }
}

const getClientsMsg = (clientList) => {
    let msgId = new Date().getTime();
    return {
        mid : msgId,
        mtype : msgType.system ,
        mcontent : {clients:clientList}
    }
}

const getUploadMsg = (msgObj) =>{
    let msgId = new Date().getTime();
    return {
        mid : msgId,
        mtype : msgType.upload ,
        mcontent : {msg:msgObj}
    }
}





module.exports ={
    msgEvent , msgSender , msgReceiver , msgContent ,socketEvent ,
    msgType ,getSystemMsg , getClientsMsg
}