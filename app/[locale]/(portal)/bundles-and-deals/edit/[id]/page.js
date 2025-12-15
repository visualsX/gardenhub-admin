'use client';

import React from 'react';
import { Button } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import BundleForm from '@/components/pages/bundles/BundleForm';
import { useBundle, useUpdateBundle } from '@/hooks/useBundle';

export default function EditBundlePage() {
  const router = useRouter();
  const { id } = useParams();

  // Fetch bundle details
  const { data, isLoading } = useBundle(+id);
  const updateBundle = useUpdateBundle();

  const handleUpdate = async (values) => {
    // console.log('Updating bundle:', values);
    updateBundle.mutate({ id: +id, data: values });
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Loading bundle data...</div>;
  }

  if (!data && !isLoading) {
    return <div className="p-12 text-center text-red-500">Bundle not found</div>;
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Bundle: {data.name}</h1>
            <p className="text-sm text-gray-500">Update bundle products and settings</p>
          </div>
        </div>
      </div>

      <BundleForm
        initialValues={data}
        onSubmit={handleUpdate}
        isLoading={updateBundle.isPending}
        mode="edit"
      />
    </div>
  );
}
