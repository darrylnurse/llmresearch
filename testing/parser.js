import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import { StructuredOutputParser } from "langchain/output_parsers";

import {z} from 'zod';

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 1,
  verbose: true,
});

async function callStringOutputParser() {

  const prompt = ChatPromptTemplate.fromTemplate(
      "You are an informative, brilliant AI Assistant who is great at giving facts about countries." +
      "What is the {topic} of {country}?"
  );

  const parser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(parser);
  return await chain.invoke({
    topic: "Population",
    country: "China",
  });
}

async function callListOutputParser(){
  const prompt = ChatPromptTemplate.fromTemplate(
      "Give me five cities present in {country}, each separated by commas."
  );

  const chain = prompt.pipe(model).pipe(new CommaSeparatedListOutputParser());
  return await chain.invoke({
    country: "Uzbekistan",
  });
}

async function callStructuredParser(){
  const prompt = ChatPromptTemplate.fromTemplate(`
      Give me information about the following country.
      Formatting Instructions: {format}
      Country: {country}
  `);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    gdp: "GDP of the country",
    size: "Size of the country"
  });

  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    country: "Guyana",
    format: outputParser.getFormatInstructions(),
  })
}

async function callZodOutputParser(){
  const prompt = ChatPromptTemplate.fromTemplate(`
      Give me information about the following city.
      Formatting Instructions: {format}
      City: {city}
  `);

  const outputParser = StructuredOutputParser.fromZodSchema(
      z.object({
          "population": z.number().describe("amount of people in city"),
          "nearest": z.string().describe("nearest neighbouring city"),
          "knownFor": z.array(z.string()).describe("what city is known for"),
      })
  )

  const chain = prompt.pipe(model).pipe(outputParser);
  return await chain.invoke({
    city: "San Diego",
    format: outputParser.getFormatInstructions()
  })
}

const chinaFact = await callStringOutputParser();
const uzbekiFact = await callListOutputParser();
const guyanaInfo = await callStructuredParser();
const ontarioInto = await callZodOutputParser();

console.log(chinaFact);
console.log(uzbekiFact);
console.log(guyanaInfo);
console.log(ontarioInto);