module.exports = {
    secret: 'ilovescotchyscotch',
    frontHost: 'http://localhost:8081/',
    queues: {
        mailQueue: 'https://sqs.us-west-2.amazonaws.com/830871482639/TuProfeMailQueue',
        assignAdvisoryService: 'https://sqs.us-west-2.amazonaws.com/830871482639/TuProfeAssignAdvisoryService.fifo'
    },
    schedule: {
        startTimeLimit: {
            value: 600,
            string: '6:00 AM'
        },
        endTimeLimit: {
            value: 2200,
            string: '10:00 PM'
        }
    },
    geocoderOptions : {
        provider: 'google',
        //apiKey: 'AIzaSyAQTbAu7Gw9icagUzEEcEidNt9REtWQ1EU', 
        formatter: 'json'
    }
};
