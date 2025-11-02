import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Providers from '../providers';
import { AntdProvider } from '@/theme/antd-provider';
import Sidebar from '@/components/shared/sidebar';

export const metadata = {
  title: 'Gardenhub',
  description: 'Gardenhub lorem ipsum',
};

export default async function RootLayout({ children, params }) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <NextIntlClientProvider lang={locale}>
        <Providers>
          <AntdProvider>
            <main className="font-outfit grid grid-cols-[263px_1fr]">
              <Sidebar />
              <section className="bg-snow">
                {/* <header className="light-shadow bg-white p-5">header</header> */}
                <main className="ltr:p-[24px_40px_24px_24px] rtl:p-[24px_24px_24px_40px]">
                  {children}
                </main>
              </section>
            </main>
          </AntdProvider>
        </Providers>
      </NextIntlClientProvider>
    </main>
  );
}
