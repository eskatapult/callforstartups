import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Call for Startups — Application",
  description:
    "Apply to the EAT × Katapult × Norrsken Global Call for Startups 2026. Built on the EAT-Lancet 2.0 scientific framework.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
