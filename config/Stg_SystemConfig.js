

const mysqlConnectOptions ={
    user: 'log',
    password: 'log_base',
    database:'log_base',
    host: '47.93.121.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: [
        { type: 'console' },
        {
            "type": "file",
            "filename": "../logs/log_ws.log",
            "maxLogSize": 2048000,
            "backups": 10
        }
    ]
}
const hosts = {
    record : {host:"stg.myxxjs.com",port:9004},
    auth : {host:"localhost",port:9009}
}

module.exports = { mysqlConnectOptions ,loggerConfig, logLevel ,hosts  }
