import { dbConnect } from "@/lib/db";
import { Category } from "@/lib/models";
import { requireWebAdmin } from "@/lib/auth";
export async function GET() {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  await dbConnect(); return Response.json(await Category.find().sort({name:1}).lean());
}
export async function POST(req: Request) {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  await dbConnect(); return Response.json(await Category.create(await req.json()));
}
export async function DELETE(req: Request) {
  try { await requireWebAdmin(); } catch { return Response.json({ error: "UNAUTHORIZED" }, { status: 401 }); }
  const id = new URL(req.url).searchParams.get("id");
  await dbConnect(); await Category.findByIdAndDelete(id); return Response.json({ok:true});
}
