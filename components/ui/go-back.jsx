import { Button } from 'antd';
import Link from 'next/link';
import ArrowLeft from '@/public/shared/arrow-left.svg';

export default function GoBack({ href = '#', title, desc }) {
  return (
    <Link className="flex items-center gap-4" href={href}>
      {href !== '#' && (
        <div className="border-smoke rounded-full border bg-white p-2.5">
          <ArrowLeft />
        </div>
      )}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-base text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}
