'use client';

import React from 'react';
import { Button, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { PlusWhite } from '@/lib/const/icons';
import { useBundles } from '@/hooks/useBundle';

export default function BundlesDealsPage() {
  const router = useRouter();
  const { data, isLoading } = useBundles({ first: 50 }); // Fetch first 50 for now

  const bundlesData = data?.nodes || [];

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">Bundles & Deals</h1>
            <p className="text-gray-600">Create and manage product bundles</p>
          </div>
          <Button type="primary" icon={<PlusWhite />} onClick={() => router.push('/bundles-and-deals/add')}>
            Create Bundle
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bundlesData.length === 0 && (
          <div className="text-center p-12 text-gray-500">
            No bundles found. Create one to get started.
          </div>
        )}

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundlesData.map((bundle) => {
            const mainImage = bundle.images?.find(i => i.isMain)?.imageUrl || bundle.images?.[0]?.imageUrl;
            const productCount = bundle.items ? bundle.items.length : 0;

            return (
              <div
                key={bundle.id}
                onClick={() => router.push(`/bundles-and-deals/${bundle.id}`)}
                className="border-with-radius p-3 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              >
                {/* Bundle Image */}
                <div className="relative h-96 overflow-hidden rounded-xl bg-gray-100">
                  {mainImage ? (
                    <img src={mainImage} alt={bundle.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Bundle Info */}
                <div className="p-5">
                  <h3 className="mb-2 text-base font-medium">{bundle.name}</h3>
                  <p className="mb-4 text-base text-gray-600">
                    {productCount} products • ${bundle.bundlePrice?.toFixed(2)}
                  </p>

                  {/* Footer: Discount & Status */}
                  <div className="flex items-center justify-between">
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                      Save {bundle.discountPercentage}%
                    </span>
                    <span className={`text-sm font-medium ${bundle.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {bundle.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
