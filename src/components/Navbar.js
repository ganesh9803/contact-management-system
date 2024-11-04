import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter(); // Use Next.js router for navigation

  const handleLogout = () => {
      localStorage.removeItem('token'); // Remove the token
      router.push('/'); // Navigate to the login page  
  };

  return (
    <nav className="bg-gray-800 p-4 mb-2">
      <div className="flex justify-between items-center">
      <Link href="/dashboard" className="text-white text-xl font-bold hover:text-gray-300">
          Contact Management System
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="text-white hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/profile" className="text-white hover:text-gray-300">
            Profile
          </Link>
          <Link href="/ContactList" className="text-white hover:text-gray-300">
            Contact List
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
