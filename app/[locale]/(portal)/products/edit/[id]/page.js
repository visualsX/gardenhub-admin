import React from 'react';
import EditProductClient from '@/components/pages/products/EditProductClient';
import { getCategoriesDropdown } from '@/lib/api/ssr-calls/category';

export default async function ProductEditPage() {
  const categories = await getCategoriesDropdown();

  return <EditProductClient categories={categories} />;
}
