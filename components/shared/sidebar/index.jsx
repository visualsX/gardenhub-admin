'use client';

import { Menu } from 'antd';
import ProductIcon from '@/public/shared/sidebar/products.svg';
import SidebarLabel from './sidebar-label';
import { usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import Tx from '../tx';

const positionSider = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      label: 'Dashboard',
      icon: <ProductIcon className="h-6 w-6" />,
    },
    { key: '/products', label: 'Products', icon: <ProductIcon className="h-6 w-6" /> },
    {
      key: '/category-and-subcategory',
      label: 'Category & Subcategory',
      icon: <ProductIcon className="h-6 w-6" />,
    },
    { key: '/bundles', label: 'Bundles & Deals', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/inventory', label: 'Inventory', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/orders', label: 'Orders', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/customers', label: 'Customers', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/coupons', label: 'Coupons & Promotions', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/reviews', label: 'Reviews & Feedback', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/analytics', label: 'Analytics', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/roles', label: 'Roles & Permission', icon: <ProductIcon className="h-6 w-6" /> },
    { key: '/settings', label: 'Settings', icon: <ProductIcon className="h-6 w-6" /> },
  ];

  const items = menuItems.map((item) => ({
    key: item.key,
    label: (
      <SidebarLabel
        href={item.key}
        label={item.label}
        Icon={item.icon}
        active={pathname === item.key}
      />
    ),
  }));

  return (
    <div
      style={positionSider}
      className="border-smoke-light w-[263px]! bg-white! ltr:border-r ltr:border-l"
    >
      <div className="flex items-center gap-x-3 px-4 pt-8 pb-5">
        <div className="bg-primary-light grid h-14 w-14 place-items-center rounded-xl">
          <Image src="/shared/logo.svg" width={27} height={27} alt="logo" />
        </div>
        <h1 className="text-primary text-2xl font-semibold">
          <Tx>Gardenhub</Tx>
        </h1>
      </div>
      <Menu className="px-4!" mode="inline" selectedKeys={[pathname]} items={items} />
    </div>
  );
};
export default Sidebar;
