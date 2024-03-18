import { ChatOpenAI } from "@langchain/openai";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0, //0 is factual,  1 is creative
  maxTokens: 1000,
  verbose: true,
});

const response = await model.invoke("What is a wels catfish?");
console.log(response);

//const response = await model.stream("Write a poem about shoes.");
//await model.batch(["Hello, How are you?", "What is a shoe?"]) //multiple input and call
//await model.invoke("Hello"); //single input and call

//console.log(response);

// for await (const chunk of response) console.log(chunk);