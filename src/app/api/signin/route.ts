// app/api/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongodb';
import { verifyPassword } from '@/libs/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne({ username });
  if (!user) {
    return NextResponse.json({ message: 'User not found!' }, { status: 401 });
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return NextResponse.json({ message: 'Invalid password!' }, { status: 401 });
  }

  // Create a session or token here

  return NextResponse.json({ message: 'Sign in successful!' }, { status: 200 });
}
