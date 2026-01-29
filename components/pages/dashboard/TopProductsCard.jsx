import React from 'react';
import { Skeleton, Empty } from 'antd';
import Image from 'next/image';
import Badge from '@/components/ui/badge';
import DashboardCard from './DashboardCard';

const TopProductsCard = ({ data, loading }) => {
  const extra = (
    <button className="text-xs font-semibold text-green-700 hover:text-green-800">View All</button>
  );

  return (
    <DashboardCard title="Top Products" extra={extra}>
      {loading ? (
        <div className="space-y-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} active avatar={{ shape: 'square' }} paragraph={{ rows: 1 }} />
            ))}
        </div>
      ) : !data?.length ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-100">
          <Empty description="No products found" />
        </div>
      ) : (
        <div className="custom-scrollbar max-h-[380px] space-y-5 overflow-y-auto pr-2">
          {data?.map((product) => (
            <div key={product.productId} className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                <Image
                  src={product.imageUrl || '/shared/plant-sm.svg'}
                  fill
                  className="object-cover"
                  alt={product.productName}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">
                  {product.productName}
                </div>
                <div className="text-xs text-gray-500">{product.unitsSold} units sold</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  AED {product.revenue?.toLocaleString()}
                </div>
                <div className="mt-1">
                  <Badge variant={product.stockStatus === 'InStock' ? 'success' : 'warning'}>
                    {product.stockStatus === 'InStock' ? 'In Stock' : 'Low Stock'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

export default TopProductsCard;
