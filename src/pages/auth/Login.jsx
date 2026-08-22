import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Lock, Sparkles, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);
      if (res?.success) {
        notifySuccess('Welcome back to GlobeTrotter!');
        navigate(res.user?.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(res?.message || 'Invalid email address or password.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      const res = await loginAsDemo(role);
      setLoading(false);
      notifySuccess(`Logged in as ${role === 'admin' ? 'Administrator' : 'Demo Traveler'}`);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) {
      setLoading(false);
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    loginAsDemo('traveler');
    notifySuccess('Google authentication verified! Opening dashboard.');
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue planning your dream multi-city journeys."
    >
      {/* Demo Credentials Quick Fill Bar */}
      <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-left">
        <p className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          1-Click Demo Logins:
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('traveler')}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-indigo-100/50 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-2xs text-center"
          >
            🚀 Demo Traveler
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-indigo-100/50 text-slate-800 text-xs font-bold border border-slate-200 transition-colors shadow-2xs text-center flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Admin Demo
          </button>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs mb-4"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[10px] uppercase font-bold text-slate-400">or sign in with email</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="priya.sharma@globetrotter.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
          iconRight={ArrowRight}
        >
          Sign In to GlobeTrotter
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
