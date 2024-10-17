import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { Figure } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {
   params
}: { params: { figureId: string } }) {
   try {
      const body: Figure = await req.json();
      const user = await currentUser()
      const { categoryId, src, name, description, instructions, seed } = body


      if (!params.figureId) return new NextResponse("Id is required", { status: 400 })

      if (!user || !user.id) {
         return new NextResponse("Unauthorised", { status: 401 })
      }

      if (!categoryId || !name || !description || !instructions || !seed) {
         return new NextResponse("Missiing required fields", { status: 400 })
      }

      const figure = await prismadb.figure.update({
         where: {
            id: params.figureId
         },
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
      console.log("[FIGURE_PATCH]", error)
      return new NextResponse("Internal Error", { status: 500 })
   }
}