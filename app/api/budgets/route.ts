import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'No User ID' }, { status: 400 });

    const budgets = await prisma.budget.findMany({
      where: { userId: parseInt(userId) },
      include: { category: true },
    });

    const formattedBudgets = budgets.map((b) => ({
      ...b,
      categoryId: b.categoryId === null ? "TOTAL" : b.categoryId,
      category: b.categoryId === null ? { name: "Ukupan Mesečni Limit" } : b.category
    }));

    return NextResponse.json(formattedBudgets);
  } catch (error) {
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, limit, userId } = body;

    const parsedUserId = parseInt(userId);
    const parsedLimit = parseFloat(limit);
    const parsedCategoryId = categoryId === "TOTAL" ? null : parseInt(categoryId);
    
    // Dobijamo trenutni mesec i godinu
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Pronađi postojeći budžet za taj userId, kategoriju, mesec i godinu
    const existing = await prisma.budget.findFirst({
      where: {
        userId: parsedUserId,
        categoryId: parsedCategoryId,
        month: currentMonth,
        year: currentYear
      }
    });

    let result;
    if (existing) {
      result = await prisma.budget.update({
        where: { id: existing.id },
        data: { limit: parsedLimit }
      });
    } else {
      result = await prisma.budget.create({
        data: {
          limit: parsedLimit,
          userId: parsedUserId,
          categoryId: parsedCategoryId,
          month: currentMonth, // Šaljemo mesec
          year: currentYear   // Šaljemo godinu
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Greška u bazi:", error);
    return NextResponse.json({ error: 'Proveri konzolu, baza odbija upis.' }, { status: 500 });
  }
}