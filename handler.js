'use strict';

var AWS = require('aws-sdk');

async function enviar_sms(message,phone) {
          AWS.config.update({ region: 'us-east-1' });
          // Create publish parameters
          var params = {
            Message: message, /* required */
            PhoneNumber: `+051${phone}`,
          };
          console.log(params);
          // Create promise and SNS service object
          var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

          // handle promise's fulfilled/rejected states
          await publishTextPromise.then(
            function (data) {
              console.log("MessageID is " + data.MessageId);
            }).catch(
              function (err) {
                console.error(err, err.stack);
                throw new Error('error en el servidor');
              });
}


module.exports.hello = async (event, context) => {

  let body_params = JSON.parse(event.body);

  let statusCode_number=200;
  let message_txt='Ok';

  try{
    await enviar_sms(body_params.message,body_params.number);
  }catch(error){
    statusCode_number=500;
     message_txt='error en el servidor';
  }
  
  return {
    statusCode:statusCode_number,
    body: JSON.stringify({
      message:message_txt,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
