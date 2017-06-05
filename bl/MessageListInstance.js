'use strict'

let messageList = {};



class Instance {
    get() {
        if(messageList == null){
            messageList = [];
        }
        return messageList;
    }

    add(msg){
        messageList.push(msg);
    }
    remove(msg){
        messageList.shift();
    }
}

module.exports = {Instance}