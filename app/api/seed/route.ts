import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = [
      { name: 'Plata 💵', type: 'INCOME', icon: '💵' },
      { name: 'Bonus 🎁', type: 'INCOME', icon: '🎁' },
      { name: 'Džeparac 💸', type: 'INCOME', icon: '💸' },
      { name: 'Hrana 🍔', type: 'EXPENSE', icon: '🍔' },
      { name: 'Prevoz 🚗', type: 'EXPENSE', icon: '🚗' },
      { name: 'Stan 🏠', type: 'EXPENSE', icon: '🏠' },
      { name: 'Zabava 🎉', type: 'EXPENSE', icon: '🎉' },
      { name: 'Ostalo ⚙️', type: 'EXPENSE', icon: '⚙️' },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
    }

    return NextResponse.json({ message: "Kategorije ubačene! ✅" });
  } catch (error) {
    return NextResponse.json({ error: "Greška: " + error }, { status: 500 });
  }
}