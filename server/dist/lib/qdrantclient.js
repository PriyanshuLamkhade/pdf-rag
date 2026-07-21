import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddings } from "./embeddings.js";
export const qdrantClient = new QdrantClient({
    url: "http://localhost:6333",
});
export async function ensureCollection() {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some((c) => c.name === "pdf_docs");
    if (!exists) {
        await qdrantClient.createCollection("pdf_docs", {
            vectors: {
                size: 768,
                distance: "Cosine",
            },
        });
    }
}
export async function createVectorStore(splitDocs) {
    return await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
        client: qdrantClient,
        collectionName: "pdf_docs",
    });
}
export const vectorStore = new QdrantVectorStore(embeddings, {
    client: qdrantClient,
    collectionName: "pdf_docs",
});
//# sourceMappingURL=qdrantclient.js.map