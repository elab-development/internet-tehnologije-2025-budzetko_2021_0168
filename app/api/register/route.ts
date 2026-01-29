import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Provera da li korisnik već postoji
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email je već u upotrebi" }, { status: 400 });
    }

    // HEŠOVANJE
    // '10' je broj krugova enkripcije
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Upis u bazu sa hešovanom lozinkom
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Čuvamo heš, ne običnu lozinku
        role: "USER", // Podrazumevana uloga
      },
    });

    return NextResponse.json({ message: "Uspešna registracija", userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}