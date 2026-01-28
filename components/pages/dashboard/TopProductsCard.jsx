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
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} active avatar={{ shape: 'square' }} paragraph={{ rows: 1 }} />
          ))}
        </div>
      ) : !data?.length ? (
        <div className="flex flex-1 items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
          <Empty description="No products found" />
        </div>
      ) : (
        <div className="max-h-[380px] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
          {data?.map((product) => (
            <div key={product.productId} className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                <Image
                  src={product.imageUrl || '/shared/plant-sm.svg'}
                  fill
                  className="object-cover"
                  alt={product.productName}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{product.productName}</div>
                <div className="text-xs text-gray-500">{product.unitsSold} units sold</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">AED {product.revenue?.toLocaleString()}</div>
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
