import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';

// ČITANJE KATEGORIJA
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
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

// PRAVLJENJE KATEGORIJE (Automatski dodeljuje ID-ju)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_user_id')?.value;

    if (!userId) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

    const body = await req.json();
    const { name, type } = body;

    const newCategory = await prisma.category.create({
      data: {
        name,
        type,
        userId: parseInt(userId) // Uzimamo ID iz kolačića, ne iz body-ja
      }
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: "Greška pri kreiranju kategorije!" }, { status: 500 });
  }
}

// BRISANJE KATEGORIJE (IDOR Zaštita)
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_user_id')?.value;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!userId) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    // Brišemo samo ako ID kategorije pripada ulogovanom korisniku
    const deleted = await prisma.category.deleteMany({
      where: { 
        id: parseInt(id),
        userId: parseInt(userId) 
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Kategorija nije pronađena ili nemate dozvolu" }, { status: 403 });
    }

    return NextResponse.json({ message: "Obrisano!" });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Kategorija se koristi u transakcijama. Prvo obrišite njih." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

// IZMENA KATEGORIJE (IDOR zaštita)
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth_user_id')?.value;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { name, type } = await req.json();

    if (!userId) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    // updateMany koristimo da bismo mogli da dodamo userId u uslov (IDOR zaštita)
    const updated = await prisma.category.updateMany({
      where: { 
        id: parseInt(id),
        userId: parseInt(userId)
      },
      data: { name, type }
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Nemate dozvolu ili kategorija ne postoji" }, { status: 403 });
    }

    return NextResponse.json({ message: "Ažurirano" });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}