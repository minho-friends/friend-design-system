import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friend Tools Demo",
  description: "Design system demo via json-render",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
