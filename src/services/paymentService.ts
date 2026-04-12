const MONGIKE_API_KEY = process.env.MONGIKE_API_KEY;
const MONGIKE_API_URL = "https://mongike.com/api/v1/payments/mobile-money/tanzania";

export interface MongikePaymentRequest {
  order_id: string;
  amount: number;
  buyer_phone: string;
  buyer_name: string;
  buyer_email?: string;
  fee_payer: "MERCHANT" | "BUYER";
  metadata?: any;
}

export const initiateMongikePayment = async (request: MongikePaymentRequest) => {
  if (!MONGIKE_API_KEY) {
    throw new Error("MONGIKE_API_KEY is not configured");
  }

  try {
    const response = await fetch(MONGIKE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MONGIKE_API_KEY,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Mongike payment initiation failed", error);
    throw error;
  }
};
