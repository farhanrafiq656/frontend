import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Home } from 'lucide-react';
import { signupSchema } from '../lib/validationSchemas';
import { useSignupMutation } from '../store/apiSlice';
import { setUser } from '../store/authSlice';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [signup, { isLoading }] = useSignupMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const user = await signup(data).unwrap();
      dispatch(setUser(user));
      toast.success('Account created! Welcome to Nestwell.');
      navigate('/');
    } catch (err) {
      toast.error(err.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#7B5328] rounded-xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="font-bold text-2xl text-[#1C1917]">Nestwell</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E7DDD5] p-8">
          <h1 className="text-2xl font-bold text-[#1C1917] mb-1">Create your account</h1>
          <p className="text-sm text-[#78716C] mb-7">Start your home journey with Nestwell</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Full Name</label>
              <input
                {...register('name')}
                placeholder="John Smith"
                className="w-full border border-[#E7DDD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] bg-white"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full border border-[#E7DDD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] bg-white"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="At least 8 characters"
                className="w-full border border-[#E7DDD5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] bg-white"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-brand py-3.5 text-base disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Get Started'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#78716C]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7B5328] hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
