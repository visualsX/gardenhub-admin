'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Avatar,
  Space,
  Radio,
  Tag,
  Checkbox,
  DatePicker,
} from 'antd';
import { useRouter } from 'next/navigation';
import SegmentedTabs from '@/components/ui/segmented-tabs';
import { Box } from '@/components/wrappers/box';
import SingleImageUploader from '@/components/ui/singleUpload';
import MultiImageUploader from '@/components/ui/uploaderM';
import InputSearch from '@/components/ui/input-search';
import { useProductsForBundles } from '@/hooks/useBundle';
import Badge from '@/components/ui/badge';
import Trash2 from '@/public/shared/trash-red.svg';
import useUiStates from '@/store/useUiStates';
import DataTable from '@/components/shared/data-table';
import { PAGINATION_KEYS, DEFAULT_CURSOR_PAGE_SIZE } from '@/lib/const/pagination';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function BundleForm({ initialValues, onSubmit, isLoading, mode = 'create' }) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Image Upload refs
  const mainImageRef = useRef(null);
  const additionalImagesRef = useRef(null);

  // Product Selection State
  const [selectedProducts, setSelectedProducts] = useState(initialValues?.items || []);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products for selection (with variants)
  const { data: productsData, isLoading: isProductsLoading, pageState } = useProductsForBundles({
    paginationKey: PAGINATION_KEYS.BUNDLE_PRODUCTS,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where: searchTerm ? { name: { contains: searchTerm } } : null,
  });

  const pageInfo = productsData?.pageInfo ?? {};

  // Handle Form Submit
  const handleSubmit = async (values) => {
    // Extract Main Image File
    let mainImageFile = null;
    if (values.mainImage && values.mainImage.length > 0) {
      // Check if it's a new upload (has originFileObj) or existing
      const file = values.mainImage[0];
      if (file.originFileObj) {
        mainImageFile = file.originFileObj;
      }
    }

    // Extract Additional Images Files
    let additionalImageFiles = [];
    if (values.additionalImages && values.additionalImages.length > 0) {
      additionalImageFiles = values.additionalImages
        .filter((f) => f.originFileObj) // Only new files
        .map((f) => f.originFileObj);
    }

    // Collect ExistingImageUrls from both image uploaders
    const existingImageUrls = [];

    // Get main image URL if it exists and wasn't deleted
    const mainImageUrl = mainImageRef.current?.getExistingImageUrl();
    if (mainImageUrl) {
      existingImageUrls.push(mainImageUrl);
    }

    // Get additional image URLs that weren't deleted
    const additionalImageUrls = additionalImagesRef.current?.getExistingImageUrls() || [];
    existingImageUrls.push(...additionalImageUrls);

    // console.log('ExistingImageUrls to keep:', existingImageUrls);

    const payload = {
      ...values,
      mainImage: mainImageFile,
      additionalImages: additionalImageFiles,
      existingImageUrls: existingImageUrls,
      items: selectedProducts.map((p) => ({
        productId: p.id || p.productId,
        quantity: p.quantity || 1,
        productVariantId: p.productVariantId || null,
      })),
    };
    await onSubmit(payload);
  };

  // Calculate Summary
  const summary = useMemo(() => {
    const totalValue = selectedProducts.reduce(
      (sum, p) => sum + ((p.regularPrice || p.originalUnitPrice || 0) * (p.quantity || 1)),
      0
    );
    // We need to watch discount/price from form to calculate the rest.
    // For now, let's assume simple calculation based on form values or local state if we want real-time update.
    // But Form values are not easily accessible outside without watching.
    return {
      totalValue,
      count: selectedProducts.length,
    };
  }, [selectedProducts]);

  // Tab Options
  const tabOptions = [
    { label: 'Overview', key: 'overview' },
    { label: 'Products', key: 'products' },
    { label: 'Settings', key: 'settings' },
  ];


  // Transform initial values for images and other fields
  const transformedInitialValues = useMemo(() => {
    if (!initialValues) return {};

    const mainImg = initialValues.images?.find((i) => i.isMain);
    const addImgs = initialValues.images?.filter((i) => !i.isMain);

    return {
      ...initialValues,
      shortDescription: initialValues.shortDescription, // Map description from API to shortDescription form field
      expiryDate: initialValues.expiryDate ? dayjs(initialValues.expiryDate) : null,
      // Multi uploader expects fileList-like array
      additionalImages: addImgs?.map((img) => ({
        uid: img.id || img.imageUrl,
        name: 'image',
        status: 'done',
        url: img.imageUrl,
        isExisting: true,
        existingUrl: img.imageUrl,
      })),
    };
  }, [initialValues]);

  const mainImageObj = initialValues?.images?.find((i) => i.isMain);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={transformedInitialValues}
      onFinish={handleSubmit}
      className="pb-20"
    >
      {/* Header Title would go above this component or passed in */}

      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Bundle Images */}
          <Box title="Bundle Images" header>
            <SingleImageUploader
              name="mainImage"
              label="Main Image"
              className={'products-main'}
              existingImage={mainImageObj}
              editPage={mode === 'edit'}
              ref={mainImageRef}
            />
            <MultiImageUploader 
              name="additionalImages" 
              label="Additional Images" 
              className={'products-additionals'}
              existingImages={initialValues?.images || []}
              editPage={mode === 'edit'}
              ref={additionalImagesRef}
            />
          </Box>

          {/* Bundle Summary */}
          <Box title="Bundle Summary" header>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Products Selected</span>
                <span>{summary.count}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Value</span>
                <span className="line-through">${summary.totalValue.toFixed(2)}</span>
              </div>
              {/* Watch these values for real-time update */}
              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) => {
                  const discount = getFieldValue('discountPercentage') || 0;
                  const bundlePrice = summary.totalValue * (1 - discount / 100);
                  const saved = summary.totalValue - bundlePrice;

                  return (
                    <>
                      <div className="flex justify-between font-medium text-green-600">
                        <span>Discount</span>
                        <span>{discount}%</span>
                      </div>
                      <div className="border-smoke mt-2 flex justify-between border-t pt-2 text-xl font-bold text-gray-900">
                        <span>Bundle Price</span>
                        <span>${bundlePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Customer Saves</span>
                        <span>${saved.toFixed(2)}</span>
                      </div>
                    </>
                  );
                }}
              </Form.Item>
            </div>
          </Box>

          {/* Bundle Status */}
          <Box title="Bundle Status" header>
            <Form.Item name="isActive" label="Active" valuePropName="checked" className="mb-2">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
            <p className="mb-4 text-xs text-gray-500">Bundle will be visible to customers</p>

            <Form.Item
              name="isFeatured"
              label="Featured Bundle"
              valuePropName="checked"
              className="mb-2"
            >
              <Switch />
            </Form.Item>
            <p className="text-xs text-gray-500">Show on homepage</p>
          </Box>
        </div>

        {/* Right Content */}
        <div className="space-y-6 lg:col-span-2">
          <SegmentedTabs tabs={tabOptions} activeTab={activeTab} onChange={setActiveTab} />

          {/* OVERVIEW TAB */}
          <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
            <Box title="Basic Information" header description="Essential bundle details">
              <Form.Item name="name" label="Bundle name *" rules={[{ required: true }]}>
                <Input placeholder="Enter bundle name" />
              </Form.Item>
              <Form.Item name="shortDescription" label="Short Description">
                <TextArea rows={2} placeholder="Enter description" />
              </Form.Item>
              <Form.Item name="detailedDescription" label="Full Description">
                <TextArea rows={4} placeholder="Enter detailed description" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="discountPercentage"
                    label="Discount Percentage (%)"
                    initialValue={0}
                  >
                    <InputNumber min={0} max={100} className="w-full" />
                  </Form.Item>
                </Col>
              </Row>
            </Box>

            <Box
              title="SEO Information"
              header
              description="Optimize for search engines"
              classRest="mt-6"
            >
              <Form.Item name="metaTitle" label="SEO Title">
                <Input placeholder="Enter title for SEO" />
              </Form.Item>
              <Form.Item name="metaDescription" label="Meta Description">
                <TextArea rows={2} placeholder="Brief description for search results" />
              </Form.Item>
              <Form.Item name="keywords" label="Keywords">
                <Input placeholder="Comma separated keywords (e.g. garden, summer, tools)" />
              </Form.Item>
            </Box>
          </div>

          {/* PRODUCTS TAB */}
          <div className={activeTab === 'products' ? 'block' : 'hidden'}>
            <Box
              title="Select Products"
              header
              description="Choose products to include in this bundle"
            >
              <div className="mb-4">
                <InputSearch
                  placeholder="Search products..."
                  onSearchChange={setSearchTerm}
                  defaultValue={searchTerm}
                />
              </div>

              <DataTable
                data={productsData?.nodes || []}
                loading={isProductsLoading}
                rowKey="id"
                pagination={false}
                cursorPaginationProps={{
                  paginationKey: PAGINATION_KEYS.BUNDLE_PRODUCTS,
                  pageInfo,
                  totalCount: productsData?.totalCount ?? 0,
                  pageSize: pageState.pageSize,
                  loading: isProductsLoading,
                }}
                expandable={{
                  expandedRowRender: (record) => {
                    // Only show variants if product has them
                    if (!record.variants || record.variants.length === 0) {
                      return <p className="text-gray-500 py-2">No variants available</p>;
                    }

                    // Get selected variant IDs for this product
                    const selectedVariantIds = selectedProducts
                      .filter((p) => p.productId === record.id && p.productVariantId)
                      .map((p) => p.productVariantId);

                    return (
                      <div className="py-2">
                        <p className="text-sm font-medium mb-2">Select Variant(s):</p>
                        <Space direction="vertical" className="w-full">
                          {record.variants.map((variant) => (
                            <Checkbox
                              key={variant.id}
                              checked={selectedVariantIds.includes(variant.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;

                                setSelectedProducts((prev) => {
                                  if (isChecked) {
                                    // Add variant to selected products
                                    return [
                                      ...prev,
                                      {
                                        id: record.id,
                                        productId: record.id,
                                        productVariantId: variant.id,
                                        name: record.name,
                                        variantName: variant.name,
                                        regularPrice: variant.price,
                                        sku: variant.sku,
                                        images: record.images,
                                        quantity: 1,
                                      },
                                    ];
                                  } else {
                                    // Remove this specific variant
                                    return prev.filter(
                                      (p) =>
                                        !(p.productId === record.id && p.productVariantId === variant.id)
                                    );
                                  }
                                });
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <span className="font-medium">{variant.name}</span>
                                  {variant.optionValues && variant.optionValues.length > 0 && (
                                    <div className="mt-1">
                                      {variant.optionValues.map((opt, idx) => (
                                        <Tag key={idx} className="mr-1">
                                          {opt.name}: {opt.value}
                                          {opt.colorHex && (
                                            <span
                                              className="ml-1 inline-block w-3 h-3 rounded-full border"
                                              style={{ backgroundColor: opt.colorHex }}
                                            />
                                          )}
                                        </Tag>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-medium">${variant.price?.toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">
                                    SKU: {variant.sku} | Stock: {variant.stockQuantity}
                                  </div>
                                </div>
                              </div>
                            </Checkbox>
                          ))}
                        </Space>
                      </div>
                    );
                  },
                  rowExpandable: (record) => record.variants && record.variants.length > 0,
                }}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: (() => {
                    // Calculate which products should have their parent checkbox checked
                    const keys = [];
                    productsData?.nodes?.forEach((product) => {
                      if (product.variants && product.variants.length > 0) {
                        // Product with variants - check if all variants are selected
                        const selectedVariantIds = selectedProducts
                          .filter((p) => p.productId === product.id && p.productVariantId)
                          .map((p) => p.productVariantId);
                        
                        if (selectedVariantIds.length === product.variants.length) {
                          keys.push(product.id);
                        }
                      } else {
                        // Product without variants - check if it's selected
                        const isSelected = selectedProducts.some(
                          (p) => p.productId === product.id && !p.productVariantId
                        );
                        if (isSelected) {
                          keys.push(product.id);
                        }
                      }
                    });
                    return keys;
                  })(),
                  onChange: (selectedRowKeys, selectedRows) => {
                    // Determine which row was clicked by comparing with current state
                    const currentKeys = selectedProducts
                      .filter((p) => {
                        const product = productsData?.nodes?.find((n) => n.id === p.productId);
                        if (!product) return false;
                        if (product.variants && product.variants.length > 0) {
                          // For products with variants, only count if all variants selected
                          const variantCount = selectedProducts.filter(
                            (sp) => sp.productId === p.productId && sp.productVariantId
                          ).length;
                          return variantCount === product.variants.length;
                        }
                        return !p.productVariantId;
                      })
                      .map((p) => p.productId);

                    // Find the difference
                    const added = selectedRowKeys.filter((key) => !currentKeys.includes(key));
                    const removed = currentKeys.filter((key) => !selectedRowKeys.includes(key));

                    setSelectedProducts((prev) => {
                      let updated = [...prev];

                      // Handle added products
                      added.forEach((productId) => {
                        const product = productsData?.nodes?.find((n) => n.id === productId);
                        if (!product) return;

                        if (product.variants && product.variants.length > 0) {
                          // Remove any existing selections for this product
                          updated = updated.filter((p) => p.productId !== productId);
                          // Add all variants
                          const variantSelections = product.variants.map((variant) => ({
                            id: productId,
                            productId: productId,
                            productVariantId: variant.id,
                            name: product.name,
                            variantName: variant.name,
                            regularPrice: variant.price,
                            sku: variant.sku,
                            images: product.images,
                            quantity: 1,
                          }));
                          updated = [...updated, ...variantSelections];
                        } else {
                          // Add product without variant
                          updated.push({
                            id: productId,
                            productId: productId,
                            productVariantId: null,
                            name: product.name,
                            regularPrice: product.regularPrice,
                            sku: product.sku,
                            images: product.images,
                            stockQuantity: product.stockQuantity,
                            quantity: 1,
                          });
                        }
                      });

                      // Handle removed products
                      removed.forEach((productId) => {
                        updated = updated.filter((p) => p.productId !== productId);
                      });

                      return updated;
                    });
                  },
                  getCheckboxProps: (record) => {
                    // Calculate checkbox state based on variant selection
                    const selectedVariantIds = selectedProducts
                      .filter((p) => p.productId === record.id && p.productVariantId)
                      .map((p) => p.productVariantId);

                    const hasVariants = record.variants && record.variants.length > 0;

                    if (hasVariants) {
                      const allVariantsSelected = selectedVariantIds.length === record.variants.length;
                      const someVariantsSelected = selectedVariantIds.length > 0;

                      return {
                        indeterminate: someVariantsSelected && !allVariantsSelected,
                      };
                    }

                    return {};
                  },
                  preserveSelectedRowKeys: true,
                }}
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'name',
                    render: (text, record) => (
                      <div className="flex items-center gap-3">
                        <Avatar shape="square" src={record.images?.[0]?.imageUrl} />
                        <div>
                          <p className="font-medium">{text}</p>
                          <p className="text-xs text-gray-500">
                            In Stock: {record.stockQuantity}
                            {record.variants && record.variants.length > 0 && (
                              <Tag color="blue" className="ml-2">
                                {record.variants.length} variants
                              </Tag>
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Price',
                    dataIndex: 'regularPrice',
                    render: (val) => `$${val?.toFixed(2)}`,
                  },
                ]}
              />
            </Box>

            <Box
              title="Selected Products"
              header
              description="Products included in this bundle"
              classRest="mt-6"
            >
              <DataTable
                data={selectedProducts}
                rowKey={(r) => `${r.productId || r.id}-${r.productVariantId || 'base'}`}
                pagination={false}
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'name', // Or productName if coming from existing bundle items
                    render: (text, record) => (
                      <div>
                        <div className="font-medium">{record.name || record.productName}</div>
                        {record.variantName && (
                          <div className="text-xs text-gray-600 mt-1">
                            <Tag color="blue" size="small">
                              Variant: {record.variantName}
                            </Tag>
                          </div>
                        )}
                        {record.variantAttributes && (
                          <div className="text-xs text-gray-500 mt-1">{record.variantAttributes}</div>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: 'Price',
                    dataIndex: 'regularPrice', // Or originalUnitPrice
                    render: (val, record) =>
                      `$${(val || record.originalUnitPrice || 0).toFixed(2)}`,
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    render: (val, record) => (
                      <InputNumber
                        min={1}
                        value={val || 1}
                        onChange={(newVal) => {
                          setSelectedProducts((prev) =>
                            prev.map((p) => {
                              if (
                                (p.id || p.productId) === (record.id || record.productId) &&
                                (p.productVariantId || null) === (record.productVariantId || null)
                              ) {
                                return { ...p, quantity: newVal };
                              }
                              return p;
                            })
                          );
                        }}
                      />
                    ),
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    render: (_, record) => (
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => {
                          setSelectedProducts((prev) =>
                            prev.filter(
                              (p) =>
                                !(
                                  (p.id || p.productId) === (record.id || record.productId) &&
                                  (p.productVariantId || null) === (record.productVariantId || null)
                                )
                            )
                          );
                        }}
                      />
                    ),
                  },
                ]}
              />
            </Box>
          </div>

          {/* SETTINGS TAB */}
          <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
            <Box
              title="Bundle Settings"
              header
              description="Configure bundle options and restrictions"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="minQuantity" label="Minimum Quantity" initialValue={1}>
                    <InputNumber min={1} className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="maxQuantity" label="Maximum Quantity" initialValue={5}>
                    <InputNumber min={1} className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <div className="mt-4 space-y-4 border-t pt-4">
                <Form.Item name="isLimitedTime" valuePropName="checked" className="mb-0">
                  <div className="flex items-center justify-between">
                    <span>Limited Time Offer</span>
                    <Switch />
                  </div>
                </Form.Item>
                <Form.Item
                  name="showSavingsBadge"
                  valuePropName="checked"
                  className="mb-0"
                  initialValue={true}
                >
                  <div className="flex items-center justify-between">
                    <span>Show Savings Badge</span>
                    <Switch />
                  </div>
                </Form.Item>
                <Form.Item name="emailPromotion" valuePropName="checked" className="mb-0">
                  <div className="flex items-center justify-between">
                    <span>Email Promotion</span>
                    <Switch />
                  </div>
                </Form.Item>
                <Form.Item
                  name="giftWrapping"
                  valuePropName="checked"
                  className="mb-0"
                  initialValue={true}
                >
                  <div className="flex items-center justify-between">
                    <span>Gift Wrapping Available</span>
                    <Switch />
                  </div>
                </Form.Item>
              </div>
            </Box>

            <Box
              title="Availability"
              header
              description="Set bundle availability rules"
              classRest="mt-6"
            >
              <Form.Item name="expiryDate" label="Expiry Date">
                <DatePicker className="w-full" showTime />
              </Form.Item>
            </Box>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-smoke fixed right-0 bottom-0 left-0 z-10 flex items-center justify-between border-t bg-transparent px-8 py-4 backdrop-blur-[2px]">
        <div className="text-gray-600">
          Bundle ready: {summary.count} products, ${summary.totalValue.toFixed(2)}
        </div>
        <div className="flex gap-4">
          <Button size="large" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            className="bg-green-600"
          >
            {mode === 'create' ? 'Create Bundle' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Form>
  );
}
