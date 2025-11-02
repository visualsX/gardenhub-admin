import Tx from '@/components/shared/tx';
import Link from 'next/link';
import './globals.css';
import YearNow from '@/components/shared/year-now';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      {/* Accent Circle */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="bg-primary-light h-[280px] w-[280px] rounded-full opacity-50 blur-3xl" />
      </div>

      {/* 404 Title */}
      <h1 className="text-primary text-[120px] leading-none font-extrabold sm:text-[160px]">404</h1>

      {/* Subtitle */}
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Page Not Found</h2>

      {/* Description */}
      <p className="mt-3 max-w-md text-center text-gray-500">
        <Tx>The page you're looking for doesn't exist or may have been moved.</Tx>
      </p>

      {/* Back Home Button */}
      <Link
        href="/"
        className="bg-primary hover:bg-primary-light hover:text-primary mt-8 rounded-full px-8 py-3 text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
      >
        <Tx>Go Back Home</Tx>
      </Link>

      {/* Footer note */}
      <p className="mt-10 text-xs text-gray-400">
        <Tx>
          © <YearNow /> GardenHub Admin
        </Tx>
      </p>
    </div>
  );
}
