import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

async function getPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function deletePost(id: string) {
  'use server';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts/${id}`, { 
      method: 'DELETE',
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to delete post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Posts</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search posts..." 
              className="pl-10"
              disabled
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Link href="/posts/create">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={deletePost}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Posts Found</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              There are currently no posts available. Be the first to create a post!
            </p>
            <Link href="/posts/create">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}