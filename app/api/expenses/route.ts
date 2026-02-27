import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

// --- POMOĆNA FUNKCIJA ZA PROVERU AUTENTIFIKACIJE ---
async function getAuthUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user_id')?.value;
  return userId ? parseInt(userId) : null;
}

export async function GET(req: Request) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });

  const expenses = await prisma.expense.findMany({
    where: { userId: userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Niste autorizovani" }, { status: 401 });

    const { description, amount, categoryId } = await req.json();

    // Kreiramo trošak koristeći provereni ID iz kolačića
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        userId: userId,
        categoryId: parseInt(categoryId)
      }
    });

    // LOGIKA ZA BEDŽEVE (Sada potpuno sigurna)
    try {
      const expenseCount = await prisma.expense.count({ where: { userId } });
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user) {
        const currentBadges = (user as any).badges || "";

        // Bedž: PRVI_KORAK
        if (expenseCount >= 1 && !currentBadges.includes("PRVI_KORAK")) {
          const updated = currentBadges ? `${currentBadges},PRVI_KORAK` : "PRVI_KORAK";
          await prisma.user.update({
            where: { id: userId },
            data: { badges: updated } as any
          });
        }

        // Bedž: BUDZET_MASTER
        const userBudgets = await prisma.budget.findMany({ where: { userId } });
        if (userBudgets.length >= 3 && !currentBadges.includes("BUDZET_MASTER")) {
          let isOverLimit = false;
          for (const budget of userBudgets) {
            const expensesInCategory = await prisma.expense.findMany({
              where: { userId, categoryId: budget.categoryId || 0 }
            });
            const totalSpent = expensesInCategory.reduce((sum, exp) => sum + exp.amount, 0);
            if (totalSpent > budget.limit) { isOverLimit = true; break; }
          }

          if (!isOverLimit) {
            const freshUser = await prisma.user.findUnique({ where: { id: userId } });
            const freshBadges = (freshUser as any).badges || "";
            const updated = freshBadges ? `${freshBadges},BUDZET_MASTER` : "BUDZET_MASTER";
            await prisma.user.update({
              where: { id: userId },
              data: { badges: updated } as any
            });
          }
        }
      }
    } catch (badgeError) {
      console.error("Greška kod bedževa:", badgeError);
    }

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čuvanju" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getAuthUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { description, amount, categoryId } = await req.json();

    if (!userId || !id) return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 });

    // IDOR ZAŠTITA: updateMany dozvoljava filter po userId
    const updated = await prisma.expense.updateMany({
      where: { 
        id: parseInt(id),
        userId: userId 
      },
      data: {
        description,
        amount: parseFloat(amount),
        categoryId: categoryId ? parseInt(categoryId) : undefined
      }
    });

    if (updated.count === 0) return NextResponse.json({ error: "Pristup odbijen" }, { status: 403 });

    return NextResponse.json({ message: "Ažurirano" });
  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!userId || !id) return NextResponse.json({ error: "Neautorizovan pristup" }, { status: 401 });

    // IDOR ZAŠTITA: Brišemo samo ako trošak pripada ulogovanom korisniku
    const deleted = await prisma.expense.deleteMany({ 
      where: { 
        id: parseInt(id),
        userId: userId 
      } 
    });

    if (deleted.count === 0) return NextResponse.json({ error: "Nemate dozvolu" }, { status: 403 });

    return NextResponse.json({ message: "Obrisano!" });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri brisanju" }, { status: 500 });
  }
}