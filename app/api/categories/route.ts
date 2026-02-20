import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

// ČITANJE KATEGORIJA
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "UserId je obavezan" }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri učitavanju!" }, { status: 500 });
  }
}

// PRAVLJENJE KATEGORIJE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, userId } = body;

    if (!userId) return NextResponse.json({ error: "Korisnik nije ulogovan" }, { status: 400 });

    const newCategory = await prisma.category.create({
      data: {
        name,
        type,
        userId: parseInt(userId)
      }
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri kreiranju kategorije!" }, { status: 500 });
  }
}

// BRISANJE KATEGORIJE 
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    await prisma.category.delete({
      where: { id: parseInt(id) } // Koristimo parseInt
    });

    return NextResponse.json({ message: "Obrisano!" });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Ne možete obrisati kategoriju koja se koristi. Prvo obrišite transakcije u njoj." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Došlo je do greške na serveru!" }, { status: 500 });
  }
}

// IZMENA KATEGORIJE
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { name, type } = await req.json();

    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const updated = await prisma.category.update({
      where: { id: parseInt(id) }, // OBAVEZNO parseInt ako je u bazi Int
      data: { name, type }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}