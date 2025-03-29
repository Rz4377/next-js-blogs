import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// In app/api/posts/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newPost = await Post.create(body);
    
    // Return a proper JSON response
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create post' 
    }, { status: 500 });
  }
}