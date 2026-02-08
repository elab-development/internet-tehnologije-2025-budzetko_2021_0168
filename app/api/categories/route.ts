import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; // Koristi tvoju postojeću instancu

// ČITANJE KATEGORIJA (Samo moje + sistemske + Auto-seed)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // 1. AUTO-SEED: Provera i dodavanje osnovnih kategorija ako ih nema
    const defaultCategories = [
      { name: 'Hrana 🍔', type: 'EXPENSE' },
      { name: 'Plata 💵', type: 'INCOME' },
      { name: 'Stanarina 🏠', type: 'EXPENSE' },
      { name: 'Prevoz 🚌', type: 'EXPENSE' },
      { name: 'Zabava 🥂', type: 'EXPENSE' }
    ];

    for (const cat of defaultCategories) {
      const existing = await prisma.category.findFirst({
        where: { name: cat.name, userId: null }
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            name: cat.name,
            type: cat.type as any,
            userId: null
          }
        });
      }
    }

    // 2. Čitanje svih dostupnih kategorija
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: null }, // Sistemske
          { userId: userId ? parseInt(userId) : undefined } // Korisnikove
        ]
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Greška pri učitavanju" }, { status: 500 });
  }
}

// PRAVLJENJE KATEGORIJE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, userId } = body;

    const newCategory = await prisma.category.create({
      data: {
        name,
        type,
        userId: userId ? parseInt(userId) : null
      }
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri kreiranju" }, { status: 500 });
  }
}

// BRISANJE KATEGORIJE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "Obrisano" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    
    // Provera specifične Prisma greške za relacije (Foreign Key constraint)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Ne možete obrisati kategoriju koja se koristi. Prvo obrišite transakcije u njoj." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Došlo je do greške na serveru" }, { status: 500 });
  }
}