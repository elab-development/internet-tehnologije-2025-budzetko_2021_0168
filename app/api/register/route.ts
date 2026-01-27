import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Putanja do fajla koji smo malopre napravili

export async function POST(request: Request) {
  try {
    // 1. Preuzimamo podatke koje si poslala iz forme
    const body = await request.json();
    const { name, email, password } = body;

    // 2. Provera da li su sva polja popunjena
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Sva polja su obavezna!" },
        { status: 400 }
      );
    }

    // 3. Upisujemo korisnika u MySQL bazu preko Prisme
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password, // Napomena: U sledećoj fazi ćemo ovo hešovati (bcrypt)
        role: "USER",
      },
    });

    // 4. Ako je sve prošlo ok, šaljemo podatke nazad frontendu
    return NextResponse.json(
      { message: "Korisnik uspešno kreiran!", user: newUser },
      { status: 201 }
    );

  } catch (error: any) {
    // 5. Ako se desi greška (npr. isti email), ispisujemo je u terminalu
    console.error("PRISMA ERROR:", error);

    // Ako korisnik već postoji (P2002 je Prisma kod za "unique constraint")
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Korisnik sa ovim emailom već postoji." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Greška pri povezivanju sa bazom podataka." },
      { status: 500 }
    );
  }
}