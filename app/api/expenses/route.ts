import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

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
 
    // Kreiramo trošak 
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        userId: parseInt(userId),
        categoryId: parseInt(categoryId)
      }
    });
 
    // umotavamo u poseban try-catch da ne sruši čuvanje troška
    try {
      const expenseCount = await prisma.expense.count({
        where: { userId: parseInt(userId) }
      });
 
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });
 
      if (user) {
        // Uzimamo trenutne bedževe (ako su null, postaju prazan string)
        const currentBadges = (user as any).badges || "";
 
        // --- PROVERA ZA PRVI KORAK ---
        if (expenseCount >= 1 && !currentBadges.includes("PRVI_KORAK")) {
          const updatedBadges = currentBadges ? `${currentBadges},PRVI_KORAK` : "PRVI_KORAK";
          await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { badges: updatedBadges } as any
          });
          console.log("🎉 USPEH: Korisnik je dobio svoj prvi bedž: PRVI_KORAK");
        }
 
        // --- PROVERA ZA BUDŽET MASTER ---
        const userBudgets = await prisma.budget.findMany({
          where: { userId: parseInt(userId) }
        });
 
        if (userBudgets.length >= 3 && !currentBadges.includes("BUDZET_MASTER")) {
          let isOverLimit = false;
          for (const budget of userBudgets) {
            const expensesInCategory = await prisma.expense.findMany({
              where: { userId: parseInt(userId), categoryId: budget.categoryId || 0 }
            });
            const totalSpent = expensesInCategory.reduce((sum, exp) => sum + exp.amount, 0);
            if (totalSpent > budget.limit) {
              isOverLimit = true;
              break;
            }
          }
 
          if (!isOverLimit) {
            // Ponovo uzimamo najsvežije bedževe jer smo možda malopre dodali PRVI_KORAK
            const freshUser = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
            const freshBadges = (freshUser as any).badges || "";
            const updated = freshBadges ? `${freshBadges},BUDZET_MASTER` : "BUDZET_MASTER";
            
            await prisma.user.update({
              where: { id: parseInt(userId) },
              data: { badges: updated } as any
            });
            console.log("🔥 NEVEROVATNO: Korisnik je BUDŽET MASTER!");
          }
        }
      }
    } catch (badgeError) {
      console.error("Greška kod dodele bedža (ali trošak je sačuvan):", badgeError);
    }
 
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Kritična greška u POST ruti:", error);
    return NextResponse.json({ error: "Greška pri čuvanju troška" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { description, amount, categoryId } = body;

    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const updated = await prisma.expense.update({ 
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

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await prisma.expense.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ message: "Obrisano!" });
}