import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextUIProviders, ReactQueryProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-application">
      <body className={inter.className}>
        <ReactQueryProviders>
          <NextUIProviders>
            <div className="flex flex-col gap-12">{children}</div>
          </NextUIProviders>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
