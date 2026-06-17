import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
      <div className="brutal-card p-10 md:p-14 w-full max-w-md bg-white border-[4px] border-black shadow-[12px_12px_0px_#000]">
        <div className="text-center mb-10">
          <h2 className="font-display font-black uppercase text-4xl text-black mb-3 bg-[var(--accent-1)] inline-block px-4 shadow-[4px_4px_0px_#000] border-[3px] border-black">LOGIN</h2>
          <p className="text-black font-mono-bold mt-6">ACCESS YOUR TERMINAL.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--accent-2)] border-[3px] border-black text-white font-mono-bold text-sm uppercase shadow-[4px_4px_0px_#000]">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-mono-bold uppercase text-black mb-2">Username</label>
            <input
              type="text"
              required
              className="input-field-brutal"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-mono-bold uppercase text-black mb-2">Password</label>
            <input
              type="password"
              required
              className="input-field-brutal"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-brutal btn-brutal-primary w-full mt-8 text-lg py-4">
            INITIATE
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-mono-bold text-black border-t-[3px] border-black pt-6">
          NO ACCOUNT?{' '}
          <Link to="/register" className="bg-black text-white px-2 py-1 hover:bg-[var(--accent-3)] hover:text-black transition-colors border-2 border-transparent hover:border-black">
            SUBSCRIBE
          </Link>
        </p>
      </div>
    </div>
  );
}
