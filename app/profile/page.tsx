'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, Heart, Settings, LogOut, Image, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | undefined>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const email = Cookies.get('userEmail');
    if (!email) {
      router.push('/signin');
      return;
    }
    setUserEmail(email);

    // Fetch posts
    const fetchPosts = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, { 
        method: 'DELETE',
        cache: 'no-store'
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Remove post from state
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSignOut = () => {
    Cookies.remove('userEmail');
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-semibold">
            {userEmail?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold">{userEmail}</h1>
            <p className="text-indigo-100">Blogger</p>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/20"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-indigo-100 text-sm">Posts</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-indigo-100 text-sm">Followers</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-indigo-100 text-sm">Following</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full mb-8">
          <TabsTrigger value="posts" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Your Posts
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex-1">
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Posts</h2>
              <Link href="/posts/create">
                <Button variant="outline">
                  <Image className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              </Link>
            </div>
            
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <BookOpen className="h-12 w-12 text-gray-300" />
                  <CardTitle>No Posts Yet</CardTitle>
                  <CardDescription>
                    You haven't created any posts yet. Start sharing your thoughts with the world!
                  </CardDescription>
                  <Link href="/posts/create">
                    <Button>Create Your First Post</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorites</CardTitle>
              <CardDescription>
                Posts that you've liked will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <Heart className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You haven't liked any posts yet</p>
              <Link href="/">
                <Button variant="outline">Browse Posts</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Email Address</h3>
                <div className="flex items-center rounded-md border border-gray-200 p-2">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{userEmail}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Created</h3>
                <div className="flex items-center rounded-md border border-gray-200 p-2">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
              <Button onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}