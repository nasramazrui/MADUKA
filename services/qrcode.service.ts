import QRCode from 'qrcode';
import { uploadImage } from './cloudinary.service.js';

export const generateQRCode = async (data: string) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#1A1A2E',
        light: '#FFFFFF',
      },
    });

    // Upload to Cloudinary
    const url = await uploadImage(qrDataUrl);
    return url;
  } catch (error) {
    console.error('QR Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
};
