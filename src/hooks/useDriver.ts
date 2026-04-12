import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/orders',
});

// Add interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await window.localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useAvailableOrders() {
  return useQuery({
    queryKey: ['driver', 'available-orders'],
    queryFn: async () => {
      const { data } = await api.get('/available');
      return data;
    },
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.put(`/${orderId}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'available-orders'] });
      queryClient.invalidateQueries({ queryKey: ['driver', 'active-order'] });
    },
  });
}

export function useActiveOrder() {
  return useQuery({
    queryKey: ['driver', 'active-order'],
    queryFn: async () => {
      const { data } = await api.get('/active');
      return data;
    },
  });
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const { data } = await api.put(`/${orderId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', 'active-order'] });
    },
  });
}
