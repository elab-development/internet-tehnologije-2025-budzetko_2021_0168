import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'No User ID' }, { status: 400 });

    const goals = await prisma.savingsGoal.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' } // SADA RADI! ✅
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

    const result = await prisma.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        userId: parseInt(userId),
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri kreiranju cilja' }, { status: 500 });
  }
}