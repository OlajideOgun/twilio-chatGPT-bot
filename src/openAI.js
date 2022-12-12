import { Configuration, OpenAIApi } from "openai";
import logger from '../logger.js';


export default class openAI {
    constructor() {
        // logger.info(process.env.OPENAI_API_KEY)
        this.configuration = new Configuration({apiKey: process.env.OPENAI_API_KEY});
        this.openai = new OpenAIApi(this.configuration);
        
    }
  
    async textCompletion() {

        return await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Write a poem",
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
     
    }

    async codeGeneration(textMessageBody) {

        const response = await this.openai.createImage({
            prompt: textMessageBody,
            n: 1,
            size: "1024x1024",
          });
        logger.info(response.data);
        const image_url = response.data.data[0].url;
        return image_url;
        
    }
}