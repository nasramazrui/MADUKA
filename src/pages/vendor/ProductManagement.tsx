import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/vendor/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const token = await getToken();
      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price as string),
          stockQty: parseInt(data.stockQty as string),
          images: JSON.stringify([`https://picsum.photos/seed/${data.name}/400/400`]),
          categoryId: 'default-category' // In a real app, use actual categories
        }),
      });

      if (response.ok) {
        toast.success('Product added successfully');
        setIsAddOpen(false);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} className="mr-2" /> Add Product
            </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (TZS)</Label>
                  <Input id="price" name="price" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQty">Stock Quantity</Label>
                  <Input id="stockQty" name="stockQty" type="number" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" required />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Save Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={JSON.parse(product.images)[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>TZS {product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stockQty}</TableCell>
                <TableCell>
                  <Badge variant={product.isAvailable ? "default" : "secondary"}>
                    {product.isAvailable ? "Available" : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                  <Button variant="ghost" size="sm" className="text-red-600"><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No products found. Add your first product!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
