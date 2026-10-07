/**
 * Casaku adapter.
 *
 * PENTING:
 * Endpoint/field pembayaran berbeda antar provider/akun.
 * File ini sengaja menjadi satu-satunya tempat yang perlu disesuaikan
 * berdasarkan dokumentasi API Casaku yang Anda gunakan.
 */
export type CasakuCreateResult = {
  gatewayId: string;
  qrText: string;
  qrImage?: string;
  expiresAt?: Date;
};

export async function createCasakuQR(input: {
  amount: number;
  reference: string;
  customerId: string;
}): Promise<CasakuCreateResult> {
  const base = process.env.CASAKU_BASE_URL;
  const path = process.env.CASAKU_CREATE_QR_PATH;
  const key = process.env.CASAKU_API_KEY;

  if (!base || !path || !key) {
    throw new Error("Konfigurasi Casaku belum lengkap.");
  }

  const response = await fetch(new URL(path, base), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      amount: input.amount,
      reference: input.reference,
      customer_id: input.customerId
    })
  });

  const raw = await response.text();
  if (!response.ok) throw new Error(`Casaku error ${response.status}: ${raw}`);

  const data = JSON.parse(raw);

  // Sesuaikan mapping ini dengan response JSON resmi Casaku.
  const gatewayId = data.id ?? data.data?.id ?? data.transaction_id;
  const qrText = data.qr_text ?? data.data?.qr_text ?? data.qr_string ?? data.data?.qr_string;
  const qrImage = data.qr_image ?? data.data?.qr_image ?? data.qr_url ?? data.data?.qr_url;

  if (!gatewayId || !qrText) {
    throw new Error("Response Casaku tidak cocok dengan adapter. Cek src/lib/casaku.ts.");
  }

  return {
    gatewayId: String(gatewayId),
    qrText: String(qrText),
    qrImage: qrImage ? String(qrImage) : undefined,
    expiresAt: data.expires_at ? new Date(data.expires_at) : new Date(Date.now() + 15 * 60 * 1000)
  };
}
