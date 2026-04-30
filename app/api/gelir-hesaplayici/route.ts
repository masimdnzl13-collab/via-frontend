import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Gelir hesaplayıcı servisi henüz hazır değil." });
}