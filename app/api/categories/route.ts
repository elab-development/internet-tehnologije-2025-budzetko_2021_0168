import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri učitavanju" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type } = body;
    if (!name || !type) return NextResponse.json({ error: "Ime i tip obavezni" }, { status: 400 });

    const newCategory = await prisma.category.create({
      data: { name, type },
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čuvanju" }, { status: 500 });
  }
}