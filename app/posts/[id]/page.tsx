'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Heart, Share2, MessageCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import ErrorHandlingImage from '@/components/ErrorHandlingImage';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [isDeleting, setIsDeleting] = useState(false);
  const userEmail = Cookies.get('userEmail');
  
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await res.json();
        setPost(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle like button
  const handleLike = () => {
    if (!userEmail) {
      toast.error('Please sign in to like posts');
      return;
    }
    
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
      toast.success('Post added to your likes!');
    }
    setIsLiked(!isLiked);
  };

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (!userEmail) {
      toast.error('Please sign in to delete posts');
      return;
    }
    
    if (confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/posts/${params.id}`, { 
          method: 'DELETE'
        });
        
        if (!res.ok) {
          throw new Error('Failed to delete post');
        }
        
        toast.success('Post deleted successfully');
        router.push('/');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete post');
        setIsDeleting(false);
      }
    }
  };

  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${params.id}`);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
        <ErrorHandlingImage
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            fallbackSrc="https://placehold.co/600x400/indigo/white?text=Blog+Post"
          />

        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">{post.title}</h1>
          
          {userEmail && (
            <div className="flex gap-2">
              <Link href={`/posts/${post._id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Clock className="h-4 w-4 mr-1" />
          <span>{post.createdAt ? formatDate(post.createdAt) : 'Unknown date'}</span>
        </div>
      </div>
      
      <Card className="p-6 mb-8">
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>
      
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex space-x-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500" disabled>
            <MessageCircle className="h-5 w-5 mr-2" />
            <span>{Math.floor(Math.random() * 15)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleShare}>
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Comments</h3>
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p>Comments are not implemented in this demo.</p>
        </div>
      </div>
    </div>
  );
}