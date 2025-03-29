'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Plus, TrendingUp } from 'lucide-react';
import ErrorHandlingImage from '@/components/ErrorHandlingImage';
import { toast } from 'sonner';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch posts
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);
  
  // Placeholder for featured post (first post or random post if available)
  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  
  // Get remaining posts
  const remainingPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/posts/${id}`, { 
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete post');
      }
      
      toast.success('Post deleted successfully');
      // Remove the post from state instead of reloading
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-500">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* Hero section */}
      <section className="relative py-12 mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Share Your Voice with the World
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Welcome to BlogSpace — where ideas come to life. Create, read, and engage with content that matters to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts/create">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
            <Link href="/posts">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Search className="mr-2 h-4 w-4" />
                Explore Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured post section */}
      {featuredPost && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Post</h2>
            <Link href="/posts" className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3">
                <ErrorHandlingImage
                  src={featuredPost.imageUrl || "https://placehold.co/600x400/indigo/white?text=Featured+Post"}
                  alt={featuredPost.title}
                  className="h-64 w-full object-cover md:h-full"
                  fallbackSrc="https://placehold.co/600x400/indigo/white?text=Featured+Post"
                />
              </div>
              <div className="p-8 md:w-2/3">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-xs font-medium">
                    Featured
                  </span>
                  <span className="mx-2">•</span>
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.content}</p>
                <div className="flex justify-between items-center">
                  <Link href={`/posts/${featuredPost._id}`}>
                    <Button>Read Full Article</Button>
                  </Link>
                  <div className="flex space-x-2">
                    <Link href={`/posts/${featuredPost._id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePost(featuredPost._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Topics - Just for aesthetics */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
          <h2 className="text-2xl font-bold">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Technology', 'Travel', 'Food', 'Lifestyle', 'Health', 'Business', 'Art', 'Science'].map((topic) => (
            <span 
              key={topic} 
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* All posts grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.length > 0 ? (
            remainingPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 mb-4">No more posts to display</p>
              <Link href="/posts/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {remainingPosts.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/posts">
              <Button variant="outline" className="px-8">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}