'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PostForm from '@/components/PostForm';

export default function CreatePostPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is logged in
    const userEmail = Cookies.get('userEmail');
    if (!userEmail) {
      router.push('/signin?redirect=/posts/create');
    }
  }, [router]);

  return <PostForm type="create" />;
}