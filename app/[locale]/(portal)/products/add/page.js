import React from 'react';
import AddProductClient from '@/components/pages/products/AddProductClient';
import { getCategoriesDropdown } from '@/lib/api/ssr-calls/category';

export default async function ProductAddPage() {
  const categories = await getCategoriesDropdown();

  return <AddProductClient categories={categories} />;
}
