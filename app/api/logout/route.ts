import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ 
    message: "Uspešno ste odjavljeni sa servera" 
  }, { status: 200 });
}