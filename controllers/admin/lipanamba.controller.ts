import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/firebaseAuth.js';
import { prisma } from '../../src/lib/prisma.js';

export const getAllLipaNamba = async (req: Request, res: Response) => {
  try {
    const lipaNamba = await prisma.lipaNamba.findMany({
      orderBy: { displayOrder: 'asc' }
    });
    res.json(lipaNamba);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Lipa Namba' });
  }
};

export const createLipaNamba = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, number, network, description, displayOrder } = req.body;
    const lipaNamba = await prisma.lipaNamba.create({
      data: {
        name,
        number,
        network,
        description,
        displayOrder: parseInt(displayOrder) || 0,
        createdBy: req.user.id
      }
    });
    res.status(201).json(lipaNamba);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Lipa Namba' });
  }
};

export const updateLipaNamba = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lipaNamba = await prisma.lipaNamba.update({
      where: { id },
      data: req.body
    });
    res.json(lipaNamba);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Lipa Namba' });
  }
};

export const deleteLipaNamba = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lipaNamba.delete({ where: { id } });
    res.json({ message: 'Lipa Namba deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Lipa Namba' });
  }
};

export const toggleLipaNamba = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const current = await prisma.lipaNamba.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Not found' });

    const lipaNamba = await prisma.lipaNamba.update({
      where: { id },
      data: { isActive: !current.isActive }
    });
    res.json(lipaNamba);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle' });
  }
};
