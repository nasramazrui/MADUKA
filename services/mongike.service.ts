import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MONGIKE_API_KEY = process.env.MONGIKE_API_KEY;
const MONGIKE_BASE_URL = process.env.MONGIKE_BASE_URL || 'https://mongike.com/api/v1';

export const initiateMongikePayment = async (data: {
  order_id: string;
  amount: number;
  buyer_phone: string;
  buyer_name: string;
  buyer_email?: string;
  fee_payer: 'MERCHANT' | 'BUYER';
  metadata?: any;
}) => {
  try {
    const response = await axios.post(
      `${MONGIKE_BASE_URL}/payments/mobile-money/tanzania`,
      data,
      {
        headers: {
          'x-api-key': MONGIKE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Mongike API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to initiate Mongike payment');
  }
};

export const getPaymentStatus = async (mongikeId: string) => {
  try {
    const response = await axios.get(
      `${MONGIKE_BASE_URL}/payments/${mongikeId}`,
      {
        headers: {
          'x-api-key': MONGIKE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Mongike Status Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch payment status');
  }
};
