import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, roboto_slab } from "@/lib/font";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Cuewise",
  description: "You're AI Interview Coach",
};

// resizes-content: where supported (Android Chrome) the on-screen keyboard shrinks the layout, so full-height
// screens like the interview chat keep their composer above it. iOS Safari ignores it and pans instead.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_slab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
