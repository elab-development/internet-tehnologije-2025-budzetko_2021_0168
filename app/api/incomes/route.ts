import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

// Pomoćna funkcija za proveru sesije
async function getAuthUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user_id')?.value;
  return userId ? parseInt(userId) : null;
}

export async function GET(req: Request) {
  try {
    // AUTENTIFIKACIJA: Čitamo ID iz kolačića
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });

    const incomes = await prisma.income.findMany({
      where: { userId: userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(incomes);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri učitavanju" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Niste autorizovani" }, { status: 401 });

    const { description, amount, categoryId } = await req.json();

    const newIncome = await prisma.income.create({
      data: {
        description,
        amount: parseFloat(amount),
        userId: userId,
        categoryId: parseInt(categoryId)
      }
    });

    return NextResponse.json(newIncome, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čuvanju prihoda!" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!userId || !id) return NextResponse.json({ error: "Podaci nedostaju" }, { status: 401 });

    // Brišemo samo ako prihod pripada ulogovanom korisniku
    const deleted = await prisma.income.deleteMany({
      where: {
        id: parseInt(id),
        userId: userId
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Nemate dozvolu ili prihod ne postoji" }, { status: 403 });
    }

    return NextResponse.json({ message: "Obrisano!" });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri brisanju" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getAuthUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { description, amount, categoryId } = await req.json();

    if (!userId || !id) return NextResponse.json({ error: "Niste autorizovani" }, { status: 401 });

    // updateMany koristimo da bismo filtrirali po vlasniku
    const updated = await prisma.income.updateMany({ 
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

    if (updated.count === 0) {
      return NextResponse.json({ error: "Izmena nije dozvoljena" }, { status: 403 });
    }

    return NextResponse.json({ message: "Uspešno ažurirano" });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}