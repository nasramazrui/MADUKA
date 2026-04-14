import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'sonner';

export const useVendorProducts = (filters: any = {}) => {
  return useQuery({
    queryKey: ['vendor-products', filters],
    queryFn: async () => {
      const response = await api.get('/vendor/products', { params: filters });
      return response.data;
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/vendor/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create product');
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await api.put(`/vendor/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update product');
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/vendor/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      toast.success('Product deleted successfully');
    }
  });
};

export const useToggleProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/vendor/products/${id}/toggle`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    }
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendor-stats'],
    queryFn: async () => {
      const response = await api.get('/vendor/stats');
      return response.data;
    }
  });
};

export const useVendorProfile = () => {
  return useQuery({
    queryKey: ['vendor-profile'],
    queryFn: async () => {
      const response = await api.get('/vendor/profile');
      return response.data;
    }
  });
};

export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.put('/vendor/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      toast.success('Profile updated successfully');
    }
  });
};

export const useVendorOrders = (status?: string, limit?: number) => {
  return useQuery({
    queryKey: ['vendor-orders', status, limit],
    queryFn: async () => {
      const response = await api.get('/orders/vendor', { params: { status, limit } });
      return response.data;
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders'] });
      toast.success('Order status updated');
    }
  });
};

export const useVendorPrescriptions = () => {
  return useQuery({
    queryKey: ['vendor-prescriptions'],
    queryFn: async () => {
      const response = await api.get('/vendor/prescriptions');
      return response.data;
    }
  });
};

export const useUpdatePrescriptionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      const response = await api.patch(`/vendor/prescriptions/${id}`, { status, adminNotes });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-prescriptions'] });
      toast.success('Prescription status updated');
    }
  });
};
