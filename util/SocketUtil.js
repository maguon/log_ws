/**
 * Created by lingxue on 2016/12/28.
 */

const msgToJson = (message) => {
    try {
        return JSON.parse(message);
    } catch(error) {
        console.log('method:msgToJson,error:' + error);
        return null;
    }
}

const jsonToMsg = (obj)=>{
    return JSON.stringify(obj);
}

module.exports ={
    msgToJson ,
    jsonToMsg
}