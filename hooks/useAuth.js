import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

// Login
export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
      return response;
    },
    onSuccess: (data) => {
      // Store token in cookie (24 hours)
      // document.cookie = `token=${data.token};

      message.success('Login successful!');
      router.push('/');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Login failed');
    },
  });
};

// Logout
export const useLogout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear your auth token from cookies/localStorage
    localStorage.removeItem('token');
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Navigate to login
    router.replace('/auth/login');
  };

  return handleLogout;
};

// // Get current user
// export const useCurrentUser = () => {
//   return useQuery({
//     queryKey: ['currentUser'],
//     queryFn: async () => {
//       const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
//       return response.data;
//     },
//     retry: false,
//   });
// };

// // Register
// export const useRegister = () => {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (data) => {
//       const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
//       return response;
//     },
//     onSuccess: (data) => {
//       document.cookie = `token=${data.token}; path=/; max-age=86400`;
//       message.success('Registration successful!');
//       router.push('/dashboard');
//     },
//     onError: (error) => {
//       message.error(error.response?.data?.message || 'Registration failed');
//     },
//   });
// };

// // Forgot password
// export const useForgotPassword = () => {
//   return useMutation({
//     mutationFn: async (data) => {
//       const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
//       return response;
//     },
//     onSuccess: () => {
//       message.success('Password reset email sent!');
//     },
//     onError: (error) => {
//       message.error(error.response?.data?.message || 'Failed to send reset email');
//     },
//   });
// };
