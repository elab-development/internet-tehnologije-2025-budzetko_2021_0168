import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { cookies } from "next/headers";

// Pomoćna funkcija da proverimo da li je onaj ko zove rutu zapravo admin
async function isAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user_id')?.value;

  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { role: true }
  });

  return user?.role === 'ADMIN';
}

export async function GET() {
  try {
    // Samo admin sme da vidi listu svih korisnika
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Pristup odbijen. Samo za administratore." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { expenses: true, incomes: true }
        }
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri učitavanju" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Samo admin sme da menja uloge drugima
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Niste ovlašćeni za ovu akciju." }, { status: 403 });
    }

    const { userId, newRole } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { role: newRole }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri izmeni role" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Samo admin sme da briše korisnike iz ove opšte rute
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Samo administrator može brisati korisnike." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const id = Number(userId);

    await prisma.$transaction([
      prisma.expense.deleteMany({ where: { userId: id } }),
      prisma.income.deleteMany({ where: { userId: id } }),
      prisma.savingsGoal.deleteMany({ where: { userId: id } }), 
      prisma.budget.deleteMany({ where: { userId: id } }),   
      prisma.category.deleteMany({ where: { userId: id } }), 
      prisma.user.delete({ where: { id: id } }),
    ]);

    return NextResponse.json({ message: "Korisnik i svi podaci obrisani" });
  } catch (error) {
    console.error("Greška pri brisanju:", error);
    return NextResponse.json({ error: "Neuspešno brisanje" }, { status: 500 });
  }
}