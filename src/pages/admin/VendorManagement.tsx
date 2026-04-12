import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function VendorManagement() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/admin/vendors/${id}/approve`, { 
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('Vendor approved');
        fetchVendors();
      }
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.businessName}</TableCell>
                <TableCell>{vendor.businessType}</TableCell>
                <TableCell>{vendor.user.name}</TableCell>
                <TableCell>
                  <Badge variant={vendor.isApproved ? "default" : "secondary"}>
                    {vendor.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm"><Eye size={16} /></Button>
                  {!vendor.isApproved && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-200"
                        onClick={() => handleApprove(vendor.id)}
                      >
                        <CheckCircle2 size={16} className="mr-1" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                        <XCircle size={16} className="mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {vendors.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No vendors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
