import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ČITANJE KATEGORIJA (Samo moje + sistemske)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

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
    return NextResponse.json({ error: "Greška pri učitavanju" }, { status: 500 });
  }
}

// PRAVLJENJE KATEGORIJE (Vezivanje za korisnika)
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ne možeš obrisati kategoriju koja se koristi u transakcijama" }, { status: 500 });
  }
}