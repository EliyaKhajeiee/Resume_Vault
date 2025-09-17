import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback - URL:', window.location.href);
        console.log('Auth callback - Search:', window.location.search);
        console.log('Auth callback - Hash:', window.location.hash);

        // For PKCE flow, use the full URL instead of just search params
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
          console.error('Auth callback error:', error);

          // Check if user is already authenticated
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            console.log('User already has session, redirecting...');
            toast.success('You are already signed in!');
            navigate('/');
            return;
          }

          // Check if this is just a URL visit without auth codes
          const urlParams = new URLSearchParams(window.location.search);
          const hasAuthCode = urlParams.has('code') || window.location.hash.includes('access_token');

          if (!hasAuthCode) {
            console.log('No auth code found, redirecting to home...');
            navigate('/');
            return;
          }

          toast.error('Email confirmation failed. The link may have expired.');
          navigate('/');
          return;
        }

        if (data?.session) {
          console.log('Auth callback successful, session created');
          toast.success('Email confirmed successfully! You are now signed in.');
          navigate('/');
        } else {
          console.log('Auth callback returned no session');
          toast.error('Email confirmation failed. Please try again.');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        toast.error('An unexpected error occurred.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirming your email...</h2>
          <p className="text-gray-600">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;