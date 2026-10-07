import { dbConnect } from "@/lib/db";
import { Product } from "@/lib/models";
import { requireWebAdmin } from "@/lib/auth";
export async function GET() {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  await dbConnect(); return Response.json(await Product.find().populate("categoryId").sort({createdAt:-1}).lean());
}
export async function POST(req: Request) {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  await dbConnect(); return Response.json(await Product.create(await req.json()));
}
export async function PUT(req: Request) {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  const body = await req.json(); const { id, ...data } = body;
  await dbConnect(); return Response.json(await Product.findByIdAndUpdate(id, data, {new:true}));
}
export async function DELETE(req: Request) {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  const id = new URL(req.url).searchParams.get("id");
  await dbConnect(); await Product.findByIdAndDelete(id); return Response.json({ok:true});
}
