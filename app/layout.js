import { Outfit } from 'next/font/google';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Gardenhub',
  description: 'Gardenhub lorem ipsum',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
