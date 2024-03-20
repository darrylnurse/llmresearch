//research code is found here

import {ChatOpenAI, OpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {HNSWLib} from "@langchain/community/vectorstores/hnswlib";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents";
import {StringOutputParser} from "@langchain/core/output_parsers";

//import and configure API key from dotenv file for use with models
import * as dotenv from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
dotenv.config();

//initialize openAI chat model
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 1,
  verbose: true,
});

//use text loader api to load in raw txt file
const loader = new TextLoader("texts/facts.txt"); //this will be in gitignore. place your own text file in texts and adjust path
const text = await loader.load();

//create text splitter to split text document into chunks
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 0,
});
const documents = await textSplitter.splitDocuments(text);

//what is a vector store
//look at hnsw
//create vector store from documents and wrap it in retrieval object
const vectorStore = await HNSWLib.fromDocuments(documents, new OpenAIEmbeddings({openAIApiKey: process.env.OPEN_API_KEY}));
//using https://chunkviz.up.railway.app/ we see that each country section is about 16 2000-character text chunks
const vectorStoreRetriever = vectorStore.asRetriever(16);

//retrieve from vector store
const retrieveDocuments = async query => await vectorStoreRetriever.getRelevantDocuments(query);

//construct prompt to feed into LLM
const prompt = ChatPromptTemplate.fromTemplate(`
    "You are an informative, brilliant AI Assistant who is great at giving facts about countries. Answer the user's question correctly, specifically for the given country."
    Context: {context}
    Question: {input}
    Country: {country}
`);

const outputParser = new StringOutputParser();

const chain = await createStuffDocumentsChain({
  llm,
  prompt,
  outputParser,
});

//held together with thumb tacks and tape
const country = " ";

const response = await chain.invoke({
  input: "How do i tie a tie?",
  country: country,
  context: retrieveDocuments(country),
});

// GREENLAND 7725 TOKENS ???????? worked
// IONIA 7926 TOKENS ... didnt work, fictional country
// HOW DO I TIE A TIE? 8040 TOKENS !!!! country: Iceland -> just returned information about iceland
// HOW DO I TIE A TIE? 8 2 4 8 T O K E N S ? ! ? ! ? ! country: " " -> ACTUALLY TAUGHT HOW TO TIE A TIE?

//llm is still able to draw from outside vector store </3
//might need to add a unique text document to vector store
//this ensures llm is NOT skipping over vs and searching straight from its own database
//🥲🥲🥲🥲

//add text file as vector store
//add chunk splitter
//init model
//query text
//COMPLETED

//return similarity index
//openai, mistral, llama 2, gemini
//compare similarities

//results what did we find -> im stupid
//compare actual fact
//if we take exclusively from a vector store is it a smaller language model?
//actual chatgpt comparison