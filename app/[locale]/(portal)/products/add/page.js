'use client';
import React, { useState } from 'react';
import { Tabs, Form, Button, Tag, Avatar, message, Typography } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import Edit from '@/public/shared/edit-white.svg';
import X from '@/public/shared/Eye.svg';
import Plus from '@/public/shared/plus-white.svg';
import { FormInput, FormTextArea, FormSelect, FormSwitch } from '@/components/ui/inputs';

const { Title, Text } = Typography;

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('All Form Values:', values);

      const formData = {
        // General Tab
        productName: values.productName,
        sku: values.sku,
        category: values.category,
        subcategory: values.subcategory,
        shortDescription: values.shortDescription,
        detailedDescription: values.detailedDescription,
        seoTitle: values.seoTitle,
        metaDescription: values.metaDescription,
        keywords: values.keywords,

        // Pricing Tab
        retailPrice: values.retailPrice,
        costPrice: values.costPrice,
        discount: values.discount,

        // Specifications Tab
        lightRequirements: values.lightRequirements,
        petFriendly: values.petFriendly,
        growthRate: values.growthRate,
        careLevel: values.careLevel,
        wateringSchedule: values.wateringSchedule,
        weight: values.weight,
        dimensions: values.dimensions,

        // Inventory Tab
        currentStock: values.currentStock,
        lowStockThreshold: values.lowStockThreshold,
        shippingRequired: values.shippingRequired,
        shippingWeight: values.shippingWeight,
        boxSize: values.boxSize,
        shippingType: values.shippingType,
        fragileItem: values.fragileItem,

        // Status
        active: values.active,
        featured: values.featured,
      };

      console.log('Formatted Form Data:', formData);
      message.success('Product saved successfully!');

      // Here you can make API call
      // Example: await api.updateProduct(formData);
    } catch (error) {
      console.error('Validation Failed:', error);
      message.error('Please fill all required fields!');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    message.info('Form reset to initial values');
  };

  const initialValues = {
    productName: 'Fiddle Leaf Fig',
    sku: 'PLT-FLF-001',
    category: 'Indoor Plants',
    subcategory: 'Tropical Plants',
    shortDescription:
      'The Fiddle Leaf Fig is a popular indoor plant known for its large, violin-shaped leaves. Native to western Africa, this statement plant adds a touch of elegance to any space.',
    detailedDescription:
      'Perfect for brightening up living rooms, offices, or any indoor space, the Fiddle Leaf Fig has become a favorite among plant enthusiasts and interior designers alike. Its dramatic foliage and tree-like growth pattern make it an excellent focal point in modern and traditio',
    seoTitle: 'Fiddle Leaf Fig - Premium Indoor Plant | GardenHub',
    metaDescription:
      'Buy beautiful Fiddle Leaf Fig plants online. Large violin-shaped leaves perfect for modern interiors. Free shipping on orders over $50.',
    keywords: 'fiddle leaf fig, indoor plant, ficus lyrata, house plant',
    retailPrice: '49.99',
    costPrice: '25.99',
    discount: '0',
    lightRequirements: 'Bright Light, Indirect Light',
    petFriendly: 'No',
    growthRate: 'Moderate, centimetres in a month',
    careLevel: 'Medium',
    wateringSchedule: 'Weekly, when the soil is dry',
    weight: '500',
    currentStock: '45',
    lowStockThreshold: '10',
    shippingWeight: '18',
    boxSize: 'Large',
    shippingType: 'Oversized',
    active: true,
    featured: true,
    shippingRequired: true,
    fragileItem: true,
    dimensions: {
      length: '',
      width: '',
      height: '',
      depth: '',
    },
  };

  const colorOptions = [
    { value: 'Red', color: '#EF4444' },
    { value: 'Orange', color: '#F59E0B' },
    { value: 'Yellow', color: '#EAB308' },
    { value: 'Green', color: '#22C55E' },
    { value: 'Teal', color: '#14B8A6' },
    { value: 'Blue', color: '#3B82F6' },
  ];

  const categoryOptions = [
    { value: 'Indoor Plants', label: 'Indoor Plants' },
    { value: 'Outdoor Plants', label: 'Outdoor Plants' },
  ];

  const subcategoryOptions = [
    { value: 'Tropical Plants', label: 'Tropical Plants' },
    { value: 'Succulents', label: 'Succulents' },
  ];

  const petFriendlyOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const careLevelOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ];

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
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            Product Information
          </Text>
          <div className="mt-1 text-sm text-gray-500">Basic details about the product</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="productName"
            label="Product Name"
            placeholder="Enter product name"
            rules={[{ required: true, message: 'Please enter product name' }]}
            className="mb-4"
          />
          <FormInput
            name="sku"
            label="Stock Keeping Unit (SKU)"
            placeholder="Enter SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
            className="mb-4"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="category"
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            rules={[{ required: true, message: 'Please select category' }]}
            className="mb-4"
          />
          <FormSelect
            name="subcategory"
            label="Subcategory"
            placeholder="Select subcategory"
            options={subcategoryOptions}
            className="mb-4"
          />
        </div>
        <FormTextArea
          name="shortDescription"
          label="Short Description"
          placeholder="Enter short description"
          rows={3}
          className="mb-4"
        />
        <FormTextArea
          name="detailedDescription"
          label="Detailed Description"
          placeholder="Enter detailed description"
          rows={4}
          className="mb-0"
        />
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            Attributes & Tags
          </Text>
        </div>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <Text strong>Benefits</Text>
            <Button type="link" danger icon={<X size={16} />} className="h-auto p-0" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag>High O2</Tag>
            <Tag>Statement Plant</Tag>
            <Tag>Air Purifying</Tag>
            <Tag>Pet Friendly</Tag>
          </div>
        </div>
        <div className="mb-0">
          <div className="mb-2 flex items-center justify-between">
            <Text strong>Type of Plant</Text>
            <Button type="link" danger icon={<X size={16} />} className="h-auto p-0" />
          </div>
          <div className="flex items-center gap-2">
            <Tag>Succulents</Tag>
            <Avatar size={40} src="/api/placeholder/40/40" />
            <Button type="link" icon={<Plus size={16} />} className="h-auto p-0">
              Add Attribute
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            Color
          </Text>
        </div>
        <div className="flex gap-4">
          {colorOptions.map((option) => (
            <div key={option.value} className="flex cursor-pointer flex-col items-center">
              <div
                className={`h-12 w-12 rounded-full border-2 ${
                  option.value === 'Red' ? 'border-gray-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: option.color }}
              />
              <Text className="mt-2 text-sm">{option.value}</Text>
            </div>
          ))}
          <div className="flex cursor-pointer flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300">
              <Plus size={20} />
            </div>
            <Text className="mt-2 text-sm">Add</Text>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            SEO Information
          </Text>
          <div className="mt-1 text-sm text-gray-500">Search engine optimization details</div>
        </div>
        <FormInput
          name="seoTitle"
          label="SEO Title"
          placeholder="Enter SEO title"
          className="mb-4"
        />
        <FormTextArea
          name="metaDescription"
          label="Meta Description"
          placeholder="Enter meta description"
          rows={3}
          className="mb-4"
        />
        <FormInput name="keywords" label="Keywords" placeholder="Enter keywords" className="mb-0" />
      </div>
    </div>
  );

  const pricingTab = (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <Text strong className="text-base">
          Pricing Information
        </Text>
        <div className="mt-1 text-sm text-gray-500">Set product pricing and margins</div>
      </div>
      <FormInput
        name="retailPrice"
        label="Retail Price"
        placeholder="0.00"
        type="number"
        suffix="AED"
        className="mb-4"
      />
      <FormInput
        name="costPrice"
        label="Cost Price"
        placeholder="0.00"
        type="number"
        suffix="AED"
        className="mb-4"
      />
      <FormInput
        name="discount"
        label="Discount"
        placeholder="0"
        type="number"
        suffix="%"
        className="mb-0"
      />
    </div>
  );

  const specificationsTab = (
    <div className="space-y-6">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            General Care Specs
          </Text>
        </div>
        <FormInput
          name="lightRequirements"
          label="Light Requirements"
          placeholder="Enter light requirements"
          className="mb-4"
        />
        <FormSelect
          name="petFriendly"
          label="Pet friendliness"
          placeholder="Select option"
          options={petFriendlyOptions}
          className="mb-4"
        />
        <FormInput
          name="growthRate"
          label="Growth rate"
          placeholder="Enter growth rate"
          className="mb-4"
        />
        <FormSelect
          name="careLevel"
          label="Care Level"
          placeholder="Select care level"
          options={careLevelOptions}
          className="mb-4"
        />
        <FormInput
          name="wateringSchedule"
          label="Watering schedule"
          placeholder="Enter watering schedule"
          className="mb-0"
        />
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            Product Dimensions
          </Text>
          <div className="mt-1 text-sm text-gray-500">Physical measurements of the product</div>
        </div>
        <FormInput
          name="weight"
          label="Weight"
          placeholder="0"
          type="number"
          suffix="grams"
          className="mb-4"
        />
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Dimensions (meters)
          </label>
          <div className="grid grid-cols-4 gap-3">
            <FormInput name={['dimensions', 'length']} placeholder="Length" type="number" noStyle />
            <FormInput name={['dimensions', 'width']} placeholder="Width" type="number" noStyle />
            <FormInput name={['dimensions', 'height']} placeholder="Height" type="number" noStyle />
            <FormInput name={['dimensions', 'depth']} placeholder="Depth" type="number" noStyle />
          </div>
        </div>
      </div>
    </div>
  );

  const inventoryTab = (
    <div className="space-y-6">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            Stock Management
          </Text>
          <div className="mt-1 text-sm text-gray-500">Manage inventory levels and alerts</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="currentStock"
            label="Current Stock"
            placeholder="0"
            type="number"
            className="mb-0"
          />
          <FormInput
            name="lowStockThreshold"
            label="Low Stock Threshold"
            placeholder="0"
            type="number"
            className="mb-0"
          />
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <Text strong className="text-base">
            Shipping Information
          </Text>
        </div>
        <FormSwitch name="shippingRequired" label="Shipping Required" className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="shippingWeight"
            label="Shipping Weight"
            placeholder="0"
            type="number"
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
          <FormSwitch name="fragileItem" label="Fragile Item" className="mb-0" />
        </div>
      </div>
    </div>
  );

  const tabItems = [
    { key: '1', label: 'General', children: generalTab },
    { key: '2', label: 'Pricing', children: pricingTab },
    { key: '3', label: 'Specifications', children: specificationsTab },
    { key: '4', label: 'Inventory', children: inventoryTab },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button type="text" icon={<ArrowLeft size={20} />} className="p-1" />
          <div>
            <div className="flex items-center gap-3">
              <Title level={4} className="m-0">
                Fiddle Leaf Fig
              </Title>
              <Tag color="green" className="m-0">
                In Stock
              </Tag>
            </div>
            <Text type="secondary" className="text-sm">
              SKU: PLT-FLF-001
            </Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button size="large" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            className="bg-green-700 hover:bg-green-800"
            onClick={onSubmit}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6">
          <div className="w-80 shrink-0">
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
              <Title level={5} className="mb-4">
                Product Images
              </Title>
              <div className="mb-4">
                <Text strong className="mb-2 block">
                  Main Image
                </Text>
                <div className="relative">
                  <img
                    src="/api/placeholder/280/280"
                    alt="Fiddle Leaf Fig"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      shape="circle"
                      icon={<Edit size={16} />}
                      className="border-0 bg-green-700 text-white hover:bg-green-800"
                      size="small"
                    />
                    <Button shape="circle" icon={<X size={16} />} danger size="small" />
                  </div>
                </div>
              </div>

              <div>
                <Text strong className="mb-2 block">
                  Additional Images
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative">
                      <img
                        src="/api/placeholder/130/130"
                        alt={`Additional ${i}`}
                        className="w-full rounded-lg"
                      />
                      <div className="absolute top-1 right-1 flex gap-1">
                        <Button
                          size="small"
                          shape="circle"
                          icon={<Edit size={12} />}
                          className="border-0 bg-green-700 text-white hover:bg-green-800"
                        />
                        <Button size="small" shape="circle" icon={<X size={12} />} danger />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <Title level={5} className="mb-4">
                Product Status
              </Title>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text>Active</Text>
                  <FormSwitch name="active" noStyle />
                </div>
                <div className="flex items-center justify-between">
                  <Text>Featured Product</Text>
                  <FormSwitch name="featured" noStyle />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <Form form={form} layout="vertical" initialValues={initialValues}>
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
