'use strict'

let userList = {};


class Instance {
    get() {
        if(userList == null){
            userList = {};
        }
        return userList;
    }

    add(id,info){
        userList[id]= info;
    }
    remove(id){
        delete userList[id];
    }
}
module.exports = {Instance}