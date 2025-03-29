'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Heart, Share2, MessageCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ErrorHandlingImage from './ErrorHandlingImage';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  // Handle like button
  const handleLike = () => {
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
    if (confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        await onDelete(post._id);
        toast.success('Post deleted successfully');
        // The component will be removed from the DOM by the parent component
      } catch (error) {
        toast.error('Failed to delete post');
        setIsDeleting(false);
      }
    }
  };

  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
        <ErrorHandlingImage
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            fallbackSrc="https://placehold.co/600x400/indigo/white?text=Blog+Post"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-xl font-bold text-white">{post.title}</h2>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <p className="text-gray-600 line-clamp-3">
          {truncateContent(post.content, 120)}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 p-4 pt-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 text-gray-500">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{Math.floor(Math.random() * 15)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 text-gray-500" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Link href={`/posts/${post._id}`}>
            <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
              Read More
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-end space-x-2 w-full">
          <Link href={`/posts/${post._id}/edit`}>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}