// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongodb';
import { hashPassword } from '@/libs/auth';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists!' }, { status: 422 });
  }

  const hashedPassword = await hashPassword(password);

  await db.collection('users').insertOne({
    username,
    password: hashedPassword,
  });

  return NextResponse.json({ message: 'User created!' }, { status: 201 });
}
