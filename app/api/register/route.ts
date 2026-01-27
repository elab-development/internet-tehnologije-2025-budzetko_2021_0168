import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Provera obaveznih polja
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Sva polja su obavezna!" },
        { status: 400 }
      );
    }

    // Pretvaramo lozinku u nečitljiv heš
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Upisujemo korisnika, ali sa KRIPTOVANOM lozinkom
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "Korisnik uspešno kreiran!", user: { name: newUser.name, email: newUser.email } },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("PRISMA ERROR:", error);

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