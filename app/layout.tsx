import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Building Display Panel',
  description: 'A display dashboard showing time, calendar, weather, and building map',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        {/* The children below will be whatever page (in this case page.tsx) renders */}
        {children}
      </body>
    </html>
  );
}