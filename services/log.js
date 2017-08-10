var Logger = require('le_node');
var Promise = require('promise');

var LogService = {};

var LogServiceConstructor = (logEntriesToken) => {
    
    if(logEntriesToken){
        LogService.logger = new Logger({token:logEntriesToken});
    }else{
        LogService.logger = new Logger({token:process.env.LOG_ENTRIES});
    }
    return LogService;
}

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
                LogService.logger.err(logEntry);
                break;
            default:
                LogService.logger.info(logEntry);
                break;
        } 
        resolve();
    });
};

module.exports = LogServiceConstructor;