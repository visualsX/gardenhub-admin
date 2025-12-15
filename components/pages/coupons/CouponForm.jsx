'use client';

import { Form, Input, InputNumber, Switch, Select, DatePicker, Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export default function CouponForm({ initialValues, onSubmit, isLoading, mode = 'create' }) {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description || '',
      discountValue: values.discountValue,
      isPercentage: values.isPercentage || false,
      couponScope: values.couponScope,
      globalUsageLimit: values.globalUsageLimit || null,
      maxUsagePerCustomer: values.maxUsagePerCustomer || null,
      minimumOrderAmount: values.minimumOrderAmount || null,
      isCustomerSpecific: values.isCustomerSpecific || false,
      allowedCustomerIds: values.allowedCustomerIds || [],
      appliesToProductIds: values.appliesToProductIds || [],
      appliesToCategoryIds: values.appliesToCategoryIds || [],
      expirationDate: values.expirationDate ? values.expirationDate.toISOString() : null,
      isActive: values.isActive !== undefined ? values.isActive : true,
    };

    // Add id to payload for update operations
    if (mode === 'edit' && initialValues?.id) {
      payload.id = initialValues.id;
    }

    await onSubmit(payload);
  };

  const initialFormValues = initialValues
    ? {
        ...initialValues,
        expirationDate: initialValues.expirationDate ? dayjs(initialValues.expirationDate) : null,
      }
    : {
        isPercentage: false,
        couponScope: 'EntireOrder',
        isActive: true,
        isCustomerSpecific: false,
      };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialFormValues}
      onFinish={handleSubmit}
      className="space-y-6"
    >
      <Card title="Basic Information" className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[{ required: true, message: 'Please enter coupon code' }]}
          >
            <Input placeholder="e.g., SUMMER2024" className="h-10" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Coupon Name"
            rules={[{ required: true, message: 'Please enter coupon name' }]}
          >
            <Input placeholder="e.g., Summer Sale 2024" className="h-10" />
          </Form.Item>
        </div>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Describe this coupon..." />
        </Form.Item>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Card>

      <Card title="Discount Settings" className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            name="discountValue"
            label="Discount Value"
            rules={[{ required: true, message: 'Please enter discount value' }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              placeholder="e.g., 10"
              style={{ height: '40px' }}
            />
          </Form.Item>

          <Form.Item name="isPercentage" label="Discount Type" valuePropName="checked">
            <Switch checkedChildren="Percentage (%)" unCheckedChildren="Fixed Amount (AED)" />
          </Form.Item>
        </div>

        <Form.Item
          name="couponScope"
          label="Applies To"
          rules={[{ required: true, message: 'Please select scope' }]}
        >
          <Select style={{ height: '40px' }}>
            <Option value="EntireOrder">Entire Order</Option>
            <Option value="Category">Specific Categories</Option>
            <Option value="Product">Specific Products</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.couponScope !== currentValues.couponScope
          }
        >
          {({ getFieldValue }) => {
            const scope = getFieldValue('couponScope');
            if (scope === 'Category') {
              return (
                <Form.Item
                  name="appliesToCategoryIds"
                  label="Select Categories"
                  tooltip="Enter category IDs (comma-separated)"
                >
                  <Select
                    mode="tags"
                    placeholder="Enter category IDs"
                    style={{ minHeight: '40px' }}
                  />
                </Form.Item>
              );
            }
            if (scope === 'Product') {
              return (
                <Form.Item
                  name="appliesToProductIds"
                  label="Select Products"
                  tooltip="Enter product IDs (comma-separated)"
                >
                  <Select
                    mode="tags"
                    placeholder="Enter product IDs"
                    style={{ minHeight: '40px' }}
                  />
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>
      </Card>

      <Card title="Usage Restrictions" className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item name="minimumOrderAmount" label="Minimum Order Amount (AED)">
            <InputNumber
              min={0}
              className="w-full"
              placeholder="No minimum"
              style={{ height: '40px' }}
            />
          </Form.Item>

          <Form.Item name="globalUsageLimit" label="Total Usage Limit">
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Unlimited"
              style={{ height: '40px' }}
            />
          </Form.Item>

          <Form.Item name="maxUsagePerCustomer" label="Usage Limit Per Customer">
            <InputNumber
              min={1}
              className="w-full"
              placeholder="Unlimited"
              style={{ height: '40px' }}
            />
          </Form.Item>

          <Form.Item name="expirationDate" label="Expiration Date">
            <DatePicker className="w-full" style={{ height: '40px' }} />
          </Form.Item>
        </div>

        <Form.Item name="isCustomerSpecific" label="Customer Specific" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isCustomerSpecific !== currentValues.isCustomerSpecific
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('isCustomerSpecific') ? (
              <Form.Item
                name="allowedCustomerIds"
                label="Allowed Customer IDs"
                tooltip="Enter customer IDs (comma-separated)"
              >
                <Select
                  mode="tags"
                  placeholder="Enter customer IDs"
                  style={{ minHeight: '40px' }}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Card>

      <div className="flex justify-end gap-3">
        <Button size="large" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="primary" size="large" htmlType="submit" loading={isLoading}>
          {mode === 'create' ? 'Create Coupon' : 'Update Coupon'}
        </Button>
      </div>
    </Form>
  );
}
