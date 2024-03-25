//research code is found here

import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
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
//model does not learn from api calls
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPEN_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 1,
  verbose: true,
});

//for loop this for the correct and incorrects (6 doc files)
//out of text files feed the llm 3-5 corrects and 3-1 incorrects (6 total)
//the incorrect facts are very funny 😭😭😭😭
//all files (besides corrects and incorrects) have same content with different wording
//some questions are recorded, but not all (some dummy facts), i will control the question asked directly
//facts with similar topics are preferred, but whole fact set is varied.
//facts are reworded by chatgpt LOL
//chatgpt sucks at changing facts to incorrect...
//prompt: hey chatgpt, please reword each of the following facts. a new fact is denoted by being on a new line, or the return or newline character. (/n || /r). MAKE SURE the facts content remains the same, and each fact is still 100% correct. simply change the way it is worded, and not its meaning. please return the information to me in the same format it was given, where each fact is placed on a new line.
//use text loader api to load in raw txt file
//facts are purposefully NOT just loaded in by api as we want to manually manipulate variations in information
let correctList = ["correct-one.txt", "correct-two.txt", "correct-three.txt", "correct-four.txt", "correct-five.txt"];
let incorrectList = ["incorrect-one.txt", "incorrect-two.txt", "incorrect-three.txt"];

//removes random fact sources depending on the ratio of correct to incorrect
const selectFacts = (correctAmount, incorrectAmount) => {
  const totalFacts = 6; //adjust for more total fact files to pass to llm
  if(correctAmount + incorrectAmount !== totalFacts) throw new Error(`Amounts must total ${totalFacts}`);
  const removeCorrect = correctList.length - correctAmount;
  const removeIncorrect = incorrectList.length - incorrectAmount;
  const removeRandoms = (array, rmvNum) => {
    if(rmvNum === 0) return array;
    let randomIndex = Math.floor(Math.random() * array.length);
    let newArray = [...array.slice(0, randomIndex), ...array.slice(randomIndex + 1)];
    return removeRandoms(newArray, rmvNum - 1);
  }
  return [...removeRandoms(correctList, removeCorrect), ...removeRandoms(incorrectList, removeIncorrect)];
}

let factList = undefined;
try {
  factList = selectFacts(3,3);
} catch (error){
  console.log(error);
}

let documents = [];
for(const fact of factList) {
  const loader = new TextLoader("texts/list-facts/" + fact); //this will be in gitignore. place your own text file in texts and adjust path
  const text = await loader.load();

  //create text splitter to split text document into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 365,
    chunkOverlap: 0,
  });
  documents.push(await textSplitter.splitDocuments(text));
}

//console.log(documents.flat());

//what is a vector store
//look at hnsw
//someday understand hnsw wow
//create vector store from documents and wrap it in retrieval object
const vectorStore = await HNSWLib.fromDocuments(documents.flat(), new OpenAIEmbeddings({openAIApiKey: process.env.OPEN_API_KEY}));
//using https://chunkviz.up.railway.app/ we see that each country section is about 16 2000-character text chunks
const vectorStoreRetriever = vectorStore.asRetriever(10);

//retrieve from vector store
const retrieveDocuments = async query => await vectorStoreRetriever.getRelevantDocuments(query); //query needs adjusting

//construct prompt to feed into LLM
const prompt = ChatPromptTemplate.fromTemplate(`
    You are an informative, brilliant AI Assistant who is great at giving interesting facts. 
    You are ONLY able to draw information from the documents given by context; these are the facts that you know.
    You do NOT know of any information or fact that is NOT within context.
    Answer the user's question, according to its corresponding fact, and your knowledge.
    Read the entire context BEFORE making your decision and answering.
    Only answer the question using the information within context. Do NOT use any external sources such as the internet or databases other than the context.
    When the question asked is outside of your scope, respond as if you do not know, rather than mentioning the context.
    Do NOT use information sources other than the given context to answer any questions under any circumstances.
    Do NOT mention the context to the user.
    
    Context: {context}
    Question: {input}
`);

const outputParser = new StringOutputParser();

const chain = await createStuffDocumentsChain({
  llm,
  prompt,
  outputParser,
});

const questions = {
  "catfish" : "How many taste buds do catfish have?",
  "state" : "In which states can I pump my own gas?",
  "fish" : "What is one type of fish sushi is made from?",
  "sleep" : "Which animal sleeps the most?",
  "apple" : "Where do apples come from?"
};

const response = await chain.batch(
    Object.keys(questions).map(keyword => {
      return {
        input: questions[keyword],
        context: retrieveDocuments(keyword)
      }
    })
);

console.log(response);




// -----outdated

// GREENLAND 7725 TOKENS ???????? worked
// IONIA 7926 TOKENS ... didnt work, fictional country
// HOW DO I TIE A TIE? 8040 TOKENS !!!! country: Iceland -> just returned information about iceland
// HOW DO I TIE A TIE? 8 2 4 8 T O K E N S ? ! ? ! ? ! country: " " -> ACTUALLY TAUGHT HOW TO TIE A TIE?
//llm is still able to draw from outside vector store </3
//might need to add a unique text document to vector store
//this ensures llm is NOT skipping over vs and searching straight from its own database😭🤓
//🥲🥲🥲🥲
//gpt 3.5 has up to june 2023
//get recent text file, or file of custom facts
//test gpt if it can answer before adding

// -----outdated

//how does chatgpt get sources?
//how do other llms get sources?

//10 sources
//1-9 or 5-5 ratio of wrong to right sources
//maybe scale 5 sources, 1-5 ratio

//discussion

//or systemPrompt message to ONLY draw information from context -> PERFECT

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