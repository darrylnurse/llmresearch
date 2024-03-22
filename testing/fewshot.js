//Provide llm with example and then ask it to generate text following example

import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

import * as dotenv from "dotenv";
import {ChatOpenAI} from "@langchain/openai";
dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  temperature: 0.9,
  verbose: false,
});

const examples = [
  {
    input: "Where can I find the most delicious pizza?",
    output: "Gimme a good slice.",
  },
  {
    input: "Where is this classroom located?",
    output: "Help me find this room.",
  }
];

const examplePrompt = ChatPromptTemplate.fromTemplate(
    `Human: {input} AI: {output}`
);

const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  prefix: "Rephrase the users query to be incredibly rude, using the following examples",
  suffix: "Human: {input}",
  examplePrompt,
  examples,
  inputVariables: ["input"],
});

const formattedPrompt = await fewShotPrompt.format({
  input: "Good afternoon. Do you know where I might find the Q55 bus?",
});

const response = await model.invoke(formattedPrompt);
console.log(response.content)