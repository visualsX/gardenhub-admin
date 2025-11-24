'use client';
import React, { useState } from 'react';
import { Tabs, Form, Button, message, Typography, Skeleton, Checkbox, Radio, Select } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormSwitch,
  FormInputNumber,
} from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import UploaderMax from '@/components/ui/uploaderM';
import SingleImageUploader from '@/components/ui/singleUpload';
import { useCreateProduct } from '@/hooks/useProduct';
import { useAttributes } from '@/hooks/useAttribute';
import Link from 'next/link';
import CategoryCascader from '@/components/ui/select-dropdowns/CategoryCascader';
import { getLastIdx } from '@/lib/utils/helpers';

const { Title, Text } = Typography;

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  const addProduct = useCreateProduct();
  const { data, isLoading } = useAttributes();

  const onSubmit = (values) => {
    values['CategoryIds'] = getLastIdx(values.CategoryIds);

    // Collect only fields whose names start with 'idx_'
    const FilterOptionIds = Object.entries(values)
      .filter(([key]) => key.startsWith('idx_'))
      .map(([, value]) => value)
      .flat()
      .filter(Boolean);

    // Step 1: Build FormData
    const formData = new FormData();

    // Step 2: Append all normal fields
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item?.originFileObj) {
            formData.append(key, item.originFileObj);
          } else if (item !== null && item !== undefined) {
            formData.append(key, String(item));
          }
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // Step 3: Append each FilterOptionId separately (important part)
    FilterOptionIds.forEach((id) => {
      formData.append('FilterOptionIds', String(id));
    });

    // Debugging
    console.log('FormData entries:');
    for (const [k, v] of formData.entries()) {
      console.log(k, v);
    }

    // Step 4: Submit
    addProduct.mutate(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    message.info('Form reset to initial values');
  };

  const initialValues = {};

  const boxSizeOptions = [
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
  ];

  const shippingTypeOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Oversized', label: 'Oversized' },
  ];

  const generalTab = (
    <div className="space-y-6">
      <Box header title={'Product Information'} description={'Basic details about the product'}>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="Name"
            label="Product Name"
            placeholder="Enter product name"
            rules={[{ required: true, message: 'Please enter product name' }]}
            className="mb-4"
          />
          <FormInput
            name="Sku"
            label="Stock Keeping Unit (SKU)"
            placeholder="Enter SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
            className="mb-4"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <CategoryCascader name="CategoryIds" label="Category" />
        </div>
        <FormTextArea
          name="ShortDescription"
          label="Short Description"
          placeholder="Enter short description"
          rows={3}
          className="mb-4"
        />
        <FormTextArea
          name="DetailedDescription"
          label="Detailed Description"
          placeholder="Enter detailed description"
          rows={4}
          className="mb-0"
        />
      </Box>

      <Box header title={'Attributes & Tags'}>
        <Skeleton loading={isLoading}>
          {data?.map((el, idx) => (
            <Form.Item label={el?.name} name={`idx_${idx}`} key={idx}>
              {el.isMultiSelect ? (
                <Checkbox.Group className="mb-4 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    {el?.options?.map((option, key) => (
                      <Checkbox className="" value={option.id} key={key}>
                        {option.value}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              ) : (
                <Select
                  allowClear
                  options={el?.options?.map((option) => ({
                    label: option.value,
                    value: option.id,
                  }))}
                  placeholder={`Select ${el?.name}`}
                  className="mb-4 w-full"
                />
              )}
            </Form.Item>
          ))}
        </Skeleton>
      </Box>

      <Box header title={'SEO Information'} description={'Search engine optimization details'}>
        <FormInput
          name="MetaTitle"
          label="SEO Title"
          placeholder="Enter SEO title"
          className="mb-4"
        />
        <FormTextArea
          name="MetaDescription"
          label="Meta Description"
          placeholder="Enter meta description"
          rows={3}
          className="mb-4"
        />
        <FormInput name="Keywords" label="Keywords" placeholder="Enter keywords" className="mb-0" />
      </Box>
    </div>
  );

  const pricingTab = (
    <Box header title={''} description={''}>
      <div className="mb-4">
        <Text strong className="text-base">
          Pricing Information
        </Text>
        <div className="mt-1 text-sm text-gray-500">Set product pricing and margins</div>
      </div>
      <FormInput
        name="RegularPrice"
        label="Retail Price"
        placeholder="0.00"
        type="number"
        suffix="AED"
        className="mb-4"
      />
      <FormInput
        name="CostPrice"
        label="Cost Price"
        placeholder="0.00"
        type="number"
        suffix="AED"
        className="mb-4"
      />
      <FormInput
        name="Discount"
        label="Discount"
        placeholder="0"
        type="number"
        suffix="%"
        className="mb-0"
      />
    </Box>
  );

  const specificationsTab = (
    <div className="space-y-6">
      <Box header title={'Product Dimensions'} description={'Physical measurements of the product'}>
        <FormInputNumber
          name="Weight"
          label="Weight"
          placeholder="0"
          suffix="grams"
          className="mb-4"
        />
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Dimensions (meters)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <FormInputNumber name={'Length'} placeholder="Length" />
            <FormInputNumber name={'Width'} placeholder="Width" />
            <FormInputNumber name={'Height'} placeholder="Height" />
            {/* <FormInput name={'depth'} placeholder="Depth" type="number"  /> */}
          </div>
        </div>
      </Box>
    </div>
  );

  const inventoryTab = (
    <div className="space-y-6">
      <Box header title={'Stock Management'} description={'Manage inventory levels and alerts'}>
        <div className="grid grid-cols-2 gap-4">
          <FormInputNumber
            name="StockQuantity"
            label="Current Stock"
            placeholder="0"
            className="mb-0"
          />
          <FormInputNumber
            name="LowStockThreshold"
            label="Low Stock Threshold"
            placeholder="0"
            className="mb-0"
          />
        </div>
      </Box>

      <Box header title={'Shipping Information'}>
        <FormSwitch name="IsShippingRequired" label="Shipping Required" className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <FormInputNumber
            name="shippingWeight"
            label="Shipping Weight"
            placeholder="0"
            suffix="lbs"
            className="mb-4"
          />
          <FormSelect
            name="boxSize"
            label="Box Size"
            placeholder="Select box size"
            options={boxSizeOptions}
            className="mb-4"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="shippingType"
            label="Shipping Type"
            placeholder="Select shipping type"
            options={shippingTypeOptions}
            className="mb-0"
          />
          <FormSwitch name="IsFragile" label="Fragile Item" className="mb-0" />
        </div>
      </Box>
    </div>
  );

  const tabItems = [
    { key: '1', label: 'General', children: generalTab },
    { key: '2', label: 'Pricing', children: pricingTab },
    { key: '3', label: 'Specifications', children: specificationsTab },
    { key: '4', label: 'Inventory', children: inventoryTab },
  ];

  return (
    <Form
      requiredMark={false}
      form={form}
      onFinish={onSubmit}
      layout="vertical"
      initialValues={initialValues}
    >
      <div className="flex items-center justify-between py-2">
        <Link href={'/products'} className="flex items-center gap-x-2">
          <div className="border-smoke rounded-full border bg-white p-1">
            <ArrowLeft size={20} />
          </div>
          <h1 className="flex items-center gap-3 text-lg font-semibold text-black">Add Product</h1>
        </Link>
        <div className="flex gap-3">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="w-40!"
            loading={addProduct.isPending}
            disabled={addProduct.isPending}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="py-6">
        <div className="flex gap-6">
          <div className="w-80 shrink-0 space-y-6">
            <Box>
              <Title level={5} className="mb-4">
                Product Images
              </Title>

              <SingleImageUploader
                name={'MainImage'}
                label="Main Image"
                className={'products-main'}
              />

              <UploaderMax
                name="AdditionalImages"
                label="Additional Images"
                className={'products-additionals'}
              />
            </Box>

            <Box>
              <Title level={5} className="mb-4">
                Product Status
              </Title>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text>Active</Text>
                  <FormSwitch name="IsActive" noStyle />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Featured Product</Text>
                  <FormSwitch name="IsFeatured" noStyle />
                </div>
              </div>
            </Box>
          </div>

          <div className="flex-1">
            <Box>
              <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            </Box>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductManagement;
