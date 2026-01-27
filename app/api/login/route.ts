import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Tražimo korisnika u bazi samo preko email-a
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Ako korisnik ne postoji, odmah vraćamo grešku
    if (!user) {
      return NextResponse.json(
        { error: 'Pogrešan email ili lozinka!' },
        { status: 401 }
      );
    }

    // Poredimo unetu običnu lozinku sa hešom iz baze
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Pogrešan email ili lozinka!' }, 
        { status: 401 }
      );
    }

    // Ako je sve OK, vraćamo uspeh
    return NextResponse.json({
      message: 'Uspešna prijava',
      user: { id: user.id, name: user.name, email: user.email }
    });
    
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}