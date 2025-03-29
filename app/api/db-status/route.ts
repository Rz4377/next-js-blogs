import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'connected', message: 'Database connection successful' });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed', error: String(error) },
      { status: 500 }
    );
  }
}