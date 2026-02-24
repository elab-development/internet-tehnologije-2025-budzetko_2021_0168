import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Sva polja su obavezna!" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 6 karaktera!" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email je već u upotrebi!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // KREIRANJE KORISNIKA I KATEGORIJA U TRANSAKCIJI
    // Koristimo $transaction da bismo bili sigurni da ako nešto pukne kod kategorija,
    // ne ostane "polovično" napravljen korisnik.
    const result = await prisma.$transaction(async (tx) => {
      // Kreiraj korisnika
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "USER",
        },
      });

      // Kreiraj podrazumevane kategorije za tog korisnika
      const defaultCategories = [
        { name: "Plata 💵", type: "INCOME" as const, icon: "💵", userId: newUser.id },
        { name: "Honorara 💰", type: "INCOME" as const, icon: "💰", userId: newUser.id },
        { name: "Hrana 🍔", type: "EXPENSE" as const, icon: "🍔", userId: newUser.id },
        { name: "Prevoz 🚌", type: "EXPENSE" as const, icon: "🚌", userId: newUser.id },
        { name: "Stanarina 🏠", type: "EXPENSE" as const, icon: "🏠", userId: newUser.id },
        { name: "Zabava 🎭", type: "EXPENSE" as const, icon: "🎭", userId: newUser.id },
      ];

      await tx.category.createMany({
        data: defaultCategories,
      });

      return newUser;
    });

    return NextResponse.json({ 
      message: "Uspešna registracija sa početnim kategorijama!", 
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role
      } 
    }, { status: 201 });

  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}