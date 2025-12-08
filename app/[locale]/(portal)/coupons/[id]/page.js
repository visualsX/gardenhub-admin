'use client';

import { useCoupon } from '@/hooks/useCoupon';
import { useParams } from 'next/navigation';
import { Card, Descriptions, Badge, Spin, Button, Statistic } from 'antd';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function CouponDetailPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = parseInt(params.id);
  const { data: coupon, isLoading } = useCoupon(couponId);

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
          <Button type="primary" onClick={() => router.push('/coupons')} className="mt-4">
            Back to Coupons
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = coupon.expirationDate && new Date(coupon.expirationDate) < new Date();
  const usagePercentage = coupon.globalUsageLimit
    ? ((coupon.globalCurrentUsage || 0) / coupon.globalUsageLimit) * 100
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{coupon.name}</h1>
          <p className="mt-1 text-sm text-gray-600">Coupon Code: {coupon.code}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push(`/coupons/edit?id=${coupon.id}`)}>
            Edit Coupon
          </Button>
          <Button onClick={() => router.push('/coupons')}>Back to List</Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <Statistic
            title="Total Usage"
            value={coupon.globalCurrentUsage || 0}
            suffix={coupon.globalUsageLimit ? `/ ${coupon.globalUsageLimit}` : '/ ∞'}
          />
        </Card>
        <Card>
          <Statistic
            title="Discount Value"
            value={coupon.discountValue}
            suffix={coupon.isPercentage ? '%' : 'AED'}
          />
        </Card>
        <Card>
          <Statistic
            title="Min. Order"
            value={coupon.minimumOrderAmount || 0}
            suffix="AED"
            precision={2}
          />
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Status</div>
          <div className="mt-2">
            <Badge
              status={coupon.isActive && !isExpired ? 'success' : 'error'}
              text={
                isExpired
                  ? 'Expired'
                  : coupon.isActive
                    ? 'Active'
                    : 'Inactive'
              }
            />
          </div>
        </Card>
      </div>

      {/* Details */}
      <Card title="Coupon Details" className="mb-6">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Code">{coupon.code}</Descriptions.Item>
          <Descriptions.Item label="Name">{coupon.name}</Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {coupon.description || 'No description'}
          </Descriptions.Item>
          <Descriptions.Item label="Discount">
            {coupon.discountValue} {coupon.isPercentage ? '%' : 'AED'}
          </Descriptions.Item>
          <Descriptions.Item label="Scope">
            {coupon.couponScope === 'EntireOrder'
              ? 'Entire Order'
              : coupon.couponScope === 'Category'
                ? 'Specific Categories'
                : 'Specific Products'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge
              status={coupon.isActive ? 'success' : 'error'}
              text={coupon.isActive ? 'Active' : 'Inactive'}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Customer Specific">
            {coupon.isCustomerSpecific ? 'Yes' : 'No'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Usage Restrictions */}
      <Card title="Usage Restrictions" className="mb-6">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Minimum Order Amount">
            {coupon.minimumOrderAmount ? `${coupon.minimumOrderAmount} AED` : 'No minimum'}
          </Descriptions.Item>
          <Descriptions.Item label="Global Usage Limit">
            {coupon.globalUsageLimit || 'Unlimited'}
          </Descriptions.Item>
          <Descriptions.Item label="Current Usage">
            {coupon.globalCurrentUsage || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Max Usage Per Customer">
            {coupon.maxUsagePerCustomer || 'Unlimited'}
          </Descriptions.Item>
          <Descriptions.Item label="Expiration Date" span={2}>
            {coupon.expirationDate ? (
              <span className={isExpired ? 'text-red-600' : ''}>
                {dayjs(coupon.expirationDate).format('MMMM D, YYYY')}
                {isExpired && ' (Expired)'}
              </span>
            ) : (
              'No expiration'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Targeting */}
      {(coupon.appliesToCategoryIds?.length > 0 ||
        coupon.appliesToProductIds?.length > 0 ||
        coupon.allowedCustomerIds?.length > 0) && (
        <Card title="Targeting" className="mb-6">
          <Descriptions bordered column={1}>
            {coupon.appliesToCategoryIds?.length > 0 && (
              <Descriptions.Item label="Category IDs">
                {coupon.appliesToCategoryIds.join(', ')}
              </Descriptions.Item>
            )}
            {coupon.appliesToProductIds?.length > 0 && (
              <Descriptions.Item label="Product IDs">
                {coupon.appliesToProductIds.join(', ')}
              </Descriptions.Item>
            )}
            {coupon.allowedCustomerIds?.length > 0 && (
              <Descriptions.Item label="Allowed Customer IDs">
                {coupon.allowedCustomerIds.join(', ')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      {/* Audit Info */}
      <Card title="Audit Information">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Created At">
            {dayjs(coupon.createdAt).format('MMMM D, YYYY h:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Created By">{coupon.createdBy || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {dayjs(coupon.lastUpdatedAt).format('MMMM D, YYYY h:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Updated By">
            {coupon.lastUpdatedBy || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
