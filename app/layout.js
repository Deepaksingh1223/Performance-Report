import "./globals.css";

export const metadata = {
  title: "Sales Pulse | Collection Performance",
  description:
    "October 2026 collection performance, team lap race, performers and league standings.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#122d32",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-page text-white antialiased">{children}</body>
    </html>
  );
}
