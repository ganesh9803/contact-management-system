import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage('Please enter a strong password with at least 6 characters');
      return;
    }
    setErrorMessage(''); // Reset error message
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setIsLogin(true); // Switch to login view after successful registration
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Contacts Management System</h2>
      <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>

      {isLogin ? (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleLogin}>
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
            type="submit"
          >
            Login
          </button>
        </form>
      ) : (
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleRegister}>
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {errorMessage && (
            <p className="text-red-600 mb-4">{errorMessage}</p>
          )}
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
            type="submit"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
}
