import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await register(username, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
      <div className="brutal-card p-10 md:p-14 w-full max-w-md bg-white border-[4px] border-black shadow-[12px_12px_0px_#000]">

        <div className="text-center mb-10">
          <h2 className="font-display font-black uppercase text-4xl text-black mb-3 bg-[var(--accent-3)] inline-block px-4 shadow-[4px_4px_0px_#000] border-[3px] border-black">
            SUBSCRIBE
          </h2>

          <p className="text-black font-mono-bold mt-6">
            JOIN THE COLLECTIVE.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--accent-2)] border-[3px] border-black text-white font-mono-bold text-sm uppercase shadow-[4px_4px_0px_#000]">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-mono-bold uppercase text-black mb-2">
              Username
            </label>

            <input
              type="text"
              required
              className="input-field-brutal"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-mono-bold uppercase text-black mb-2">
              Email
            </label>

            <input
              type="email"
              required
              className="input-field-brutal"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-mono-bold uppercase text-black mb-2">
              Password
            </label>

            <input
              type="password"
              required
              className="input-field-brutal"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-mono-bold uppercase text-black mb-3">
              YOUR ROLE
            </label>

            <div className="grid grid-cols-2 gap-4">

              <label
                className={`cursor-pointer border-[3px] border-black p-4 text-center transition-all ${
                  role === 'reader'
                    ? 'bg-[var(--accent-1)] shadow-[4px_4px_0px_#000]'
                    : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="reader"
                  checked={role === 'reader'}
                  onChange={() => setRole('reader')}
                  className="hidden"
                />

                <span className="block font-display font-black uppercase text-black text-lg mb-1">
                  Reader
                </span>

                <span className="text-[10px] font-mono-bold uppercase text-black bg-white px-1 border border-black inline-block">
                  Observe
                </span>
              </label>

              <label
                className={`cursor-pointer border-[3px] border-black p-4 text-center transition-all ${
                  role === 'author'
                    ? 'bg-[var(--accent-2)] text-white shadow-[4px_4px_0px_#000]'
                    : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="author"
                  checked={role === 'author'}
                  onChange={() => setRole('author')}
                  className="hidden"
                />

                <span
                  className={`block font-display font-black uppercase text-lg mb-1 ${
                    role === 'author' ? 'text-white' : 'text-black'
                  }`}
                >
                  Author
                </span>

                <span
                  className={`text-[10px] font-mono-bold uppercase px-1 border border-black inline-block ${
                    role === 'author'
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                  }`}
                >
                  Create
                </span>
              </label>

            </div>
          </div>

          <button
            type="submit"
            className="btn-brutal btn-brutal-primary w-full mt-8 text-lg py-4"
          >
            INITIALIZE
          </button>

        </form>

        <p className="mt-8 text-center text-sm font-mono-bold text-black border-t-[3px] border-black pt-6">
          ALREADY A MEMBER?{' '}

          <Link
            to="/login"
            className="bg-black text-white px-2 py-1 hover:bg-[var(--accent-1)] hover:text-black transition-colors border-2 border-transparent hover:border-black"
          >
            LOGIN
          </Link>

        </p>

      </div>
    </div>
  );
}
