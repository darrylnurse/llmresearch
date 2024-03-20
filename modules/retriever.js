import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";

import {Document} from "@langchain/core/documents";

import {createStuffDocumentsChain} from "langchain/chains/combine_documents";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 1,
  verbose: true,
});

const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question correctly.  
    Context: {context}
    Question: {input}
`);

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
})

const doc1 = new Document({
  pageContent: "LCEL is a declarative way to compose chains. LCEL was designed from day 1 to support putting prototypes in production, with no code changes, from the simplest “prompt + LLM” chain to the most complex chains.",
})

const response = await chain.invoke({
  input: "What is LCEL?",
  context: [doc1],
});
console.log(response);