'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import GoBack from '@/components/ui/go-back';
import { Box } from '@/components/wrappers/box';
import SegmentedTabs from '@/components/ui/segmented-tabs';
import { useOrder, useUpdateOrderStatus, useRefundOrder } from '@/hooks/orders/useOrders';
import GeneralTab from './tabs/GeneralTab';
import ItemsTab from './tabs/ItemsTab';
import ShippingTab from './tabs/ShippingTab';
import NotesTab from './tabs/NotesTab';
import DollarIcon from '@/public/shared/dollar.svg';
import dayjs from 'dayjs';

const OrderDetailsClient = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: order, isLoading } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const refundOrder = useRefundOrder();
  const [activeTab, setActiveTab] = useState('general');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [statusForm] = Form.useForm();
  const [refundForm] = Form.useForm();

  const tabItems = [
    { key: 'general', label: 'General' },
    { key: 'items', label: 'Items' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'notes', label: 'Notes' },
  ];

  const handleStatusSubmit = async () => {
    try {
      const values = await statusForm.validateFields();
      const payload = {
        orderId: +id,
        newStatus: values.newStatus,
        notes: values.notes || '',
        carrier: values.carrier || '',
        trackingNumber: values.trackingNumber || '',
        expectedDelivery: values.expectedDelivery ? values.expectedDelivery.toISOString() : null,
      };
      
      updateStatus.mutate({ id, data: payload }, {
        onSuccess: () => {
          setStatusModalOpen(false);
          statusForm.resetFields();
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleRefundSubmit = async () => {
    try {
      const values = await refundForm.validateFields();
      const payload = {
        orderId: +id,
        refundAmount: parseFloat(values.refundAmount),
        refundReason: values.refundReason,
      };
      
      refundOrder.mutate({ id, data: payload }, {
        onSuccess: () => {
          setRefundModalOpen(false);
          refundForm.resetFields();
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Refunded', value: 'REFUNDED' },
    { label: 'Partially Refunded', value: 'PARTIALLY_REFUNDED' },
    { label: 'Payment Failed', value: 'PAYMENT_FAILED' },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <GoBack 
          href="/orders" 
          title={`Order #${order?.orderNumber || '...'}`} 
          desc="View and manage order details" 
        />
        <div className="flex items-center gap-3">
          <Button 
            type="primary"
            onClick={() => setStatusModalOpen(true)}
            loading={updateStatus.isPending}
          >
            Update Status
          </Button>
          <Button 
            icon={<DollarIcon className="h-4 w-4" />}
            onClick={() => setRefundModalOpen(true)}
            loading={refundOrder.isPending}
          >
            Process Refund
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <SegmentedTabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === 'general' && <GeneralTab order={order} isLoading={isLoading} />}
          {activeTab === 'items' && <ItemsTab order={order} isLoading={isLoading} />}
          {activeTab === 'shipping' && <ShippingTab order={order} isLoading={isLoading} />}
          {activeTab === 'notes' && <NotesTab order={order} isLoading={isLoading} />}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        open={statusModalOpen}
        onOk={handleStatusSubmit}
        onCancel={() => {
          setStatusModalOpen(false);
          statusForm.resetFields();
        }}
        confirmLoading={updateStatus.isPending}
        width={600}
      >
        <Form
          form={statusForm}
          layout="vertical"
          initialValues={{ newStatus: order?.status }}
        >
          <Form.Item
            name="newStatus"
            label="New Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select options={statusOptions} placeholder="Select status" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
            rules={[{ required: true, message: 'Please provide notes for this status change' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter notes about this status change" />
          </Form.Item>

          <Form.Item
            name="carrier"
            label="Carrier"
          >
            <Input placeholder="e.g., DHL, FedEx, UPS" />
          </Form.Item>

          <Form.Item
            name="trackingNumber"
            label="Tracking Number"
          >
            <Input placeholder="Enter tracking number" />
          </Form.Item>

          <Form.Item
            name="expectedDelivery"
            label="Expected Delivery Date"
          >
            <DatePicker 
              className="w-full" 
              showTime 
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Refund Modal */}
      <Modal
        title="Process Refund"
        open={refundModalOpen}
        onOk={handleRefundSubmit}
        onCancel={() => {
          setRefundModalOpen(false);
          refundForm.resetFields();
        }}
        confirmLoading={refundOrder.isPending}
        width={500}
      >
        <Form
          form={refundForm}
          layout="vertical"
        >
          <Form.Item
            name="refundAmount"
            label="Refund Amount (AED)"
            rules={[
              { required: true, message: 'Please enter refund amount' },
              { 
                validator: (_, value) => {
                  if (value && parseFloat(value) > order?.grandTotal) {
                    return Promise.reject('Refund amount cannot exceed order total');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              type="number" 
              step="0.01"
              placeholder="Enter refund amount" 
              suffix="AED"
            />
          </Form.Item>

          <Form.Item
            name="refundReason"
            label="Refund Reason"
            rules={[{ required: true, message: 'Please provide a reason for the refund' }]}
          >
            <Input.TextArea rows={4} placeholder="Explain the reason for this refund" />
          </Form.Item>

          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <p><strong>Order Total:</strong> {order?.grandTotal} AED</p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDetailsClient;
