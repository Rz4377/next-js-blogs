'use client';

import { Home, BookOpen, User, LogIn, LogOut, PenSquare, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Sidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | undefined>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client side
    setIsClient(true);
    setUserEmail(Cookies.get('userEmail'));
  }, []);

  const mainLinks = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/posts', icon: BookOpen, label: 'All Posts' },
    { href: '/posts/create', icon: PenSquare, label: 'Create Post' },
  ];
  
  const userLinks = userEmail
    ? [
        { href: '/profile', icon: User, label: 'Profile' },
        { href: '/favorites', icon: Heart, label: 'Favorites' },
        { href: '/bookmarks', icon: Star, label: 'Bookmarks' },
      ]
    : [{ href: '/signin', icon: LogIn, label: 'Sign In' }];

  const handleSignOut = () => {
    Cookies.remove('userEmail');
    window.location.href = '/';
  };

  if (!isClient) {
    return null; // Don't render anything on server 
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 bg-gradient-to-b from-indigo-900 to-purple-900 text-white lg:w-64 pt-16 z-40">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
            <div className="mb-8 px-4">
              <h2 className="text-lg font-semibold">Navigation</h2>
            </div>
            <nav className="flex-1 space-y-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      pathname === link.href
                        ? 'bg-indigo-700 text-white shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
                    } transition-all duration-200`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t border-indigo-700/50 my-5 pt-5 px-4">
                <h2 className="text-lg font-semibold mb-2">User</h2>
              </div>
              
              {userLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      pathname === link.href
                        ? 'bg-indigo-700 text-white shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
                    } transition-all duration-200`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
              
              {userEmail && (
                <button
                  onClick={handleSignOut}
                  className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-300 hover:bg-red-900/30 hover:text-white transition-all duration-200"
                >
                  <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                  Sign Out
                </button>
              )}
            </nav>
          </div>
          
          {userEmail && (
            <div className="p-4 border-t border-indigo-700/50">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate max-w-[180px]">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile footer navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
        <div className="flex justify-around">
          {mainLinks.slice(0, 3).map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center p-2 rounded-md ${
                  pathname === link.href
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            );
          })}
          
          <Link
            href={userEmail ? '/profile' : '/signin'}
            className={`flex flex-col items-center justify-center p-2 rounded-md ${
              pathname === (userEmail ? '/profile' : '/signin')
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">{userEmail ? 'Profile' : 'Sign In'}</span>
          </Link>
        </div>
      </div>
    </>
  );
}