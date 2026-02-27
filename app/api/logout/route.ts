import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // BRISANJE SESIJE: Uništavamo kolačić 'auth_user_id'
    cookieStore.delete('auth_user_id');

    return NextResponse.json({ 
      message: "Uspešno ste odjavljeni sa servera" 
    }, { status: 200 });
    
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return NextResponse.json({ error: "Greška pri odjavljivanju" }, { status: 500 });
  }
}