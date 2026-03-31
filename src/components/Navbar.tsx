import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Create Song', to: '/create-song' },
  { label: 'Samples', to: '/samples' },
  { label: 'Pricing', to: '/#pricing' },
];

const authLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Admin', to: '/admin' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0c0f]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#6C4DFF] via-[#FF3B81] to-[#00D4FF]"></div>
          <div>
            <p className="text-lg font-semibold text-white">SongCraft AI</p>
            <p className="text-xs text-white/60">Design + Product System</p>
          </div>
        </div>
        <div className="hidden items-center gap-4 text-sm text-white/70 lg:flex">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${isActive ? 'bg-white/10 text-white' : 'hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${isActive ? 'bg-white/10 text-white' : 'hover:text-white'}`
              }
            >
              Dashboard
            </NavLink>
          )}
          {user && ['admin', 'operator'].includes(user.role) && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${isActive ? 'bg-white/10 text-white' : 'hover:text-white'}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">
                Welcome, {user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/create-song"
                className="rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#FF3B81] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
              >
                Create Your Song
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
