import Sidebar from '@/components/shared/sidebar';
import Header from '@/components/shared/header';

export const metadata = {
  title: 'Gardenhub',
  description: 'Gardenhub lorem ipsum',
};

export default function RootLayout({ children }) {
  return (
    <div className="font-outfit bg-snow min-h-screen">
      <Sidebar />
      <Header />
      <main className="ml-[263px] px-6 pt-[90px] pb-6">{children}</main>
    </div>
  );
}
