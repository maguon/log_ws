'use strict'

let socketList = {};


class Instance {
    get() {
        if(socketList == null){
            socketList = {};
        }
        return socketList;
    }

    add(id,socket){
        socketList[id]= socket;
    }
    remove(id){
        delete socketList[id];
    }
}
module.exports = {Instance}