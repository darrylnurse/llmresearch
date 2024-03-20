import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

// import * as dotenv from "dotenv";
// dotenv.config();

const text = "Hello.\nThis is Darryl. \nI am testing a text splitter.\n\nLet me know if it works.";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 20,
  chunkOverlap: 10,
})

const output = await splitter.createDocuments([text]);
console.log(output);
