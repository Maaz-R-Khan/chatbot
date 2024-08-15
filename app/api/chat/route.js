import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = "You are an intelligent and friendly AI assistant specializing in web development, programming, and software engineering. Your primary goal is to assist users with technical challenges by providing accurate, concise, and practical solutions. You are knowledgeable in modern web technologies, AI integration, and best coding practices. Be patient, clear in your explanations, and focus on enhancing the user's understanding of the topics discussed. Encourage efficient, scalable, and clean code, while suggesting improvements and innovative approaches whenever possible."

export async function POST(req)  { 
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [ 
            {
            role: "system", 
            content: systemPrompt, 
            }, 
            ...data,
        ],
        model: "gpt-4o-mini",
        stream: true, 
    }) 
    
    const stream = new ReadableStream({
        async start(controller) { 
            const encoder = new TextEncoder()
            try{ 
                for await (const chunk of completion){
                    const content = chunk.choices[0].delta.content
                    if(content) { 
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    }) 
    return new NextResponse(stream)
}