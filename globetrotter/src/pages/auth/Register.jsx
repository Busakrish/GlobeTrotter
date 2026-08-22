import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import AuthLayout from '../../components/layout/AuthLayout';
import Input, { Select } from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Lock, User, ArrowRight, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    travelStyle: 'Balanced Explorer',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-sky-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      register(formData.email, formData.password, formData.name, formData.travelStyle);
      setLoading(false);
      notifySuccess('Account created! Welcome to GlobeTrotter.');
      navigate('/dashboard');
    }, 400);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GlobeTrotter to personalize, plan, and budget multi-city journeys."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Full Name"
          type="text"
          icon={User}
          placeholder="Priya Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="priya.sharma@globetrotter.io"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="••••••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">Password Strength</span>
              <span className="text-slate-800 font-bold">{strength.label}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>
        )}

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="••••••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        <Select
          label="Default Travel Style"
          value={formData.travelStyle}
          onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
          options={[
            { value: 'Balanced Explorer', label: 'Balanced Explorer (Value & Comfort)' },
            { value: 'Backpacker', label: 'Backpacker (Budget & Hostels)' },
            { value: 'Luxury Heritage', label: 'Luxury Heritage (Palaces & Resorts)' },
            { value: 'Solo Adventurer', label: 'Solo Adventurer (Flexible & Fast)' },
          ]}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer select-none">
            I agree to the <Link to="/about" className="text-indigo-600 font-semibold underline">Terms of Service</Link> and <Link to="/about" className="text-indigo-600 font-semibold underline">Privacy Policy</Link>.
          </label>
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
          Create Free Account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
