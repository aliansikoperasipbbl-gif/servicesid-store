import { dbConnect } from "@/lib/db";
import { Settings } from "@/lib/models";
import { requireWebAdmin } from "@/lib/auth";

export async function GET() {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  await dbConnect();
  const s = await Settings.findOne({ key: "main" }).lean();
  return Response.json(s || {});
}
export async function PUT(req: Request) {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  const data = await req.json();
  await dbConnect();
  const s = await Settings.findOneAndUpdate({ key: "main" }, { $set: { ...data, key: "main" } }, { upsert: true, new: true });
  return Response.json(s);
}
