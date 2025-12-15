'use client';

import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import BundleForm from '@/components/pages/bundles/BundleForm';
import { useCreateBundle } from '@/hooks/useBundle';

export default function AddBundlePage() {
  const router = useRouter();
  const createBundle = useCreateBundle();

  const handleCreate = async (values) => {
    // console.log('Creating bundle:', values);
    createBundle.mutate(values);
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeft className="h-5 w-5" />}
            className="flex items-center"
            onClick={() => router.back()}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Bundle</h1>
            <p className="text-sm text-gray-500">Bundle products together and offer discounts</p>
          </div>
        </div>
      </div>

      <BundleForm onSubmit={handleCreate} isLoading={createBundle.isPending} mode="create" />
    </div>
  );
}
