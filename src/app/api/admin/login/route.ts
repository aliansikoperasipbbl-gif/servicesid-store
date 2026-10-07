import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: "Login salah" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sid_admin", "1", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
