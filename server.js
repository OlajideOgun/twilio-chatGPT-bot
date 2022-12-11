require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const twilio = require('twilio')
const logger = require('./logger');
const pinoHTTP = require('pino-http');

const { MessagingResponse } = require('twilio').twiml;
const ChatGPT = require('./src/chatGPT');
const OpenAI = require('./src/openAI');


//set up twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
const chatGPT = new ChatGPT();
chatGPT.createBrowser();
const openAI = new OpenAI();
// app.use(
//   pinoHTTP({
//     logger,
//   })
// );






// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonEncoder = bodyParser.json();

const splitMessage = (message) => {
  const messageArray = [];
  let messageString = "";
  let messageLength = 0;
  message.split(" ").forEach(word => {
    if (messageLength + word.length < 1600) {
      messageString += word + " ";
      messageLength += word.length;
    } else {
      messageArray.push(messageString);
      messageString = word + " ";
      messageLength = word.length;
    }
  });
  messageArray.push(messageString);
  return messageArray;
}



app.post('/sms', urlencodedParser, async (req, res) => {
  
  const textMessageBody = req.body.Body;
  const userPhoneNumber = req.body.From;
  logger.info(`Received SMS from: ${userPhoneNumber}`);
  logger.info(`Text message: ${textMessageBody}`);

  const twiml = new MessagingResponse();
  
  
  try {

    if(textMessageBody.toLowerCase() === "new convo" || textMessageBody.toLowerCase() === "new conversation")
    {
      twiml.message('Resetting ur convo...');
      res.status(200).type('text/xml').send(twiml.toString());
      await chatGPT.resetConversation(userPhoneNumber);
    }
    else {

      twiml.message('I am thinking...');
      res.status(200).type('text/xml').send(twiml.toString());    

      const chatGPTResponse = await chatGPT.getChatGPTResponse(userPhoneNumber, textMessageBody);
      

      if (chatGPTResponse.length > 1600) {

        splitMessage(chatGPTResponse).forEach(message => {
          client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.From
          });
        });

      }
      else {

        client.messages.create({
          body: chatGPTResponse,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: req.body.From
        });
      }
    }
  }
  catch (error) {
    // Handle the error here

    logger.customError(error);

    // npm package to generate punchline jokes
    client.messages.create({
      body: "Sorry we hit an error. Please try again later. :(",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.From
    });
    // res.status(500).send({ error: "An error occurred" });
    }
});

app.post('/error', urlencodedParser, async (req, res) => {
  try {

    logger.info("Received error");
    const errorBody = JSON.parse(JSON.stringify(req.body));

    const payload = JSON.stringify(JSON.parse(errorBody.Payload), null, 2);
    logger.customError(`Error payload: ${payload}`);


  } catch (err) {
    // Handle the error here
    logger.customError(`Error ${err}`);
    // res.status(500).send({ error: "An error occurred" });
  }
});


app.listen(1337, () => {

    logger.info('Express server listening on port 1337');
    logger.info('Press Ctrl+C to quit.');

});

    // message.body(chatGPTResponse.toString());

    // const twiml = new MessagingResponse();
    // const message = twiml.message();

  // logger.info(chatGPTResponse.toString());
  // message.body('The Robots are coming! Head for the hills!');
  // logger.info(twiml.toString());
  // logger.info(req);
  // const imageURI = await openAI.codeGeneration(textMessageBody);

  // message.body('Heres ur image');
  // message.media(imageURI);

  // res.type('text/xml').send(twiml.toString());