'use client';

import React from 'react';
import { Form, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { Box } from '@/components/wrappers/box';
import { FormInput, FormSelect, FormSwitch, FormInputNumber, FormTextArea } from '@/components/ui/inputs';
import { UAE_EMIRATES } from '@/lib/const/regions';

const PAYMENT_METHOD_TYPES = [
  { label: 'Online Gateway', value: 'OnlineGateway' },
  { label: 'Cash on Delivery', value: 'CashOnDelivery' },
  { label: 'Bank Transfer', value: 'BankTransfer' },
];

const GATEWAY_PROVIDERS = [
  { label: 'None', value: 'None' },
  { label: 'Stripe', value: 'Stripe' },
  { label: 'PayPal', value: 'PayPal' },
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
  const selectedType = Form.useWatch('type', form);

  // Common fields that are always treated as "known" and handled by the schema
  const commonFields = [
    'description',
    'iconUrl',
    'displayOrder',
    'gatewayProvider',
  ];

  // Type-specific known fields
  const typeSpecificKnownKeys = {
    OnlineGateway: [
      'publishableKey',
      'secretKey',
      'webhookSecret',
      'mode',
      'currency',
      'successUrl',
      'cancelUrl',
    ],
    CashOnDelivery: ['instructions', 'maxOrderAmount', 'availableRegions'],
    BankTransfer: [
      'bankName',
      'accountName',
      'accountNumber',
      'routingNumber',
      'swiftCode',
      'instructions',
    ],
  };

  // Parse configurationJson for the form
  const processedInitialValues = React.useMemo(() => {
    if (!initialValues) return { isActive: true, type: 'OnlineGateway', customFields: [] };
    let config = {};
    try {
      config = initialValues.configurationJson ? JSON.parse(initialValues.configurationJson) : {};
    } catch (e) {
      console.error('Failed to parse configurationJson', e);
    }

    const type = initialValues.type;
    const allKnownKeys = [...commonFields, ...(typeSpecificKnownKeys[type] || [])];
    const customFields = [];

    Object.entries(config).forEach(([key, value]) => {
      if (!allKnownKeys.includes(key)) {
        customFields.push({ key, value: typeof value === 'object' ? JSON.stringify(value) : value });
      }
    });

    return {
      ...initialValues,
      config, // Store the flat object here for easy access in Form.Items
      customFields,
    };
  }, [initialValues]);

  // Sync form fields when data loads
  React.useEffect(() => {
    if (initialValues && !initialsLoading) {
      form.setFieldsValue(processedInitialValues);
    }
  }, [processedInitialValues, initialsLoading, form, initialValues]);

  const handleFinish = (values) => {
    const { config, customFields, ...rest } = values;

    // Merge static config fields and custom dynamic fields
    const finalConfig = { ...config };
    customFields?.forEach((field) => {
      if (field.key) {
        try {
          const trimmedValue = field.value?.trim();
          finalConfig[field.key] =
            trimmedValue?.startsWith('{') || trimmedValue?.startsWith('[')
              ? JSON.parse(trimmedValue)
              : trimmedValue;
        } catch (e) {
          finalConfig[field.key] = field.value;
        }
      }
    });

    const payload = {
      ...rest,
      configurationJson: JSON.stringify(finalConfig),
    };

    onSubmit(payload);
  };

  return (
    <div className="pb-20">
      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        initialValues={processedInitialValues}
        onFinish={handleFinish}
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
                  name={['config', 'gatewayProvider']}
                  label="Gateway Provider"
                  placeholder="Select Provider"
                  options={GATEWAY_PROVIDERS}
                />
              </div>

              <FormTextArea
                name={['config', 'description']}
                label="Description"
                placeholder="Method description shown to customers"
              />
            </Box>

            {/* Type-Specific Configuration */}
            {selectedType && (
              <Box
                loading={initialsLoading}
                title={`${PAYMENT_METHOD_TYPES.find((t) => t.value === selectedType)?.label} Configuration`}
                description="Specific settings for this payment type"
                header
              >
                {selectedType === 'OnlineGateway' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        name={['config', 'publishableKey']}
                        label="Publishable Key"
                        placeholder="pk_..."
                      />
                      <FormInput
                        name={['config', 'secretKey']}
                        label="Secret Key"
                        placeholder="sk_..."
                      />
                    </div>
                    <FormInput
                      name={['config', 'webhookSecret']}
                      label="Webhook Secret"
                      placeholder="whsec_..."
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormSelect
                        name={['config', 'mode']}
                        label="Mode"
                        options={[
                          { label: 'Payment', value: 'payment' },
                          { label: 'Subscription', value: 'subscription' },
                        ]}
                      />
                      <FormInput name={['config', 'currency']} label="Currency" placeholder="usd" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        name={['config', 'successUrl']}
                        label="Success URL"
                        placeholder="https://..."
                      />
                      <FormInput
                        name={['config', 'cancelUrl']}
                        label="Cancel URL"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {selectedType === 'CashOnDelivery' && (
                  <div className="space-y-4">
                    <FormTextArea
                      name={['config', 'instructions']}
                      label="Instructions"
                      placeholder="Pay with cash on delivery..."
                    />
                    <FormInputNumber
                      name={['config', 'maxOrderAmount']}
                      label="Max Order Amount"
                      placeholder="50000"
                    />
                    <FormSelect
                      mode="multiple"
                      name={['config', 'availableRegions']}
                      label="Available Regions (Emirates)"
                      options={UAE_EMIRATES.map((e) => ({ label: e.name, value: e.name }))}
                    />
                  </div>
                )}

                {selectedType === 'BankTransfer' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput name={['config', 'bankName']} label="Bank Name" placeholder="ABC Bank" />
                      <FormInput
                        name={['config', 'accountName']}
                        label="Account Name"
                        placeholder="Planta Ecommerce LLC"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        name={['config', 'accountNumber']}
                        label="Account Number"
                        placeholder="1234567890"
                      />
                      <FormInput
                        name={['config', 'routingNumber']}
                        label="Routing Number"
                        placeholder="987654321"
                      />
                    </div>
                    <FormInput name={['config', 'swiftCode']} label="SWIFT/BIC Code" placeholder="ABCBUS33" />
                    <FormTextArea
                      name={['config', 'instructions']}
                      label="Payment Instructions"
                      placeholder="Please use order number as reference..."
                    />
                  </div>
                )}
              </Box>
            )}

            <Box
              loading={initialsLoading}
              title="Custom Configurations"
              description="Add any additional key-value pairs"
              header
            >
              <Form.List name="customFields">
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex items-end gap-4 bg-gray-50 p-4 rounded-xl relative">
                        <div className="flex-1">
                          <FormInput
                            {...restField}
                            name={[name, 'key']}
                            label="Key"
                            placeholder="e.g. custom_setting"
                          />
                        </div>
                        <div className="flex-1">
                          <FormInput
                            {...restField}
                            name={[name, 'value']}
                            label="Value"
                            placeholder="e.g. some value"
                          />
                        </div>
                        <Button
                          danger
                          type="text"
                          onClick={() => remove(name)}
                          className="mb-6 h-[38px]"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} block className="h-[40px]">
                      + Add Custom Field
                    </Button>
                  </div>
                )}
              </Form.List>
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
              <FormInputNumber name={['config', 'displayOrder']} label="Display Order" placeholder="0" min={0} />
              <FormInput
                name={['config', 'iconUrl']}
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
