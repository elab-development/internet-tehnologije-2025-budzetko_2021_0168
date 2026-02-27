import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Pomoćna funkcija za autentifikaciju
async function getAuthUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user_id')?.value;
  return userId ? parseInt(userId) : null;
}

export async function GET(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });

    const goals = await prisma.savingsGoal.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri dohvatanju ciljeva' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: 'Niste autorizovani' }, { status: 401 });

    const body = await req.json();
    const { name, targetAmount, currentAmount } = body;

    const result = await prisma.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        userId: userId, // Koristimo ID iz kolačića
      }
    });

    // --- LOGIKA ZA BEDŽEVE ---
    const user = await prisma.user.findUnique({ where: { id: userId } });
    let currentBadges = (user as any)?.badges || "";

    if (result.currentAmount >= result.targetAmount && !currentBadges.includes("STEDISA")) {
      currentBadges = currentBadges ? `${currentBadges},STEDISA` : "STEDISA";
      await prisma.user.update({
        where: { id: userId },
        data: { badges: currentBadges } as any
      });
    }

    const allGoals = await prisma.savingsGoal.findMany({ where: { userId: userId } });
    const completedGoals = allGoals.filter(goal => goal.currentAmount >= goal.targetAmount);
    const totalSaved = completedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    if (completedGoals.length >= 2 && totalSaved >= 10000 && !currentBadges.includes("KRALJ_STEDNJE")) {
      const updatedWithKralj = currentBadges ? `${currentBadges},KRALJ_STEDNJE` : "KRALJ_STEDNJE";
      await prisma.user.update({
        where: { id: userId },
        data: { badges: updatedWithKralj } as any
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri kreiranju cilja' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: 'Niste autorizovani' }, { status: 401 });

    const body = await req.json();
    const { id, currentAmount } = body;
    const parsedGoalId = parseInt(id);
    const noviIznos = parseFloat(currentAmount);

    // IDOR ZAŠTITA: Proveravamo da li cilj pripada korisniku PRE nego što mu skinemo pare sa računa
    const oldGoal = await prisma.savingsGoal.findFirst({
      where: { 
        id: parsedGoalId,
        userId: userId 
      }
    });

    if (!oldGoal) return NextResponse.json({ error: "Cilj nije pronađen ili nemate dozvolu" }, { status: 403 });

    const razlika = noviIznos - oldGoal.currentAmount;

    // Ažuriramo cilj
    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: parsedGoalId },
      data: { currentAmount: noviIznos },
    });

    // Ažuriramo bilans samo ako je korisnik stvarno vlasnik cilja
    if (razlika !== 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          balance: { decrement: razlika } 
        } as any, 
      });
    }

    // --- LOGIKA ZA BEDŽEVE ---
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const currentBadges = (user as any)?.badges || "";

      if (user && !currentBadges.includes("STEDISA")) {
        const updatedBadges = currentBadges ? `${currentBadges},STEDISA` : "STEDISA";
        await prisma.user.update({
          where: { id: userId },
          data: { badges: updatedBadges } as any,
        });
      }
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}