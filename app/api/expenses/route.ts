import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET, POST i DELETE su ti dobri, fokusirajmo se na ispravku PATCH-a

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: "UserId is required" }, { status: 400 });

  const expenses = await prisma.expense.findMany({
    where: { userId: parseInt(userId) },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  try {
    const { description, amount, userId, categoryId } = await req.json();
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        userId: parseInt(userId),
        categoryId: parseInt(categoryId) // Osiguravamo da je Int
      }
    });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri čuvanju troška" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await prisma.expense.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ message: "Obrisano!" });
}

// ISPRAVLJEN PATCH
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { description, amount, categoryId } = body;

    if (!id) return NextResponse.json({ error: "ID nedostaje" }, { status: 400 });

    const updated = await prisma.expense.update({ 
      where: { 
        id: parseInt(id) 
      },
      data: { 
        description, 
        amount: parseFloat(amount), 
        // DODAJEMO PROVERU ZA CATEGORY ID
        categoryId: categoryId ? parseInt(categoryId) : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    // OVO ĆE TI U TERMINALU REĆI ŠTA JE STVARNI PROBLEM
    console.error("PRISMA ERROR:", error.message);
    return NextResponse.json({ error: "Greška pri ažuriranju: " + error.message }, { status: 500 });
  }
}