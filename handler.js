'use strict';
const AWS = require('aws-sdk');
// module.exports.hello = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

// event is populated by the event that triggers the object.  In this case from the yml file, an http event
// so it will have body and other stuff as an http even has?
module.exports = {
  create: async (event, context) => {
    // This will hold the body of the event.
    console.log('Entering the create function, to add a new transmission to the DB.')
    let bodyObj = {};
    try {
      bodyObj = JSON.parse(event.body)
    }
    // Maybe the event info was wrong.
    catch (jsonerror) {
      console.log('Event message sent to lambda was unacceptable, might not have been http event ', jsonerror)
      return {
        statusCode: 400
      }
    }

    // Maybe there was no name param or it was empty?
    if (typeof bodyObj.name == 'undefined') {
      console.log('The name of the transmisson was not supplied to the lambda.')
      return {
        statusCode: 400
      }
    }

    // Create the parameter object that gets sent to the DB.
    // And these params such as TableName and Item are required by the aws-sdk.
    // This is the syntax required by the 
    let putParams = {
      TableName: process.env.DB_TRANSMISSION_TABLE,
      Item: {
        name: bodyObj.name,
        make: bodyObj.make,
        type: bodyObj.type
      }
    }
    console.log('Here is the putParams, that will be posted to save new transmission to DB: ', putParams)

    // This is where we create the new DB connection object, and execute the put
    // to write the record (using data from the event body params, to the database.)
    let putResult = {};
    try {
      let rdsdb = new AWS.DynamoDB.DocumentClient();
      putResult = await rdsdb.put(putParams).promise();
    }
    // In case there was an error executing the put.
    catch (putError) {
      console.log('There was an error putting the transmission data to the DB.');
      console.log('Here are the parameters that were sent to the DB: ', putParams);
      return {
        statusCode: 500
      }
    }

    // Return 201 to the user if everything was a success and the put worked.
    return {
      statusCode: 201
    }
  },

  list: async (event, context) => {
    console.log('Entering the returnTransmission function.')
    let scanParams = {
      TableName: process.env.DB_TRANSMISSION_TABLE
    }

    let scanResult = {}
    try {
      let rdsdb = new AWS.DynamoDB.DocumentClient();
      console.log('About to run the scan of dynamo transmissionTableSlsAlt table');
      scanResult = await rdsdb.scan(scanParams).promise();
    }
    catch (scanError) {
      console.log('There was an error scanning the transmission table.');
      console.log('Here are the scan parameters that were sent to the DB: ', scanParams);
      return {
        statusCode: 500
      }
    }

    if ((scanResult.Items == null) ||
      !Array.isArray(scanResult) ||
      scanResult.Items.length == 0) {
      return {
        statusCode: 404
      }
    }

    console.log('This means handler function for list got to the point just before it will stringify returned data.');
    return {
      statusCode: 200,
      body: JSON.stringify(scanResult.Items.map(transmission => {
        return {
          name: transmission.name,
          make: transmission.make
        }
      }))
    }
  }
};

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

