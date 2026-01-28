'use client';

import React from 'react';
import { Form, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { Box } from '@/components/wrappers/box';
import { FormInput, FormSelect, FormSwitch, FormInputNumber, FormTextArea } from '@/components/ui/inputs';

const PAYMENT_METHOD_TYPES = [
  { label: 'Online Gateway', value: 'OnlineGateway' },
  { label: 'Offline', value: 'Offline' },
  { label: 'Cash on Delivery', value: 'COD' },
];

const GATEWAY_PROVIDERS = [
  { label: 'None', value: 'None' },
  { label: 'Stripe', value: 'Stripe' },
  { label: 'PayPal', value: 'PayPal' },
  { label: 'Tamara', value: 'Tamara' },
  { label: 'Tabby', value: 'Tabby' },
];

export default function PaymentMethodForm({
  initialsLoading = false,
  initialValues,
  onSubmit,
  isLoading,
  mode = 'create',
}) {
  const [form] = Form.useForm();
  const router = useRouter();

  return (
    <div className="pb-20">
      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Box
              loading={initialsLoading}
              title="Basic Information"
              description="General details about the payment method"
              header
            >
              <div className="grid grid-cols-2 gap-4">
                <FormInput name="name" label="Display Name" placeholder="e.g. Credit Card" />
                <FormInput name="code" label="Internal Code" placeholder="e.g. CC_STRIPE" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  name="type"
                  label="Type"
                  placeholder="Select Type"
                  options={PAYMENT_METHOD_TYPES}
                />
                <FormSelect
                  name="gatewayProvider"
                  label="Gateway Provider"
                  placeholder="Select Provider"
                  options={GATEWAY_PROVIDERS}
                />
              </div>

              <FormTextArea
                name="description"
                label="Description"
                placeholder="Method description shown to customers"
              />
            </Box>

            <Box
              loading={initialsLoading}
              title="Configuration"
              description="Fees and limits for this payment method"
              header
            >
              <div className="grid grid-cols-2 gap-4">
                <FormInputNumber
                  name="feePercentage"
                  label="Fee Percentage (%)"
                  placeholder="0.00"
                  min={0}
                  max={100}
                  step={0.01}
                />
                <FormInputNumber
                  name="feeFixedAmount"
                  label="Fixed Fee Amount"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInputNumber
                  name="minimumOrderAmount"
                  label="Min Order Amount"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                />
                <FormInputNumber
                  name="maximumOrderAmount"
                  label="Max Order Amount"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                />
              </div>

              <FormTextArea
                name="configurationJson"
                label="Gateway Configuration (JSON)"
                placeholder='{"apiKey": "xxx", "secret": "yyy"}'
              />
            </Box>
          </div>

          <div className="space-y-6">
            <Box
              loading={initialsLoading}
              title="Settings"
              description="Visibility and ranking"
              header
            >
              <FormSwitch name="isActive" label="Is Active" />
              <FormInputNumber
                name="displayOrder"
                label="Display Order"
                placeholder="0"
                min={0}
              />
              <FormInput
                name="iconUrl"
                label="Icon URL"
                placeholder="https://..."
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              />
            </Box>
          </div>
        </div>

        <div className="border-smoke fixed right-0 bottom-0 left-0 z-10 flex justify-end gap-3 border-t bg-white p-4 px-8 lg:left-64">
          <Button size="large" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="primary" size="large" htmlType="submit" loading={isLoading}>
            {mode === 'create' ? 'Create Payment Method' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
