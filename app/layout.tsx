'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return a loading state until client-side code is ready
  if (!isClient) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Render the full layout once we're on the client
  return (
    <html lang="en">
      <head>
        <title>Blog Website</title>
        <meta name="description" content="A beautiful blog website built with Next.js" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="lg:pl-64">
            <Sidebar />
            <main className="py-10 pt-16">
              <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}