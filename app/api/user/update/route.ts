import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


/*export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, name, newPassword } = body;

    // 1. Provera da li korisnik postoji
    if (!email) {
      return NextResponse.json({ message: 'Email nedostaje' }, { status: 400 });
    }

    // 2. Priprema podataka za ažuriranje
    const updateData: any = {};
    if (name) updateData.name = name;

    // 3. Heširanje šifre (nikako ne čuvaj običan tekst!)
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // 4. Upis u bazu preko Prisme
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: updateData,
    });

    return NextResponse.json({ 
      message: 'Uspešno ažurirano', 
      userName: updatedUser.name 
    }, { status: 200 });

  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({ 
      message: 'Greška pri upisu u bazu', 
      error: error.message 
    }, { status: 500 });
  }
}*/

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, name, newPassword } = body;

    // Prvo proverimo da li korisnik uopšte postoji u bazi
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!userExists) {
      return NextResponse.json({ message: 'Korisnik nije pronađen u bazi' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Tek sada radimo update jer znamo da korisnik postoji
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: updateData,
    });

    return NextResponse.json({ message: 'Uspešno!' }, { status: 200 });

  } catch (error: any) {
    console.error("DETALJNA GRESKA:", error); // OVO POGLEDAJ U TERMINALU
    return NextResponse.json({ message: 'Baza odbija upis', error: error.message }, { status: 500 });
  }
}