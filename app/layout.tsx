import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlogSpace - Share Your Thoughts',
  description: 'A beautiful blog website where you can share your ideas and stories',
  keywords: 'blog, writing, articles, posts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="lg:pl-64 pt-16">
              <Sidebar />
              <main className="py-6 pb-20 lg:pb-6">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
            <Toaster position="top-right" closeButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}