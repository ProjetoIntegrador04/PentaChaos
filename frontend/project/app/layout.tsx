import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2RP Monitoring - Login',
  description: 'Entre na sua conta 2RP Monitoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}