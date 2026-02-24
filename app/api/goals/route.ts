import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'No User ID' }, { status: 400 });

    const goals = await prisma.savingsGoal.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri dohvatanju ciljeva' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, targetAmount, currentAmount, userId } = body;
    const parsedUserId = parseInt(userId);

    const result = await prisma.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        userId: parsedUserId,
      }
    });
    // Smanjivanje bilansa pri kreiranju novog cilja
    /*if (result.currentAmount > 0) {
      await prisma.user.update({
        where: { id: parsedUserId },
        data: { 
          balance: { decrement: result.currentAmount } 
        } as any
      });
    }*/
    // --- LOGIKA ZA BEDŽEVE ---
    const user = await prisma.user.findUnique({ where: { id: parsedUserId } });
    let currentBadges = (user as any)?.badges || "";

    //  Provera za običnog ŠTEDIŠU (ako je odmah kreirao ispunjen cilj)
    if (result.currentAmount >= result.targetAmount && !currentBadges.includes("STEDISA")) {
      currentBadges = currentBadges ? `${currentBadges},STEDISA` : "STEDISA";
      await prisma.user.update({
        where: { id: parsedUserId },
        data: { badges: currentBadges } as any
      });
    }

    // Provera za KRALJA ŠTEDNJE
    const allGoals = await prisma.savingsGoal.findMany({ where: { userId: parsedUserId } });
    const completedGoals = allGoals.filter(goal => goal.currentAmount >= goal.targetAmount);
    const totalSaved = completedGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    if (completedGoals.length >= 2 && totalSaved >= 10000 && !currentBadges.includes("KRALJ_STEDNJE")) {
      const updatedWithKralj = currentBadges ? `${currentBadges},KRALJ_STEDNJE` : "KRALJ_STEDNJE";
      await prisma.user.update({
        where: { id: parsedUserId },
        data: { badges: updatedWithKralj } as any
      });
      console.log("🏆 KORISNIK JE POSTAO KRALJ ŠTEDNJE!");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Greška pri kreiranju cilja' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, currentAmount, userId } = body;

    const parsedGoalId = parseInt(id);
    const parsedUserId = parseInt(userId);
    const noviIznos = parseFloat(currentAmount);

    // Prvo uzimamo stari iznos cilja da vidimo kolika je razlika
    const oldGoal = await prisma.savingsGoal.findUnique({
      where: { id: parsedGoalId }
    });

    if (!oldGoal) return NextResponse.json({ error: "Cilj nije pronađen" }, { status: 404 });

    const razlika = noviIznos - oldGoal.currentAmount;

    // Ažuriramo cilj
    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: parsedGoalId },
      data: { currentAmount: noviIznos },
    });

    // AUTOMATSKI SMANJUJEMO BILANS KORISNIKA ZA RAZLIKU
    // Ako je korisnik dodao 1000 na štednju, bilans mu se smanjuje za 1000
    if (razlika !== 0) {
      await prisma.user.update({
        where: { id: parsedUserId },
        data: { 
          balance: { 
            decrement: razlika 
          } 
        } as any, 
      });
      console.log(`📉 Bilans smanjen za: ${razlika}`);
    }

    // --- LOGIKA ZA BEDŽEVE ---
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      const user = await prisma.user.findUnique({ where: { id: parsedUserId } });
      const currentBadges = (user as any)?.badges || "";

      if (user && !currentBadges.includes("STEDISA")) {
        const updatedBadges = currentBadges ? `${currentBadges},STEDISA` : "STEDISA";
        await prisma.user.update({
          where: { id: parsedUserId },
          data: { badges: updatedBadges } as any,
        });
        console.log("🎯 KORISNIK JE POSTAO ŠTEDIŠA!");
      }
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}