"use client";

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { verifyUser, refreshToken } from '@/store/authSlice';
import { mergeCarts, fetchCart } from '@/store/slices/cartSlice';
import Swal from 'sweetalert2';

function GoogleCallbackInner() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const navigatedRef = useRef(false);

  const resolveRedirect = (role) => {
    // Prefer cookie, then localStorage, then role-based default
    let intended = null;
    try {
      // If backend appended redirect as query param, honor it first
      const qp = searchParams.get('redirect');
      if (qp) intended = qp;
    } catch (_) {}
    try {
      const cookies = document.cookie.split(';').map(c => c.trim());
      const found = cookies.find(c => c.startsWith('postAuthRedirect='));
      if (found) intended = decodeURIComponent(found.split('=')[1] || '');
    } catch (_) {}
    if (!intended) {
      try { intended = localStorage.getItem('postAuthRedirect'); } catch (_) {}
    }
    try {
      document.cookie = 'postAuthRedirect=; Max-Age=0; path=/';
      localStorage.removeItem('postAuthRedirect');
    } catch (_) {}

    if (intended) return intended;
    switch (role) {
      case 'superadmin': return '/superadmin/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'customer': return '/';
      default: return '/dashboard';
    }
  };

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: `Google authentication failed: ${error}`, confirmButtonColor: '#2563eb' });
      router.push('/login');
      return;
    }

    dispatch(verifyUser())
      .unwrap()
      .then(async (verifiedUser) => {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Logged in with Google', confirmButtonColor: '#2563eb' });
        try {
          await dispatch(mergeCarts(verifiedUser)).unwrap();
          // Ensure cart state is hydrated before redirecting
          await dispatch(fetchCart()).unwrap();
        } catch (mergeErr) {
          console.warn('Failed to merge/fetch cart after Google login:', mergeErr);
        }
        if (!navigatedRef.current) {
          router.replace(resolveRedirect(verifiedUser?.role));
          navigatedRef.current = true;
        }
      })
      .catch((err) => {
        console.error('Verify user error:', err);
        if (err === 'Invalid access token') {
          dispatch(refreshToken())
            .unwrap()
            .then(() => dispatch(verifyUser()).unwrap())
            .then(async (verifiedUser) => {
              Swal.fire({ icon: 'success', title: 'Success', text: 'Logged in with Google', confirmButtonColor: '#2563eb' });
              try {
                await dispatch(mergeCarts(verifiedUser)).unwrap();
                await dispatch(fetchCart()).unwrap();
              } catch (mergeErr) {
                console.warn('Failed to merge/fetch cart after Google login (refresh path):', mergeErr);
              }
              if (!navigatedRef.current) {
                router.replace(resolveRedirect(verifiedUser?.role));
                navigatedRef.current = true;
              }
            })
            .catch((refreshErr) => {
              console.error('Refresh token error:', refreshErr);
              Swal.fire({ icon: 'error', title: 'Error', text: 'Google authentication failed: Unable to refresh token', confirmButtonColor: '#2563eb' });
              router.push('/login');
            });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: `Google authentication failed: ${err}`, confirmButtonColor: '#2563eb' });
          router.push('/login');
        }
      });
  }, [dispatch, router, searchParams]);

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackInner />
    </Suspense>
  );
}
