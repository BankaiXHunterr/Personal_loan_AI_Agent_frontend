import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aspen — Personal Loans',
  description: 'Your preapproved personal loan with a live AI assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
