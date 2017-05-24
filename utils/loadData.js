var AWS = require("aws-sdk");
var uuidV4 = require('uuid/v4');
var data = [{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":1,"config":{"L":0,"M":0,"A":17490}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":2,"config":{"L":0,"M":0,"A":25440}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":3,"config":{"L":0,"M":0,"A":33390}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Regular","numStudents":4,"config":{"L":0,"M":0,"A":41340}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":1,"config":{"L":0,"M":0,"A":16366.2530739996}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":2,"config":{"L":-89.204,"M":6777.3,"A":16366.2530739996}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":3,"config":{"L":-162.7,"M":12723.9,"A":16366.2530739996}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Regular","numStudents":4,"config":{"L":-220.488,"M":17721.3,"A":16366.2530739996}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":1,"config":{"L":0,"M":0,"A":21465}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":2,"config":{"L":0,"M":0,"A":29415}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":3,"config":{"L":0,"M":0,"A":37365}},{"greaterThanLimit":0,"advisoryServiceType":2,"courseType":"Especializado","numStudents":4,"config":{"L":0,"M":0,"A":45315}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":1,"config":{"L":0,"M":0,"A":20335.6248602728}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":2,"config":{"L":-89.204,"M":6836.5,"A":20335.6248602728}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":3,"config":{"L":-162.7,"M":12723.9,"A":20335.6248602728}},{"greaterThanLimit":1,"advisoryServiceType":2,"courseType":"Especializado","numStudents":4,"config":{"L":-220.488,"M":17721.3,"A":20335.6248602728}}]

AWS.config.update({
  region: "us-west-2",
  endpoint: "dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();
    data.forEach(item=>{
        item.id = uuidV4();
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
