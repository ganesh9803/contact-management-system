// src/pages/profile.js

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profileRoute', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Failed to fetch user profile');
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
      <h1 className="text-2xl mb-4">Profile</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more user details as necessary */}
      </div>
      </div>
    </div>
  );
};

export default Profile;
