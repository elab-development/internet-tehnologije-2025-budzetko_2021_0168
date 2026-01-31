import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    // Baza sama briše troškove/prihode zbog onDelete: Cascade
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Korisnik i njegovi podaci su obrisani" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Greška pri brisanju" }, { status: 500 });
  }
}