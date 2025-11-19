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
      <main className="ml-[263px] pt-[100px] ltr:pr-10 ltr:pb-6 ltr:pl-6 rtl:pr-6 rtl:pb-6 rtl:pl-10">
        {children}
      </main>
    </div>
  );
}
