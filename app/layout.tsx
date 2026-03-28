import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RutaViva – Descubre el mundo",
  description:
    "Explora los mejores lugares del mundo, guarda tus favoritos y genera itinerarios con IA.",
  openGraph: {
    title: "RutaViva – Descubre el mundo",
    description:
      "Explora los mejores lugares del mundo, guarda tus favoritos y genera itinerarios con IA.",
    siteName: "RutaViva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RutaViva – Descubre el mundo",
    description:
      "Explora los mejores lugares del mundo, guarda tus favoritos y genera itinerarios con IA.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Navbar user={session?.user ?? null} />
        <main className="pt-20" suppressHydrationWarning>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
