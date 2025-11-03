'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { verifyUser, refreshToken } from '@/store/authSlice';
import Swal from 'sweetalert2';

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Google authentication failed: ${error}`,
        confirmButtonColor: '#2563eb',
      });
      router.push('/login');
      return;
    }

    dispatch(verifyUser())
      .unwrap()
      .then((verifiedUser) => {
        // verifiedUser is the latest user object from backend
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Logged in with Google',
          confirmButtonColor: '#2563eb',
        });

        // 🔥 Role-based routing handled immediately using fresh user data
        switch (verifiedUser.role) {
          case 'customer':
            router.push('/');
            break;
          case 'superadmin':
            router.push('/superadmin/dashboard');
            break;
          case 'admin':
            router.push('/admin/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      })
      .catch((err) => {
        console.error('Verify user error:', err);
        if (err === 'Invalid access token') {
          dispatch(refreshToken())
            .unwrap()
            .then(() => dispatch(verifyUser()).unwrap())
            .then((verifiedUser) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Logged in with Google',
                confirmButtonColor: '#2563eb',
              });

              switch (verifiedUser.role) {
                case 'customer':
                  router.push('/');
                  break;
                case 'superadmin':
                  router.push('/superadmin/dashboard');
                  break;
                case 'admin':
                  router.push('/admin/dashboard');
                  break;
                default:
                  router.push('/dashboard');
              }
            })
            .catch((refreshErr) => {
              console.error('Refresh token error:', refreshErr);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Google authentication failed: Unable to refresh token',
                confirmButtonColor: '#2563eb',
              });
              router.push('/login');
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Google authentication failed: ${err}`,
            confirmButtonColor: '#2563eb',
          });
          router.push('/login');
        }
      });
  }, [dispatch, router, searchParams]);

  return <div>Loading...</div>;
}
