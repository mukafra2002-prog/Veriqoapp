import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { processGoogleAuth } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleAuth = async () => {
      // Extract session_id from URL fragment
      const hash = location.hash;
      const sessionIdMatch = hash.match(/session_id=([^&]+)/);
      
      if (!sessionIdMatch) {
        toast.error('Authentication failed');
        navigate('/login');
        return;
      }

      const sessionId = sessionIdMatch[1];

      try {
        const userData = await processGoogleAuth(sessionId);
        toast.success(`Welcome, ${userData.name}!`);
        navigate('/home', { state: { user: userData } });
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center" data-testid="auth-callback">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Signing you in...</p>
      </div>
    </div>
  );
}
