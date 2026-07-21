import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
export declare const qdrantClient: QdrantClient;
export declare function ensureCollection(): Promise<void>;
export declare function createVectorStore(splitDocs: any): Promise<QdrantVectorStore>;
export declare const vectorStore: QdrantVectorStore;
//# sourceMappingURL=qdrantclient.d.ts.map