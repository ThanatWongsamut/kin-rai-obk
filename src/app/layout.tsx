import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "กินไรดี? @ OBK | Kin Rai Dee at One Bangkok",
  description: "Spin the wheel to find your next meal at One Bangkok!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${kanit.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
