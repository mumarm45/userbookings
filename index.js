var AWS = require("aws-sdk");
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Pragma, Cache-Control');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, HEAD, DELETE');
    next();
});
var docClient = new AWS.DynamoDB.DocumentClient({
    accessKeyId: 'AKIAU5TEN7EVDEUF7N4T',
    region: "ap-south-1",
    secretAccessKey: '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',

});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}
app.get('/users/:id/bookings', (req, res) => {
    var params = {
        TableName: "users",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": `${req.params.id}` }
    }

    const promise = new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
            if (err) {
                reject("Unable to query. Error:" + JSON.stringify(err, null, 2))
            } else {
                resolve(data.Items);
            }
        });
    });
    promise.then((success) => {
        res.send(success);
    }, (error) => {
        handleError(error);
    })
});


var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});