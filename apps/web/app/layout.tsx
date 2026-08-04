import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeStyles } from "@/components/theme-styles";
import { getPublicSeoSettings } from "@/actions/seo-action";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublicSeoSettings();

  return {
    title: seo?.metaTitle ?? "",
    description: seo?.metaDescription ?? "",
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? "",
      description: seo?.ogDescription ?? seo?.metaDescription ?? "",
      images: seo?.ogImageKey ? [{ url: seo.ogImageKey }] : [],
      type: "website",
    },
    verification: seo?.googleSearchConsoleVerification
      ? { google: seo.googleSearchConsoleVerification }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getPublicSeoSettings();

  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body className={`${montserrat.variable} ${montserrat.className} antialiased`}>
        {seo?.gtmContainerId && (
          <GoogleTagManager gtmId={seo.gtmContainerId} />
        )}

        <QueryProvider>
          <ThemeStyles>
            <ThemeProvider>{children}</ThemeProvider>
          </ThemeStyles>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
