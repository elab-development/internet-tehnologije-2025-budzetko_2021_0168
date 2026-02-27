import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetUserId = parseInt(id);

    // PROVERA AUTENTIFIKACIJE
    const cookieStore = await cookies();
    const authenticatedUserId = cookieStore.get('auth_user_id')?.value;

    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    // Korisnik može da vidi samo svoj profil
    if (parseInt(authenticatedUserId) !== targetUserId) {
      return NextResponse.json({ error: "Nemate dozvolu da vidite tuđi profil" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "Korisnik nije pronađen" }, { status: 404 });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: (user as any).balance || 0,
      badges: (user as any).badges || "" 
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Greška pri čitanju korisnika" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetUserId = parseInt(id);

    // PROVERA AUTENTIFIKACIJE
    const cookieStore = await cookies();
    const authenticatedUserId = cookieStore.get('auth_user_id')?.value;

    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    // Korisnik može da obriše SAMO svoj nalog
    if (parseInt(authenticatedUserId) !== targetUserId) {
      return NextResponse.json({ error: "Ne možete obrisati tuđi nalog!" }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    // LOGOUT NAKON BRISANJA: Brišemo i kolačić jer nalog više ne postoji
    cookieStore.delete('auth_user_id');

    return NextResponse.json({ message: "Vaš nalog je uspešno obrisan" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Greška pri brisanju" }, { status: 500 });
  }
}