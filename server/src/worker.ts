import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { createVectorStore, ensureCollection } from './lib/qdrantclient.js';
const myWorker = new Worker('pdf-processing', async job => {
  try {
    const data = JSON.parse(job.data);
    //load pdf 
    const loader = new PDFLoader(data.filePath);
    const docs = await loader.load();
    const splitter = new CharacterTextSplitter({ chunkSize: 500, chunkOverlap: 0 })
    if (!docs[0]) {
      return console.log("No document found")
    }

    const splitDocs = await splitter.splitDocuments(docs);
    await ensureCollection();
    await createVectorStore(splitDocs);

  } catch (error) {
    console.log("Error in worker:", error)
  }
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});
