import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, userId } = body;

    // Provera podataka
    if (!description || !amount || !userId) {
      return NextResponse.json({ error: "Sva polja su obavezna!" }, { status: 400 });
    }

    // Upis u bazu
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        userId: parseInt(userId),
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("GREŠKA PRI UNOSU:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "UserId je obavezan" }, { status: 400 });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        createdAt: 'desc', // Najnoviji troškovi idu prvi
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čitanju troškova" }, { status: 500 });
  }
}