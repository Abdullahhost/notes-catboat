import { noteIndex } from "@/lib/db/pinecone";
import openAi, { getEmbading } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const messageTruncated = messages?.slice(-6);
        const embading = await getEmbading(messageTruncated.map((message: any) => message.content).join("\n"));
        const { userId } = auth();

        const vectorQueryResponse = await noteIndex.query({
            vector: embading,
            topK: 1,
            filter: { userId }
        })

        const relavenNotes = await prisma?.note.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map((match) => match.id)
                }
            }
        });

        const systemMessage: ChatCompletionMessage = {
            role: "assistant",
            content: "You are an intelligent note-taking app. You answare the user's question based on their existing notes. " + "The relevant notes for this query are : \n" + relavenNotes?.map((note) => `Title: ${note.title} \n\nContent : \n ${note.content}]`).join("\n\n")
        }

        const response = await openAi.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [systemMessage, ...messageTruncated]
        })

        const streem = OpenAIStream(response);
        return new StreamingTextResponse(streem);

    } catch (err: any) {
        console.log("Internel Error : ", err)
        return Response.json({ message: 'There is something wrong with api handling.' }, { status: 500 })
    }
}