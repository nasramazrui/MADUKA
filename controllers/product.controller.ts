import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';
import { uploadImage } from '../services/cloudinary.service.js';

export const getVendorProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const { isAvailable, categoryId, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { vendorId: vendor.id };
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (categoryId) where.categoryId = String(categoryId);
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const { name, description, price, comparePrice, sku, stockQty, categoryId, isAvailable, variants } = req.body;
    
    // Handle images from multer (req.files)
    const files = req.files as any[];
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const url = await uploadImage(dataURI);
        imageUrls.push(url);
      }
    }

    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        name,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku,
        stockQty: parseInt(stockQty),
        categoryId,
        isAvailable: isAvailable === 'true' || isAvailable === true,
        images: imageUrls,
        variants: variants ? JSON.parse(variants) : [],
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const existingProduct = await prisma.product.findFirst({
      where: { id, vendorId: vendor.id }
    });

    if (!existingProduct) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, comparePrice, sku, stockQty, categoryId, isAvailable, variants, existingImages } = req.body;
    
    // Handle new images
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = existingImages ? JSON.parse(existingImages) : [];

    if (files && files.length > 0) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const url = await uploadImage(dataURI);
        imageUrls.push(url);
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        sku,
        stockQty: stockQty ? parseInt(stockQty) : undefined,
        categoryId,
        isAvailable: isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : undefined,
        images: imageUrls,
        variants: variants ? JSON.parse(variants) : undefined,
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const product = await prisma.product.findFirst({
      where: { id, vendorId: vendor.id }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { isAvailable: false }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const toggleProductAvailability = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id }
    });

    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const product = await prisma.product.findFirst({
      where: { id, vendorId: vendor.id }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isAvailable: !product.isAvailable }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Toggle Product Error:', error);
    res.status(500).json({ error: 'Failed to toggle product availability' });
  }
};
