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
        // Handle the auth callback from email confirmation
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.search);
        
        if (error) {
          console.error('Auth callback error:', error);
          // Try to get existing session as fallback
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session) {
            toast.success('Email confirmed successfully! You are now signed in.');
            navigate('/');
            return;
          }
          toast.error('Email confirmation failed. The link may have expired.');
          navigate('/');
          return;
        }

        if (data?.session) {
          toast.success('Email confirmed successfully! You are now signed in.');
          navigate('/');
        } else {
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