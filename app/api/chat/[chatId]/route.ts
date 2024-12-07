import { FigureKey, MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { currentUser } from "@clerk/nextjs/server";
import { LangChainStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { Replicate } from "@langchain/community/llms/replicate";
import { CallbackManager } from "@langchain/core/callbacks/manager";

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
   try {
      const { prompt } = await request.json();
      const user = await currentUser();

      if (!user || !user.firstName || !user.id) {
         return new NextResponse("Unauthorised", { status: 401 })
      }

      const identifier = request.url + "-" + user.id;
      const { success } = await rateLimit(identifier)

      if (!success) {
         return new NextResponse("Rate limit exceeded", { status: 400 })
      }

      const figure = await prismadb.figure.update({
         where: {
            id: params.chatId,
         },
         data: {
            Message: {
               create: {
                  content: prompt,
                  role: 'user',
                  userId: user.id
               }
            }
         }
      })

      if (!figure) {
         return new NextResponse("Figure not found", { status: 404 })
      }

      const name = figure.name
      const figure_file_name = name + ".txt"

      const figureKey: FigureKey = {
         figureName: name,
         modelName: 'llama2-l3b',
         userId: user.id
      }

      const memoryManager = await MemoryManager.getInstance()

      const records = await memoryManager.readLatestHistory(figureKey)

      if (records.length === 0) {
         await memoryManager.seedChatHistory(figure.seed, "\n\n", figureKey)
      }

      await memoryManager.writeToHistory("User: " + prompt + "\n", figureKey)

      const recentChatHistory = await memoryManager.readLatestHistory(figureKey)

      const similarDocs = await memoryManager.vectorSearch(recentChatHistory, figure_file_name)

      let relevantHistory = ""

      if (!!similarDocs && similarDocs.length !== 0) {
         relevantHistory = similarDocs.map(doc => doc.pageContent).join('\n')
      }

      const { handlers } = LangChainStream()

      const model = new Replicate({
         model: "a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
         apiKey: process.env.REPLICATE_API_TOKEN,
         callbacks: CallbackManager.fromHandlers(handlers)
      })
      model.verbose = true;

      const response = String(
         await model.invoke(
            `
               ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.

               ${figure.instructions}

               Below are the relevant details about ${name}'s post and the conversation you are in. ${relevantHistory}

               ${recentChatHistory}\n${name}
            `
         )
            .catch(console.error)
      )

      const cleaned = response.replaceAll(",", "")
      const chunks = cleaned.split("\n")
      const resp = chunks[0]

      await memoryManager.writeToHistory("" + resp.trim(), figureKey)
      var Readable = require("stream").Readable;

      let s = new Readable()
      s.push(response)
      s.push(null)

      if (resp !== undefined && response.length > 1) {
         memoryManager.writeToHistory("" + resp.trim(), figureKey)

         await prismadb.figure.update({
            where: {
               id: params.chatId,
            },
            data: {
               Message: {
                  create: {
                     content: resp.trim(),
                     role: "figureAI",
                     userId: user.id
                  }
               }
            }
         })
      }

      return new StreamingTextResponse(s)
   } catch (error) {
      console.log("[CHAT_POST]", error)
      return new NextResponse("Internal Error", { status: 500 })
   }
}