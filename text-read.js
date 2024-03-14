import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

import * as dotenv from "dotenv";
dotenv.config();

const loader = new TextLoader("texts/test.txt");
const text = await loader.load();

const vectorStore = await MemoryVectorStore.fromDocuments(
    text,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPEN_API_KEY,
    })
);

const resultOne = await vectorStore.similaritySearch("Zimbabwe", 1);

console.log(resultOne);
