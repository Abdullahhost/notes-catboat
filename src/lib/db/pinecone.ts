
import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
    throw new Error("Pinecone api key is not set.")
}

const pinecone = new Pinecone({
    apiKey
})

export const noteIndex = pinecone.Index("ai-notes")

