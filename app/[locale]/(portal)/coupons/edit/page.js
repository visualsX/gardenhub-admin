'use client';

import { useCoupon, useUpdateCoupon } from '@/hooks/useCoupon';
import CouponForm from '@/components/pages/coupons/CouponForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin } from 'antd';

export default function EditCouponPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const couponId = parseInt(searchParams.get('id'));
  
  const { data: coupon, isLoading } = useCoupon(couponId);
  const updateCoupon = useUpdateCoupon();

  const handleSubmit = async (values) => {
    await updateCoupon.mutateAsync({ id: couponId, data: values });
    router.push('/coupons');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Coupon not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
        <p className="mt-1 text-sm text-gray-600">Update coupon: {coupon.code}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <CouponForm
          initialValues={coupon}
          onSubmit={handleSubmit}
          isLoading={updateCoupon.isPending}
          mode="edit"
        />
      </div>
    </div>
  );
}
