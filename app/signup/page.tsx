'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password, 
          type: 'signup' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      // Store email in cookie (simple auth)
      Cookies.set('userEmail', data.email, { expires: 7 });
      
      toast.success('Account created successfully!');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
      toast.error(error.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  
  const getStrengthText = () => {
    if (formData.password.length === 0) return '';
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Medium';
    if (passwordStrength === 3) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    if (formData.password.length === 0) return 'bg-gray-200';
    if (passwordStrength === 0) return 'bg-red-500';
    if (passwordStrength === 1) return 'bg-orange-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-lime-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account to start blogging
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()}`} 
                        style={{ width: `${(passwordStrength + 1) * 25}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password strength: <span className="font-medium">{getStrengthText()}</span>
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mt-2">
                      <li className="flex items-center">
                        <span className={`inline-flex mr-1 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                          {formData.password.length >= 8 ? <Check className="h-3 w-3" /> : '•'}
                        </span>
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <span className={`inline-flex mr-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                          {/[A-Z]/.test(formData.password) ? <Check className="h-3 w-3" /> : '•'}
                        </span>
                        Contains uppercase letter
                      </li>
                      <li className="flex items-center">
                        <span className={`inline-flex mr-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                          {/[0-9]/.test(formData.password) ? <Check className="h-3 w-3" /> : '•'}
                        </span>
                        Contains number
                      </li>
                      <li className="flex items-center">
                        <span className={`inline-flex mr-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`}>
                          {/[^A-Za-z0-9]/.test(formData.password) ? <Check className="h-3 w-3" /> : '•'}
                        </span>
                        Contains special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                {formData.password && formData.confirmPassword && (
                  <div className="text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-green-600 flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Passwords match
                      </p>
                    ) : (
                      <p className="text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/signin" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign in
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled className="w-full">
              Google
            </Button>
            <Button variant="outline" type="button" disabled className="w-full">
              GitHub
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}