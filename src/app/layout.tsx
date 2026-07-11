import type { Metadata } from "next";
import { Geist, Geist_Mono, Lilita_One } from "next/font/google";
import { AppGoogleOAuthProvider } from "@/components/auth/google-oauth-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  variable: "--font-lilita-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  applicationName: "Console Mark",
  title: "Console Mark",
  description: "The trusted marketplace for Play Console Publishers",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Console Mark",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${lilitaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppGoogleOAuthProvider>{children}</AppGoogleOAuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
