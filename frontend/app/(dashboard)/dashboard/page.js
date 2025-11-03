'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { verifyUser, logout, refreshToken } from '@/store/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(verifyUser())
        .unwrap()
        .catch((error) => {
          console.error('Verify user error on dashboard:', error);
          if (error === 'Invalid access token') {
            dispatch(refreshToken())
              .unwrap()
              .then(() => dispatch(verifyUser()))
              .catch(() => router.push('/login'));
          } else {
            router.push('/login');
          }
        });
    }
  }, [dispatch, isAuthenticated, loading, router]);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => router.push('/login'));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.first_name}!</h2>
            <p>User ID: {user.user_id}</p>
            <p>Role ID: {user.role_id}</p>
            {user.profile_picture_url && (
              <img
                src={user.profile_picture_url}
                alt="Profile"
                className="w-16 h-16 rounded-full mt-4 mx-auto"
              />
            )}
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Redirecting...</p>
        )}
      </div>
    </div>
  );
}