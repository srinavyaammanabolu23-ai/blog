import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-base)] border-b-[3px] border-black">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group hover:-translate-y-1 transition-transform">
          <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent-1)] text-black font-display font-bold text-2xl border-[3px] border-black shadow-[2px_2px_0px_#000]">
            B
          </div>
          <span className="text-2xl font-display uppercase tracking-tighter text-black">
            BlogFlow
          </span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          {user && (user.role === 'author' || user.role === 'admin') && (
            <Link
              to="/create"
              className="text-sm font-mono-bold uppercase tracking-widest hover:text-[var(--accent-2)] transition-colors"
            >
              Write
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l-[3px] border-black pl-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-xs font-mono-bold bg-[var(--accent-3)] text-black border-[2px] border-black shadow-[2px_2px_0px_#000]">
                  {user.username[0].toUpperCase()}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-mono-bold uppercase tracking-widest text-black hover:text-[var(--accent-2)] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-mono-bold uppercase tracking-widest hover:bg-[var(--accent-1)] px-3 py-1 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#000] transition-all">
                Sign In
              </Link>
              <Link to="/register" className="btn-brutal btn-brutal-primary text-xs">
                Subscribe
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
