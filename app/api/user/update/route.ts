import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function PUT(req: Request) {
  try {
    // Dobijanje ID-ja iz sesije
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('auth_user_id')?.value;

    if (!userIdStr) {
      return NextResponse.json({ message: 'Niste prijavljeni' }, { status: 401 });
    }

    const { name, newPassword } = await req.json();
    const userId = parseInt(userIdStr);

    const updateData: any = {};
    if (name) updateData.name = name;
    
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ message: 'Lozinka mora imati bar 6 karaktera' }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ 
      message: 'Uspešno ažurirano!',
      user: { name: updatedUser.name } 
    });

  } catch (error: any) {
    console.error("KRITIČNA GREŠKA:", error);
    return NextResponse.json({ 
      message: 'Greška na serveru', 
      details: error.message 
    }, { status: 500 });
  }
}