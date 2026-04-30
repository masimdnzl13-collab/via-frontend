import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "İşbirliği Teklif API henüz hazır değil." });
}