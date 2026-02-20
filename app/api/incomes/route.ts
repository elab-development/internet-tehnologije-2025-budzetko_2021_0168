import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "UserId is required" }, { status: 400 });
  }

  const incomes = await prisma.income.findMany({
    where: { userId: parseInt(userId) },
    include: { category: true }, // da bismo videli ime kategorije
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(incomes);
}

export async function POST(req: Request) {
  try {
    const { description, amount, userId, categoryId } = await req.json();

    const newIncome = await prisma.income.create({
      data: {
        description,
        amount: parseFloat(amount),
        user: { connect: { id: parseInt(userId) } },
        category: { connect: { id: parseInt(categoryId) } }
      }
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    console.error("INCOME POST ERROR:", error);
    return NextResponse.json({ error: "Greška pri čuvanju prihoda!" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await prisma.income.delete({
    where: { id: parseInt(id) }
  });

  return NextResponse.json({ message: "Obrisano!" });
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { description, amount, categoryId } = body;

    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const updated = await prisma.income.update({ 
      where: { 
        id: parseInt(id) 
      },
      data: { 
        description, 
        amount: parseFloat(amount), 
        categoryId: categoryId ? parseInt(categoryId) : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PRISMA ERROR:", error.message);
    return NextResponse.json({ error: "Greška pri ažuriranju: " + error.message }, { status: 500 });
  }
}