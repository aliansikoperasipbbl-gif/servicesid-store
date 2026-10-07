import { dbConnect } from "@/lib/db";
import { Deposit, User } from "@/lib/models";
import crypto from "crypto";

function validSecret(req: Request, raw: string) {
  const secret = process.env.CASAKU_WEBHOOK_SECRET;
  if (!secret) return false;
  const supplied = req.headers.get("x-casaku-secret") || req.headers.get("x-webhook-secret") || "";
  if (supplied) return supplied === secret;
  // Fallback: some providers send HMAC signature.
  const signature = req.headers.get("x-casaku-signature") || "";
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (!validSecret(req, raw)) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = JSON.parse(raw);
  // Sesuaikan mapping field webhook Casaku bila berbeda.
  const reference = String(body.reference ?? body.data?.reference ?? body.merchant_ref ?? "");
  const status = String(body.status ?? body.data?.status ?? "").toUpperCase();

  if (!reference) return Response.json({ ok: false, error: "missing reference" }, { status: 400 });

  await dbConnect();
  const dep = await Deposit.findOne({ reference });
  if (!dep) return Response.json({ ok: false, error: "deposit not found" }, { status: 404 });
  if (dep.status === "PAID") return Response.json({ ok: true, duplicate: true });

  if (["PAID", "SUCCESS", "SETTLED", "COMPLETED"].includes(status)) {
    dep.status = "PAID";
    await dep.save();
    await User.updateOne({ telegramId: dep.telegramId }, { $inc: { balance: dep.amount } });
  } else if (["EXPIRED", "FAILED", "CANCELLED"].includes(status)) {
    dep.status = status === "EXPIRED" ? "EXPIRED" : "FAILED";
    await dep.save();
  }

  return Response.json({ ok: true });
}
