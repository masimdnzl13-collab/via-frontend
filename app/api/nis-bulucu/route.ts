import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Niş Bulucu API henüz hazır değil." });
}