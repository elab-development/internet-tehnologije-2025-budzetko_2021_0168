import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "UserId is required" }, { status: 400 });
  }

  const expenses = await prisma.expense.findMany({
    where: { userId: parseInt(userId) },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  try {
    const { description, amount, userId, categoryId } = await req.json();

    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        user: { connect: { id: parseInt(userId) } },
        category: { connect: { id: parseInt(categoryId) } }
      }
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("EXPENSE POST ERROR:", error);
    return NextResponse.json({ error: "Greška pri čuvanju troška" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await prisma.expense.delete({
    where: { id: parseInt(id) }
  });

  return NextResponse.json({ message: "Obrisano!" });
}