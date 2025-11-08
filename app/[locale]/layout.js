import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Providers from '../providers';
import { App } from '@/theme/antd-provider';

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
          <App>{children}</App>
        </Providers>
      </NextIntlClientProvider>
    </main>
  );
}
