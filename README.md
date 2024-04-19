# Title: 
Data Integrity in Large Language Model Retrieval Augmented Generation

# Abstract

The focus of this research is to analyze the ability of Large Language Models (LLMs) to maintain data accuracy and integrity during Retrieval Augmented Generation. By investigating their capabilities to generate consistent information and assessing the success rate of factual data returned to the user, this project seeks to provide insight into the reliability of LLMs in text-based and chat-based contexts.

# Introduction

Large Language Models lend themselves to be the most prominent applications of Generative Artificial Intelligence (Gen AI). These models are trained on vast amounts of textual data from various sources and can provide relational and semantic context between commonly occurring words, sentences and language structures. The textual data originates from existing websites, documents, books and articles, and serves as the scope of knowledge at which the LLM can operate. Vast sources of information allow them to emulate a broad spectrum of human language in various contexts. However, in a dynamic informational age, this has its limitations. To incorporate new data, models must be retrained, consuming further resources and posing a temporary solution. With Retrieval Augmented Generation (RAG), LLMs can draw data from sources they were not exposed to during training, enhancing their text generation capabilities and increasing the extent of their knowledge. While this great expanse of static and dynamic data sources may broaden the effective scope of text generation, it also poses a risk to the factuality of information.


# Methods

Langchain provides a wonderful level of abstraction, but it is still important to understand what's going on under the hood.

__Prompt Engineering:__ 
Langchain’s prompt templating capabilities used to pass system and user messages to the model to ensure its functionality within the constraint and parameters of the experiment.

__Data Transformation:__ 
Reformatted and recursively split large raw text files, allowing information to be transformed into manageable chunks, ensuring efficient and concise retrieval by the models.

__Vector Storage and Searching:__ 
Embedded transformed text data into a vector representation to store data in multi-dimensional data storage structure and utilized the Hierarchical Navigable Small World (HNSW) algorithm to perform time-efficient and precise approximate Nearest Neighbor Searching throughout the vector store.

# Results

The OpenAI API is being used as an LLM to collect the output result, with Langchain as the interface to embed and query text documents. The results were produced using 8 text files containing random facts, 6 of which were the same recurring correct facts worded various ways, and 3 of which contained incorrect information following the same structure. A ratio of correct to incorrect files were determined as an experimental variable (ranging from 6 correct files and 0 incorrect files, to 3 correct files and 3 incorrect files. The prompt received queries related to information that the LLM was able to access as input, and the LLM model ran 10 times. From these runs, the percentage of correct answers was derived.



| Fact Query                                   |       6-0     |    5-1    |    4-2  |    3-3   |
| :-------------------------------------------:|:-------------:| :--------:|:-------:|:--------:|
| How many taste buds do catfish have?         | 100%          |    100%   |   90%   |   70%    |
| In which states can I pump my own gas?       | 100%          |    80%    |   90%   |   60%    |
| What is one type of fish sushi is made from? | 100%          |    100%   |  100%   |   90%    |
| Which animal sleeps the most?                | 100%          |    90%    |   40%   |   10%    |
| Where do apples come from?                   | 100%          |    100%   |  100%   |   100%   |

_Table Depicting the Correct Answer Percentage Rate of the Fact-exposed LLM_

# Discussion

In analyzing the results of the OpenAI LLM model queries, it can be inferred that the model possesses a reasonable, if not greater than average, level of data resilience, being able to consistently provide correct facts, even when faced with the injection of erroneous information. While there were outliers to this notion, the scale of experimentation was not comprehensive enough to make concrete conclusions about the model’s capabilities to maintain accurate textual data.
However, going forward, there is promise for the exploration of larger sample sizes and data sets, greater processing power for larger-scale text transformation and generation, and comparison of other LLMs, which all served as limitations in the implementation stages. These additional factors and variables may serve to deliver new viewpoints of the problem, providing more varied results, on a more impactful scale. With such results, complex data visualization will prove to be more meaningful and relevant. 
Additionally, on the side of analysis, with a grander scope, advanced analysis regarding similarity indices of original and generated strings could provide further insight into the internal processes of generating and maintaining precision in text data. 


# Instructions

This project uses Langchain and Node.js, and assumes you have both Node.js and npm installed on your system.

Langchain and its various subpackages can be installed with the following:

```
npm install -S langchain
npm install @langchain/community
npm install @langchain/core
```

Pull from Main branch.

Run 
```
node modules/file-name.js
```
in terminal to run a file.

Remember to run npm install after each pull.

You must configure your .env file and place your relevant API keys there.
