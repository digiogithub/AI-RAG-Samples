// Test try to obtain embeddings from a local OpenAI server using llamafile and TinyLlama model

import { OpenAIEmbeddings } from "@langchain/openai";


const embeddings = new OpenAIEmbeddings({
    apiKey: "empty", // In Node.js defaults to process.env.OPENAI_API_KEY
    batchSize: 512, // Default value if omitted is 512. Max is 2048
    model: "TinyLlama-1.1B-Chat-v1.0.Q2_K",
    dimensions: 1024,
    configuration: {
        baseURL: "http://127.0.0.1:8080/v1"
    }
});

const vectors = await embeddings.embedDocuments(["some text"]);
// If vector array is 0's then your llamafile has a bug
console.log(vectors);