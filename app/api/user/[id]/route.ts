import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
 
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
 
    const user = await prisma.user.findUnique({
      where: { id: userId },

    });
 
    if (!user) {
      return NextResponse.json({ error: "Korisnik nije pronađen" }, { status: 404 });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
    const userId = parseInt(id);
 
    await prisma.user.delete({
      where: { id: userId },
    });
 
    return NextResponse.json({ message: "Korisnik i njegovi podaci su obrisani" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Greška pri brisanju" }, { status: 500 });
  }
}