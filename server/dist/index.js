import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Queue } from 'bullmq';
import { vectorStore } from './lib/qdrantclient.js';
import ollama from "ollama";
const queue = new Queue('pdf-processing', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});
const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });
app.post("/chat", async (req, res) => {
    const { query } = req.body;
    const ret = vectorStore.asRetriever({
        k: 2
    });
    const result = await ret.invoke(query);
    const context = result
        .map(doc => doc.pageContent)
        .join("\n\n");
    const SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on the provided context.
    If the answer is not contained within the text below, say "I don't know".
    Provide a detailed explanation with all important points.
    Keep the answer concise and to the point and well structured.
    In the end add a summary of the answer in 2-3 lines.
    Context:
    ${context}
    `;
    const response = await ollama.chat({
        model: "qwen3.5:9b",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: query }
        ],
        "think": "low"
    });
    console.log("Context length:", context.length);
    console.dir(response, { depth: null });
    console.log("context:", context);
    console.log("RESPONSE:", response.message.content);
    res.json({ response: response.message.content, airesponse: response });
});
app.post("/upload/pdf", upload.single('pdf'), async (req, res) => {
    queue.add('process-pdf', JSON.stringify({
        filename: req.file?.filename,
        source: req.file?.originalname,
        filePath: req.file?.path
    }));
    res.json("File uploaded");
});
app.listen(8000, () => {
    console.log(`Server Running on Port:${8000}`);
});
//# sourceMappingURL=index.js.map