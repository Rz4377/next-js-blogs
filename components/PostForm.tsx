'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { PenSquare, Image as ImageIcon, Save, ArrowLeft, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import ErrorHandlingImage from './ErrorHandlingImage';

interface PostFormProps {
  post?: {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
  };
  type: 'create' | 'edit';
}

export default function PostForm({ post, type }: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    imageUrl: post?.imageUrl || '',
  });

  // Track character count for title and content
  const titleMaxLength = 100;
  const contentMaxLength = 5000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'create') {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error('Failed to create post');
        }

        toast.success('Post created successfully!');
      } else {
        const res = await fetch(`/api/posts/${post?._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error('Failed to update post');
        }

        toast.success('Post updated successfully!');
      }
      
      router.push('/');
      router.refresh();
      setTimeout(() => {
        router.push('/');
      }, 500);
  
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Preview image
  const imagePreview = formData.imageUrl || 'https://placehold.co/600x400/indigo/white?text=Preview+Image';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {type === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenSquare className="h-5 w-5 mr-2 text-indigo-600" />
              {type === 'create' ? 'Create New Post' : 'Edit Post'}
            </CardTitle>
            <CardDescription>
              {type === 'create' 
                ? 'Share your thoughts with the world' 
                : 'Update your post content'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} id="post-form" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title"
                  value={formData.title}
                  onChange={(e) => 
                    setFormData({ ...formData, title: e.target.value.slice(0, titleMaxLength) })
                  }
                  required
                  maxLength={titleMaxLength}
                  className="text-lg"
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${formData.title.length > titleMaxLength * 0.8 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {formData.title.length}/{titleMaxLength}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <Link2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Paste a URL for your post's cover image
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value.slice(0, contentMaxLength) })
                  }
                  required
                  className="min-h-[300px] resize-y"
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${formData.content.length > contentMaxLength * 0.9 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {formData.content.length}/{contentMaxLength}
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="post-form"
              disabled={isLoading || !formData.title || !formData.content || !formData.imageUrl}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {type === 'create' ? 'Creating...' : 'Updating...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  {type === 'create' ? 'Create Post' : 'Update Post'}
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Preview
            </CardTitle>
            <CardDescription>
              How your post will look
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border">
            <ErrorHandlingImage
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
              fallbackSrc="https://placehold.co/600x400/indigo/white?text=Preview+Image"
            />
          </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                {formData.title || 'Your Post Title'}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-4">
                {formData.content || 'Your post content will appear here. Start typing in the content field to see a preview.'}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <p>This is how your post will appear in the feed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}