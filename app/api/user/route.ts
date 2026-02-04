import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const id = Number(userId);

    // Transakcija: Brišemo sve povezano pa tek onda korisnika
    await prisma.$transaction([
      prisma.expense.deleteMany({ where: { userId: id } }),
      prisma.income.deleteMany({ where: { userId: id } }),
      prisma.category.deleteMany({ where: { userId: id } }), // Brišemo i njegove kategorije
      prisma.user.delete({ where: { id: id } }),
    ]);

    return NextResponse.json({ message: "Korisnik i svi podaci obrisani" });
  } catch (error) {
    console.error("Greška pri brisanju:", error);
    return NextResponse.json({ error: "Neuspešno brisanje" }, { status: 500 });
  }
}