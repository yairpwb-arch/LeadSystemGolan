import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ניהול לידים",
  description: "כלי פנימי לניהול לידים ומעקב חזרות",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
