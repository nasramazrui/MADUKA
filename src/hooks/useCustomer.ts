import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from 'sonner';

export const useVendors = (type?: string) => {
  return useQuery({
    queryKey: ['vendors', type],
    queryFn: async () => {
      const response = await api.get('/api/vendors', { params: { type } });
      return response.data;
    }
  });
};

export const useVendorDetails = (id: string) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      const response = await api.get(`/api/vendors/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useProducts = (vendorId?: string, categoryId?: string) => {
  return useQuery({
    queryKey: ['products', vendorId, categoryId],
    queryFn: async () => {
      const response = await api.get('/api/products', { params: { vendorId, categoryId } });
      return response.data;
    }
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to place order');
    }
  });
};

export const useCustomerOrders = () => {
  return useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const response = await api.get('/api/orders/customer');
      return response.data;
    }
  });
};
