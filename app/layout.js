import { Outfit } from 'next/font/google';
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
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
      <AntdRegistry>
        <body className={`${outfit.variable} antialiased`}>
          {children}
        </body>
      </AntdRegistry>
    </html>
  );
}
