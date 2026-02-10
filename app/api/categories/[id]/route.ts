import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;

    // PRETVARANJE U BROJ: Ako je u bazi ID tipa Int
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Neispravan ID format" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { 
        id: numericId // Ovde koristimo numericId umesto stringa
      },
    });

    return NextResponse.json({ message: "Kategorija uspešno obrisana!" });

  } catch (error: any) {
    console.error("Greška pri brisanju kategorije:", error);

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Ne možete obrisati kategoriju koja se koristi. Prvo obrišite transakcije u njoj." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Došlo je do greške na serveru." },
      { status: 500 }
    );
  }
}