/**
 * Created by lingxue on 2016/12/28.
 */
const WS_MSG_CONNECT = {msg:"欢迎连接到WS ",status:"1"};
const WS_MSG_DISCONNECT = "你选择断开连接" ;
const WS_MSG_SINGLE = {msg:"你已经在别的设备上登录了",status:0};
const WS_MSG_ADD = " 与服务器建立了连接";
const WS_MSG_QUIT = " 与服务器断开连接";

module.exports ={
    WS_MSG_CONNECT ,
    WS_MSG_DISCONNECT,
    WS_MSG_QUIT,
    WS_MSG_SINGLE ,
    WS_MSG_ADD
}