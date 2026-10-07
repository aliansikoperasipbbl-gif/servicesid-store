import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "ServicesId Store", description: "Admin dashboard" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body>{children}</body></html>;
}
