import { dbConnect } from "@/lib/db";
import { Settings } from "@/lib/models";

export async function POST() {
  await dbConnect();
  await Settings.updateOne(
    { key: "main" },
    { $setOnInsert: { key: "main", storeName: process.env.STORE_NAME || "ServicesId Store" } },
    { upsert: true }
  );
  return Response.json({ ok: true });
}
