import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJson } from '../lib/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await postJson<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
        '/auth/login',
        { email, password }
      );

      const allowedStaffRoles = ['admin', 'operator', 'lyrics_team', 'music_production', 'qa_team', 'support'];
      if (!allowedStaffRoles.includes(response.user.role)) {
        setError('Access denied. Staff account required (admin/operator/production/QA/support).');
        setLoading(false);
        return;
      }

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Force page reload so AuthContext picks up the new token
      window.location.href = '/admin';
    } catch (err: any) {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] bg-clip-text text-transparent">
              Express In Music
            </span>
            <span className="rounded-full bg-[#6C4DFF]/20 px-2 py-0.5 text-xs font-medium text-[#a48bff]">
              Admin
            </span>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Staff Login</h1>
          <p className="mt-2 text-sm text-white/50">Sign in with your admin or operator account</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@songcraft.ai"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#6C4DFF]/60 focus:outline-none focus:ring-1 focus:ring-[#6C4DFF]/40 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#6C4DFF]/60 focus:outline-none focus:ring-1 focus:ring-[#6C4DFF]/40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#6C4DFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5B3ECC] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In to Panel'}
            </button>
          </form>
        </div>

        {/* Role info */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/3 p-4 text-center">
          <p className="text-xs text-white/30">
            This portal is for admin and operations staff only.
          </p>
          <p className="mt-1 text-xs text-white/30">
            Customer login → <a href="/login" className="text-[#6C4DFF]/70 hover:text-[#6C4DFF]">songcraft.ai/login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
