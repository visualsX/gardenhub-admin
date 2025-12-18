'use client';

import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { Box } from '@/components/wrappers/box';

import { UAE_EMIRATES } from '@/lib/const/regions';
import { FormInput, FormSelect } from '@/components/ui/inputs';

export default function ShippingZoneForm({
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
        initialValues={{
          ...initialValues,
          countryCodes: initialValues?.countryCodes
            ? typeof initialValues?.countryCodes === 'string'
              ? initialValues?.countryCodes.split(',')
              : initialValues?.countryCodes
            : [],
        }}
        onFinish={(values) => {
          const payload = {
            ...values,
            countryCodes: values?.countryCodes?.join(','),
          };
          onSubmit(payload);
        }}
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <Box
              loading={initialsLoading}
              title="Zone Details"
              description={'Define a new shipping zone and its countries'}
              header
            >
              <FormInput name="name" label="Zone Name" placeholder="e.g. Dubai Zone" />

              <FormSelect
                mode="multiple"
                name="countryCodes"
                label="Emirates / Regions"
                placeholder={'Select Emirates'}
                rules={[{ required: true, message: 'Please select at least one emirate' }]}
                options={UAE_EMIRATES.map((c) => ({ label: c.name, value: c.code }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Box>
          </div>
        </div>

        <div className="border-smoke fixed right-0 bottom-0 left-0 z-10 flex justify-end gap-3 border-t bg-white p-4 px-8 lg:left-64">
          <Button size="large" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="primary" size="large" htmlType="submit" loading={isLoading}>
            {mode === 'create' ? 'Create Zone' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
