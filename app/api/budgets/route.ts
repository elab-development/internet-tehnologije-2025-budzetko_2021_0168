import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: parseInt(userId) },
      include: { category: true },
    });

    const formattedBudgets = budgets.map((b) => ({
      ...b,
      categoryId: b.categoryId === null ? "TOTAL" : b.categoryId,
      category: b.categoryId === null ? { name: "Ukupan mesečni limit" } : b.category
    }));

    return NextResponse.json(formattedBudgets);
  } catch (error) {
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userIdFromCookie = cookieStore.get('auth_user_id')?.value;
    const body = await req.json();
    
    const userId = body.userId;
    const categoryId = body.categoryId;
    const limit = body.limit;

    if (!userIdFromCookie) {
      return NextResponse.json({ error: "Niste autorizovani" }, { status: 401 });
    }

    // Parsiranje podataka
    const parsedUserId = parseInt(userIdFromCookie);
    const parsedLimit = parseFloat(limit);
    const parsedCategoryId = categoryId === "TOTAL" ? null : parseInt(categoryId);
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Provera postojećeg budžeta
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
          month: currentMonth,
          year: currentYear
        }
      });
    }

    // LOGIKA ZA BEDŽ PLANER
    const user = await prisma.user.findUnique({ 
      where: { id: parsedUserId } 
    });
    
    // Koristimo opcionalni chaining (?.) da izbegnemo greške ako user ne postoji
    const currentBadges: string = (user as any)?.badges || "";

    if (user && !currentBadges.includes("PLANER")) {
      const updated = currentBadges ? `${currentBadges},PLANER` : "PLANER";
      await prisma.user.update({
        where: { id: parsedUserId },
        data: { badges: updated } as any
      });
      console.log("🎯 KORISNIK JE POSTAO PLANER!");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Greška u bazi:", error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}