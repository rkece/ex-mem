import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ninaivagam AI — External Memory Intelligence',
  description: 'Your memory, beyond search. A proactive second memory layer for engineers and architects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-base text-text-primary antialiased selection:bg-gold/20 selection:text-gold">
        {children}
      </body>
    </html>
  );
}
