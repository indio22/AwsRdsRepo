'use strict';

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
  create: async(event, context) => {
    let bodyObj = {};
    try {
      bodyObj = JSON.parse(event.body)
    }
    catch (jsonerror) {
        console.log('Hey there was an error: ', jsonerror)
        return {
          statusCode: 400
        }
    }
  }
};

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

