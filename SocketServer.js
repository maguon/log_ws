'use strict'

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 9005 });
const socketUtil = require('./util/SocketUtil.js');
const socketValue = require('./util/SocketValue.js');
const socketMsg = require('./util/SocketMsg.js');
const serverLogger = require('./util/ServerLogger.js');
const logger = serverLogger.createLogger('SocketServer.js');
const SocketListInstance = require('./bl/SocketListInstance.js');
const MessageListInstance = require('./bl/MessageListInstance.js');
const UserListInstance = require('./bl/UserListInstance.js');
const carDAO = require('./dao/CarDAO.js');
const upload = require('./bl/Upload.js');
const socketList =  new SocketListInstance.Instance();
const msgList = new MessageListInstance.Instance();
const userList = new UserListInstance.Instance();

let wsMap = {};

const parseMsgContent = (msg) => {
    const msgObj = socketUtil.msgToJson(msg)
    if(msgObj==null || msgObj.mcontent == null){
        return null;
    }else {
        return msgObj.mcontent;
    }
}

const saveSocket = (msg,socket) => {
    var msgContentObj = parseMsgContent(msg);
    if(msgContentObj == null){
        return;
    }else{
        const id = msgContentObj.id;
        const sid = id+"_"+new Date().getTime();

        //disconnect old socket ,to keep single user-socket mapper
        disconnectUserSocket(id);
        let user ={
            sid:sid,
            name:msgContentObj.name,
            type:msgContentObj.type
        }
        socketList.add(sid,socket);
        userList.add(id,user);

        sendMsg(socket,socketValue.getSystemMsg(socketMsg.WS_MSG_CONNECT));
    }
}

const removeSocket = (msg) =>{
    var msgContentObj = parseMsgContent(msg);
    if(msgContentObj == null){
        return;
    }else{
        const id = msgContentObj.id;

        const user = userList.get()[id];
        userList.remove(id);
        if(user && user.sid){
            socketList.remove(user.sid);
        }
    }
}

const disconnectUserSocket = (userId) => {
    let user = userList.get()[userId];
    if(user == null){
        return;
    }
    if(user && user.sid){
        let socket = socketList.get()[user.sid];
        let msg = socketValue.getSystemMsg(socketMsg.WS_MSG_SINGLE);
        sendMsg(socket,msg);
        socketList.remove(user.sid);
        socket.close()

    }
}

const getSocketInfo = (socket ,socketList) => {
    let socketInfo = null;
    for(let socketItem in socketList){
        if(socketList[socketItem]== socket){
            socketInfo = socketItem;
            break;
        }
    }
    return socketInfo;
}

const doUserQuit = (socket) => {
    let socketInfo = getSocketInfo(socket,socketList.get())
    if(socketInfo != null){
        const userId = socketInfo.split('_')[0];
        logger.info(userId +" disconnect with server !");
        userList.remove(userId);
        socketList.remove(socketInfo.split('_')[0])

    }
}

const sendMsg = (socket,msg) =>{
    let msgStr = socketUtil.jsonToMsg(msg);
    if(msgStr && msgStr.length>0 && socket.readyState == 1){

        socket.send(msgStr);
    }

}

const sendClients = (socket) => {
    let clientMsg = socketValue.getClientsMsg();
    clientMsg.mcontent.clients = userList.get();
    sendMsg(socket,clientMsg);
}


const broadcastClients = ()=>{
    wss.clients.forEach(function each(client) {
        sendClients(client);
    });
}

const doSpeak = (msgObj)=>{
    if(msgObj[socketValue.msgReceiver]){
        let ws = getWs(msgObj[socketValue.msgReceiver]);
        ws.send(socketUtil.jsonToMsg(msgObj));
    }else{
        return;
    }
}

const doBroadcast = (msgObj) => {
    let msg = socketUtil.jsonToMsg(msgObj)
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
}

const doSendClients = ()=>{
    let msg = {};
    msg[socketValue.msgEvent] = socketValue.socketEvent.clients;
    msg[socketValue.msgContent] = getWsArray().join(',');
    let msgString = socketUtil.jsonToMsg(msg)
    wss.clients.forEach(function each(client) {
        client.send(msgString);
    });
}

const doQuit = (key)=>{
    removeWs(key);
    let msg ={};
    msg[socketValue.msgEvent] = socketValue.socketEvent.quit;
    msg[socketValue.msgContent] = key + socketMsg.WS_MSG_QUIT;
    doBroadcast(msg);
}
const forceQuitEvent = (socket) =>{
    for(let i in s){
        if(wsMap[i]==ws){
            logger.info(i +" force quit .") ;
            delete wsMap[i];
            var msg ={};
            msg[socketValue.msgEvent] = socketValue.socketEvent.quit;
            msg[socketValue.msgContent] = i + socketMsg.WS_MSG_QUIT;
            doBroadcast(msg);
            doSendClients();
            break;
        }
    }
}
const dispatcher = (msg,ws) =>{

    let msgObj = socketUtil.msgToJson(msg);
    if(msgObj){
        if(msgObj.mtype == socketValue.msgType.connect){
            saveSocket(msg,ws);
            broadcastClients();
            return;
        }
        if(msgObj.mtype == socketValue.msgType.close){
            removeSocket(msg,ws);
            broadcastClients();
            return;
        }
        if(msgObj.mtype == socketValue.msgType.upload){
            console.log(msgObj.mcontent);
            upload.uploadCarTmp(ws,msgObj);
            return;
        }
    }else{
        logger.warn("message format error");
        return;
    }
}


wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        console.log(message)
        logger.debug("Message:"+message);
        //process user new socket connections
        dispatcher(message,ws);
        //broadcast clients


    });
    ws.on('close',function(e){
        //process user socket disconnection
        console.log(e)
        doUserQuit(ws);
        broadcastClients();
        //broadcast clients
        logger.info("A client has force quit;");
    });
});

console.log('ws server start at :'+ new Date().toLocaleString())