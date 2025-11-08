import ProductIcon from '@/public/shared/sidebar/products.svg';
import Link from 'next/link';

export default function SidebarLabel({
  label = 'Nav Item',
  Icon = <ProductIcon className="h-6 w-6" />,
  href = '#',
  active,
}) {
  return (
    <Link href={href} className="font-outfit flex items-center gap-x-2">
      {Icon}
      <span>{label}</span>
    </Link>
  );
}
