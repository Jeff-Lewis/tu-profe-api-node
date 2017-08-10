var Logger = require('le_node');
var Promise = require('promise');

var log = new Logger({token:process.env.LOG_ENTRIES});

var LogService = {};

LogService.log = (fileName, functionName, message, status, data) => {
    return new Promise((resolve,reject)=>{
        var logEntry = {
          fileName:fileName,
          functionName:functionName,
          message:message,
          status:status,
          data:data
        };
        logEntry = JSON.stringify(logEntry);
        switch (status) {
            case 'err':
                log.err(logEntry);
                break;
            default:
                log.info(logEntry);
                break;
        } 
        resolve();
    });
};

var getLogEntry = () => {
    return {
      fileName:"",
      functionName:"",
      message:"",
      status:"",
      data:{}
    };
}

module.exports = LogService;