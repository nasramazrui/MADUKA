import QRCode from 'qrcode';

export const generateQRCode = async (data: string) => {
  try {
    const qrImage = await QRCode.toDataURL(data);
    return qrImage;
  } catch (error) {
    console.error('QR code generation failed', error);
    throw error;
  }
};
