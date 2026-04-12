import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/admin',
});

// Add interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await window.localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats');
      return data;
    },
  });
}

export function usePendingVerifications() {
  return useQuery({
    queryKey: ['admin', 'verifications'],
    queryFn: async () => {
      const { data } = await api.get('/verifications/pending');
      return data;
    },
  });
}

export function useVerifyVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'APPROVED' | 'REJECTED' }) => {
      const { data } = await api.put(`/verifications/vendor/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
    },
  });
}

export function useVerifyDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'APPROVED' | 'REJECTED' }) => {
      const { data } = await api.put(`/verifications/driver/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
    },
  });
}

export function usePaymentQueue() {
  return useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: async () => {
      const { data } = await api.get('/payments/queue');
      return data;
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/payments/${id}/verify`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
    },
  });
}
