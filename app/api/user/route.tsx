import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { expenses: true, incomes: true }
        }
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Greška" }, { status: 500 });
  }
}