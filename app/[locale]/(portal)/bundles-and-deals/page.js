'use client';

import { Button, Badge } from 'antd';
import { PlusWhite } from '@/lib/const/icons';

export default function BundlesDealsPage() {
  const bundlesData = [
    {
      id: 1,
      title: 'Starter Garden Kit',
      productsCount: 3,
      price: 79.99,
      discount: 20,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=600&fit=crop',
    },
    {
      id: 2,
      title: 'Succulent Collection',
      productsCount: 5,
      price: 49.99,
      discount: 15,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=600&fit=crop',
    },
    {
      id: 3,
      title: 'Succulent Collection',
      productsCount: 5,
      price: 49.99,
      discount: 15,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=600&fit=crop',
    },
    {
      id: 4,
      title: 'Succulent Collection',
      productsCount: 5,
      price: 49.99,
      discount: 15,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=600&fit=crop',
    },
  ];

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">Bundles & Deals</h1>
            <p className="text-gray-600">Create and manage product bundles</p>
          </div>
          <Button type="primary" icon={<PlusWhite />}>
            Create Bundle
          </Button>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundlesData.map((bundle) => (
            <div
              key={bundle.id}
              className="border-smoke overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Bundle Image */}
              <div className="relative h-96 overflow-hidden rounded-xl bg-gray-100">
                <img src={bundle.image} alt={bundle.title} className="h-full w-full object-cover" />
              </div>

              {/* Bundle Info */}
              <div className="p-5">
                <h3 className="mb-2 text-base font-medium">{bundle.title}</h3>
                <p className="mb-4 text-base text-gray-600">
                  {bundle.productsCount} products • ${bundle.price.toFixed(2)}
                </p>

                {/* Footer: Discount & Status */}
                <div className="flex items-center justify-between">
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                    Save {bundle.discount}%
                  </span>
                  <span className="text-sm font-medium">{bundle.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
