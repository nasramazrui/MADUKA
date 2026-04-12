import { Response } from 'express';
import { AuthRequest } from '../middleware/firebaseAuth.js';
import { prisma } from '../src/lib/prisma.js';

export const registerDriver = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      firebaseUid, 
      email, 
      phone, 
      name,
      firstName,
      lastName,
      nidaNumber,
      vehicleMake,
      vehicleModel,
      vehiclePlate,
      vehicleYear,
      vehicleColor,
      vehicleSeats,
      licenseExpiry,
      insuranceExpiry,
      insuranceCompany,
      offersTaxi,
      offersRental,
      region,
      district,
      ward,
      workRadius,
      lat,
      lng,
      address,
      workType,
      availability,
      payoutMethod,
      payoutPhone,
      payoutName,
      bankName,
      bankAccount,
      bankAccountName,
      payoutPreference
    } = req.body;

    // 1. Create or Update User
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: {
        role: 'DRIVER',
        name: name || `${firstName} ${lastName}`,
        phone: phone || undefined,
      },
      create: {
        firebaseUid,
        email,
        phone,
        name: name || `${firstName} ${lastName}`,
        role: 'DRIVER',
      }
    });

    // 2. Create Driver Profile
    const driver = await prisma.driver.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        nidaNumber,
        vehicleMake,
        vehicleModel,
        vehiclePlate,
        vehicleYear,
        vehicleColor,
        vehicleSeats,
        vehiclePhotos: {}, // Should be actual photos
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        insuranceCompany,
        offersTaxi,
        offersRental,
        region,
        district,
        ward,
        workRadius,
        baseLat: lat,
        baseLng: lng,
        address,
        workType,
        availabilitySchedule: availability || {},
        payoutMethod,
        payoutAccount: {
          phone: payoutPhone,
          name: payoutName,
          bankName,
          bankAccount,
          bankAccountName
        },
        payoutPreference,
        isApproved: false, // Must be approved by admin
        rentalFeatures: {},
      }
    });

    res.status(201).json({ ...user, driver });
  } catch (error: any) {
    console.error('Driver registration error:', error);
    res.status(500).json({ error: 'Failed to register driver', details: error.message });
  }
};

export const getDriverProfile = async (req: AuthRequest, res: Response) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { userId: req.user?.id },
      include: { user: true }
    });

    if (!driver) return res.status(404).json({ error: 'Driver profile not found' });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
};
