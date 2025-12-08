'use client';

import { useCreateCoupon } from '@/hooks/useCoupon';
import CouponForm from '@/components/pages/coupons/CouponForm';
import { useRouter } from 'next/navigation';

export default function AddCouponPage() {
  const createCoupon = useCreateCoupon();
  const router = useRouter();

  const handleSubmit = async (values) => {
    await createCoupon.mutateAsync(values);
    router.push('/coupons');
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Coupon</h1>
        <p className="mt-1 text-sm text-gray-600">Add a new discount coupon to your store</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <CouponForm
          onSubmit={handleSubmit}
          isLoading={createCoupon.isPending}
          mode="create"
        />
      </div>
    </div>
  );
}
