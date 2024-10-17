import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { Figure } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body: Figure = await req.json();
      const user = await currentUser()
      const { categoryId, src, name, description, instructions, seed } = body


      if (!user || !user.id) {
         return new NextResponse("Unauthorised", { status: 401 })
      }

      if (!categoryId || !name || !description || !instructions || !seed) {
         return new NextResponse("Missiing required fields", { status: 400 })
      }

      const figure = await prismadb.figure.create({
         data: {
            categoryId,
            userId: user.id,
            userName: user?.firstName || '',
            src,
            name,
            description,
            instructions,
            seed
         }
      })

      return NextResponse.json(figure)

   } catch (error) {
      console.log("[FIGURE_POST]", error)
      return new NextResponse("Internal Error", { status: 500 })
   }
}