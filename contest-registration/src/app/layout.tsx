import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// The Inter font gives it that clean, modern FAANG look
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contest Arena | Register Now",
  description: "Register for the upcoming coding contest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // We add 'dark' to the html tag to force dark mode natively
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <main className="relative flex min-h-screen flex-col items-center justify-center">
          {/* Subtle background glow effect for a premium feel */}
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>

          {children}
        </main>

        {/* Mounts the elegant toast notifications */}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
