import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CenterPort",
  description: "Healthcare and Maritime Management Platform",
};

/**
 * Application root layout.
 *
 * Sets up global fonts (Geist Sans + Mono), metadata, and the TooltipProvider
 * context that wraps all pages. Applies antialiased text rendering and
 * full-height layout constraints.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("centerport-theme");if(t==="sand"||t==="ocean"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","ocean")}}catch(e){document.documentElement.setAttribute("data-theme","ocean")}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}