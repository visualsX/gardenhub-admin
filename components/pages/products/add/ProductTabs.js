import React from 'react';
import { Tabs, Form, Skeleton, Checkbox, Select } from 'antd';
import {
  FormInput,
  FormTextArea,
  FormSwitch,
  FormInputNumber,
} from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import CategoryCascader from '@/components/ui/select-dropdowns/CategoryCascader';


const ProductTabs = ({
  activeTab,
  setActiveTab,
  attributesData,
  attributesLoading,
  productsById
}) => {
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
        <Skeleton loading={attributesLoading}>
          {attributesData?.map((el, idx) => (
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
    <Box header title={'Pricing Information'} description={'Set product pricing and margins'}>
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

  return <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />;
};

export default ProductTabs;
