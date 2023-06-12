import './globals.css'
import { Inter, Roboto_Slab } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

const robotoSlab = Roboto_Slab({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={robotoSlab.className}>{children}</body>
    </html>
  );
}
