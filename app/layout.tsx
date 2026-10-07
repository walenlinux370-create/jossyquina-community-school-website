import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jossyquina.co.mz"),
  title: { default: "Escola Comunitária Jossyquina", template: "%s | Jossyquina" },
  description: "Educação primária e secundária de qualidade em Mumemo 1, Marracuene.",
  openGraph: { type: "website", title: "Escola Comunitária Jossyquina", description: "Educação que transforma." },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-MZ"><body>{children}</body></html>;
}
