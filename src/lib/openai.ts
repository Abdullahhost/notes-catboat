

import OpenAI from "openai";

const apiKey = process.env.OPEN_AI_API_KEY;

if (!apiKey) {
    throw new Error("Open ai api key is not to set.");
}

const openAi = new OpenAI({ apiKey });

export default openAi;


export async function getEmbading(text: string) {
    const response = openAi.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
    })
    const embedding = (await response).data[0].embedding;

    if (!embedding) throw new Error("This Error occured for generating Embading.");

    console.log(embedding)

    return embedding;
}