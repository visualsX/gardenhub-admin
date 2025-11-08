import Sidebar from '@/components/shared/sidebar';
import Header from '@/components/shared/header';

export const metadata = {
  title: 'Gardenhub',
  description: 'Gardenhub lorem ipsum',
};

export default function RootLayout({ children }) {
  return (
    <main className="font-outfit border-smoke-light grid grid-cols-[263px_1fr] border">
      <Sidebar />
      <section className="bg-snow min-h-screen">
        <Header />
        <main className="h-full ltr:p-[24px_40px_24px_24px] rtl:p-[24px_24px_24px_40px]">
          {children}
        </main>
      </section>
    </main>
  );
}
