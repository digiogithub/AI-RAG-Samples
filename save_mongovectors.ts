// **********************************************
// Saving and seaching vectors in MongoDB
// This sample based in https://www.mongodb.com/docs/atlas/atlas-vector-search/ai-integrations/langchain-js/
// The sample is changed for to use local TinyLlama instead OpenAI for embeddings
// **********************************************

import { formatDocumentsAsString } from "langchain/util/document";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as fs from 'fs';
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const embeddings = new OpenAIEmbeddings({
    apiKey: "empty", // In Node.js defaults to process.env.OPENAI_API_KEY
    batchSize: 512, // Default value if omitted is 512. Max is 2048
    model: "TinyLlama-1.1B-Chat-v1.0.Q2_K",
    dimensions: 1024,
    configuration: {
        baseURL: "http://127.0.0.1:8080/v1"
    }
});


async function run() {
    try {
        // Configure your Atlas collection
        const database = client.db("langchain_db");
        const collection = database.collection("test");
        const dbConfig = {
            collection: collection,
            indexName: "vector_index", // The name of the Atlas search index to use.
            textKey: "text", // Field name for the raw text content. Defaults to "text".
            embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
        };

        // Ensure that the collection is empty
        await collection.deleteMany({});
        // Save online PDF as a file
        const rawData = await fetch("https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4HkJP");
        const pdfBuffer = await rawData.arrayBuffer();
        const pdfData = Buffer.from(pdfBuffer);
        fs.writeFileSync("atlas_best_practices.pdf", pdfData);
        // Load and split the sample data
        const loader = new PDFLoader(`atlas_best_practices.pdf`);
        const data = await loader.load();
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 20,
        });
        const docs = await textSplitter.splitDocuments(data);
        // Instantiate Atlas as a vector store
        const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, dbConfig);
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
