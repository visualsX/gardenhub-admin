import React from 'react';
import { Box } from '@/components/wrappers/box';
import LabelAndValue from '@/components/ui/label-value';
import Badge from '@/components/ui/badge';

const GeneralTab = ({ order, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Box 
          loading={isLoading} 
          header 
          title="Order Summary" 
          description="Basic order information and financials"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <LabelAndValue label="Order Number" value={`#${order?.orderNumber}`} />
            <LabelAndValue label="Order Date" value={order?.createdAt ? new Date(order.createdAt).toLocaleString() : '-'} />
            <LabelAndValue 
              label="Status" 
              value={
                <Badge 
                  variant={
                    ['COMPLETED', 'DELIVERED'].includes(order?.status) 
                      ? 'success' 
                      : ['PENDING', 'PARTIALLY_REFUNDED'].includes(order?.status)
                      ? 'warning'
                      : ['CANCELLED', 'REFUNDED', 'PAYMENT_FAILED'].includes(order?.status)
                      ? 'danger'
                      : 'info'
                  }
                >
                  {order?.status?.replace(/_/g, ' ')}
                </Badge>
              } 
            />
            <LabelAndValue label="Item Count" value={order?.items?.length || 0} />
            <div className="col-span-2 border-t border-smoke pt-6 mt-2 space-y-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span>{order?.subtotal} AED</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Shipping Fee</span>
                <span>{order?.shippingFee} AED</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Tax Amount</span>
                <span>{order?.taxAmount} AED</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Discount</span>
                <span className="text-red-500">-{order?.discountAmount} AED</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-smoke text-lg font-bold text-gray-900">
                <span>Grand Total</span>
                <span className="text-primary">{order?.grandTotal} AED</span>
              </div>
            </div>
          </div>
        </Box>

        <Box 
          loading={isLoading} 
          header 
          title="Customer Information" 
          description="Details about the customer who placed the order"
        >
          <div className="grid grid-cols-1 gap-6">
            <LabelAndValue 
              label="Full Name" 
              value={`${order?.customer?.firstName} ${order?.customer?.lastName}`} 
            />
            <LabelAndValue label="Email Address" value={order?.customer?.email} />
            <LabelAndValue label="Customer ID" value={`#${order?.customer?.id}`} />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default GeneralTab;
