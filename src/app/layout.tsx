import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextUIProviders, ReactQueryProviders } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'You Together - 친구와 함께 동영상 시청',
  description:
    'You Together는 친구와 함께 YouTube 동영상을 실시간으로 시청하며 채팅할 수 있는 서비스입니다.',
  openGraph: {
    title: 'You Together - 친구와 함께 동영상 시청',
    description:
      'You Together는 친구와 함께 YouTube 동영상을 실시간으로 시청하며 채팅할 수 있는 서비스입니다.',
    siteName: 'You Together - 친구와 함께 동영상 시청',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-application">
      <body className={inter.className}>
        <ReactQueryProviders>
          <NextUIProviders>
            <div className="flex flex-col gap-12">{children}</div>
            <ToastContainer />
          </NextUIProviders>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
