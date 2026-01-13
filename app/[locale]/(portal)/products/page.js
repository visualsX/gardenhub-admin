import React from 'react';
import ProductManagementClient from '@/components/pages/products/ProductManagementClient';
import { getCategoriesDropdown } from '@/lib/api/ssr-calls/category';

export default async function ProductPage() {
  const categories = await getCategoriesDropdown();

  return <ProductManagementClient categories={categories} />;
}
