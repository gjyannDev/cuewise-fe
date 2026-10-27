import type { Metadata } from "next";
import "./globals.css";
import { inter, roboto_slab } from "@/lib/font";

export const metadata: Metadata = {
  title: "Cuewise",
  description: "You're AI Interview Coach",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_slab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
