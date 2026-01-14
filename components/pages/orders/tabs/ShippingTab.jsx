import React from 'react';
import { Box } from '@/components/wrappers/box';
import LabelAndValue from '@/components/ui/label-value';
import { Timeline } from 'antd';

const ShippingTab = ({ order, isLoading }) => {
  const timelineItems =
    order?.trackingHistory?.map((history) => ({
      color: 'green',
      children: (
        <div>
          <p className="text-sm font-semibold text-gray-900">{history.status}</p>
          <p className="text-xs text-gray-500">{new Date(history.createdAt).toLocaleString()}</p>
          {history.notes && <p className="mt-1 text-xs text-gray-600">{history.notes}</p>}
        </div>
      ),
    })) || [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Box
          loading={isLoading}
          header
          title="Shipping Address"
          description="Customer's shipping destination"
        >
          <AddressDetails address={order?.shippingAddress} />
        </Box>

        <Box
          loading={isLoading}
          header
          title="Billing Address"
          description="Customer's billing information"
        >
          <AddressDetails address={order?.billingAddress} />
        </Box>
      </div>

      <div className="space-y-6">
        <Box
          loading={isLoading}
          header
          title="Tracking Information"
          description="Logistics and delivery status"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <LabelAndValue label="Carrier" value={order?.carrier || 'Not assigned'} />
              <LabelAndValue
                label="Tracking Number"
                value={order?.trackingNumber || 'Not available'}
              />
              <LabelAndValue
                label="Expected Delivery"
                value={
                  order?.expectedDeliveryDate
                    ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                    : '-'
                }
              />
            </div>

            <div className="border-smoke border-t pt-6">
              <h4 className="mb-4 text-sm font-semibold">Tracking History</h4>
              {timelineItems.length > 0 ? (
                <Timeline items={timelineItems} />
              ) : (
                <p className="text-sm text-gray-400 italic">No tracking updates yet</p>
              )}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

const AddressDetails = ({ address }) => {
  if (!address) return <p className="text-sm text-gray-400 italic">No address provided</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      <LabelAndValue label="Receiver" value={address.fullName} />
      <LabelAndValue label="Phone" value={address.phone} />
      <LabelAndValue label="Street" value={address.streetAddress} />
      <div className="grid grid-cols-2 gap-4">
        <LabelAndValue label="City" value={address.city} />
        <LabelAndValue label="Postal Code" value={address.postalCode} />
      </div>
      <LabelAndValue label="Country" value={address.country} />
    </div>
  );
};

export default ShippingTab;
