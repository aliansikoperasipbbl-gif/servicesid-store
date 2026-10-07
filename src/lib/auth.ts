import { cookies } from "next/headers";

export function isTelegramAdmin(id: number | string) {
  const ids = (process.env.ADMIN_TELEGRAM_IDS || "")
    .split(",").map(x => x.trim()).filter(Boolean);
  return ids.includes(String(id));
}

export async function requireWebAdmin() {
  const store = await cookies();
  const ok = store.get("sid_admin")?.value === "1";
  if (!ok) throw new Error("UNAUTHORIZED");
}
