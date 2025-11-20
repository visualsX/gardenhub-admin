import { Button } from 'antd';
import Link from 'next/link';
import ArrowLeft from '@/public/shared/arrow-left.svg';

export default function GoBack({ href = '#', title, desc }) {
  return (
    <div className="flex items-center gap-4">
      <Link href={href}>
        <Button icon={<ArrowLeft />} className="rounded-full border-gray-200" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
