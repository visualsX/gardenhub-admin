'use client';

import { Menu } from 'antd';
import SidebarLabel from './sidebar-label';
import { usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import Tx from '../tx';
import { SidebarIcons, LogoutIcon } from '@/lib/const/icons';
import { useLogout } from '@/hooks/useAuth';
import { LogoTemp, CrossRed, EditGreen } from '@/lib/const/icons';

const positionSider = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  zIndex: 50,
};

const Sidebar = () => {
  const pathname = usePathname();
  const logout = useLogout();

  const menuItems = [
    {
      key: '/',
      label: 'Dashboard',
      icon: <SidebarIcons.Dashboard className="h-6 w-6" />,
    },
    {
      key: 'products-menu',
      href: '/products',
      label: 'Products',
      icon: <SidebarIcons.Products className="h-6 w-6" />,
      children: [
        {
          key: '/products',
          label: 'View Products',
          icon: null,
        },
        {
          key: '/products/add',
          label: 'Add Product',
          icon: null,
        },
      ],
    },
    {
      key: '/category-and-subcategory',
      label: 'Category & Subcategory',
      icon: <SidebarIcons.Categories className="h-6 w-6" />,
    },
    {
      key: 'bundles-menu',
      href: '/bundles-and-deals',
      label: 'Bundles & Deals',
      icon: <SidebarIcons.Bundles className="h-6 w-6" />,
      children: [
        {
          key: '/bundles-and-deals',
          label: 'View Bundles',
          icon: null,
        },
        {
          key: '/bundles-and-deals/add',
          label: 'Add Bundles',
          icon: null,
        },
      ],
    },
    { key: '/inventory', label: 'Inventory', icon: <SidebarIcons.Inventory className="h-6 w-6" /> },
    { key: '/orders', label: 'Orders', icon: <SidebarIcons.Orders className="h-6 w-6" /> },
    { key: '/customers', label: 'Customers', icon: <SidebarIcons.Users className="h-6 w-6" /> },
    {
      key: '/coupons',
      label: 'Coupons & Promotions',
      icon: <SidebarIcons.Coupons className="h-6 w-6" />,
    },
    {
      key: '/reviews',
      label: 'Reviews & Feedback',
      icon: <SidebarIcons.Reviews className="h-6 w-6" />,
    },
    {
      key: '/analytics',
      label: 'Reports & Analytics',
      icon: <SidebarIcons.Reports className="h-6 w-6" />,
    },
    {
      key: '/roles',
      label: 'Roles & Permission',
      icon: <SidebarIcons.Admin className="h-6 w-6" />,
    },
    { key: '/settings', label: 'Settings', icon: <SidebarIcons.Settings className="h-6 w-6" /> },
  ];

  const renderMenuItems = (items) =>
    items.map((item) => {
      const href = item.href ?? item.key;
      const active = pathname === href;
      return {
        key: item.key,
        label: <SidebarLabel href={href} label={item.label} Icon={item.icon} active={active} />,
        children: item.children ? renderMenuItems(item.children) : undefined,
      };
    });

  return (
    <div
      style={positionSider}
      className="border-smoke-light flex w-[263px]! flex-col justify-between bg-white pb-6 ltr:border-r ltr:border-l"
    >
      <div className="flex flex-col">
        <div className="border-smoke-light sticky top-0 z-10 flex h-16 items-center gap-x-3 border-b bg-transparent px-6 backdrop-blur-[3px]">
          <LogoTemp />
          <h1 className="text-primary text-2xl font-semibold">
            <Tx>Gardenhub</Tx>
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu
            className="px-4!"
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={['products-menu', 'bundles-menu']}
            items={renderMenuItems(menuItems)}
          />
        </div>
      </div>

      <section
        onClick={logout}
        className="flex cursor-pointer items-center gap-x-2 px-8 pt-4 text-sm text-red-500"
      >
        <LogoutIcon />
        <span>Logout</span>
      </section>
    </div>
  );
};

export default Sidebar;
