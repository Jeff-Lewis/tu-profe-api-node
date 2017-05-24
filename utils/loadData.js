var AWS = require("aws-sdk");
var uuidV4 = require('uuid/v4');
var data = [{"advisoryServiceType":1,"config":{"L":-127.2,"M":14501,"N":-416.93,"O":5639.2,"D":0.8,"G":1.04}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":1,"config":{"L":0,"M":0,"A":17490,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":2,"config":{"L":0,"M":0,"A":25440,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":3,"config":{"L":0,"M":0,"A":33390,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":4,"config":{"L":0,"M":0,"A":41340,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":1,"config":{"L":0,"M":0,"A":16366.2530739996,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":2,"config":{"L":-89.204,"M":6777.3,"A":16366.2530739996,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":3,"config":{"L":-162.7,"M":12723.9,"A":16366.2530739996,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":4,"config":{"L":-220.488,"M":17721.3,"A":16366.2530739996,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":1,"config":{"L":0,"M":0,"A":21465,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":2,"config":{"L":0,"M":0,"A":29415,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":3,"config":{"L":0,"M":0,"A":37365,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":4,"config":{"L":0,"M":0,"A":45315,"C":0,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":1,"config":{"L":0,"M":0,"A":20335.6248602728,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":2,"config":{"L":-89.204,"M":6836.5,"A":20335.6248602728,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":3,"config":{"L":-162.7,"M":12723.9,"A":20335.6248602728,"C":209.823757358969,"D":0.7,"G":1.06}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":4,"config":{"L":-220.488,"M":17721.3,"A":20335.6248602728,"C":209.823757358969,"D":0.7,"G":1.06}}]

AWS.config.update({
  region: "us-west-2",
  endpoint: "dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();
    data.forEach(item=>{
        item.id = uuidV4();
        item.config = JSON.stringify(item.config);
        var params = {
            TableName:'CostConfig',
            Item:item
        };
    
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
});
