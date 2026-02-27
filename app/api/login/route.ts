import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "Korisnik nije pronađen!" }, { status: 401 });
    }

    // Provera heširane lozinke
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Pogrešna lozinka!" }, { status: 401 });
    }

    // --- POSTAVLJANJE KOLAČIĆA ---
    const cookieStore = await cookies();
    
    // Postavljamo kolačić 'auth_user_id' koji sadrži ID korisnika
    cookieStore.set('auth_user_id', user.id.toString(), {
      httpOnly: true,    // Zaštita: JavaScript na frontendu ne može da vidi ovaj kolačić
      secure: process.env.NODE_ENV === 'production', // Samo preko HTTPS u produkciji
      maxAge: 60 * 60 * 24, // Kolačić važi 24 sata
      path: '/',         // Dostupan na celom sajtu
      sameSite: 'lax'    // Osnovna zaštita od CSRF napada
    });

    return NextResponse.json({
      message: "Login uspešan!",
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ error: "Serverska greška!" }, { status: 500 });
  }
}