'use client';
import React, { useState } from 'react';
import { Form, Button, message, Typography } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import { FormSwitch } from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import UploaderMax from '@/components/ui/uploaderM';
import SingleImageUploader from '@/components/ui/singleUpload';
import { useCreateProduct, useProductEdit } from '@/hooks/useProduct';
import { useAttributes } from '@/hooks/useAttribute';
import Link from 'next/link';
import { getLastIdx } from '@/lib/utils/helpers';
import ProductTabs from '@/components/pages/products/add/ProductTabs';
import { useSearchParams } from 'next/navigation';
import {
  transformVariantData,
  mapOptionsToForm,
  mapVariantsToForm,
} from '@/lib/utils/productUtils';

const { Title, Text } = Typography;

const duplicateOfRealProductsById = {
  costPrice: 20,
  detailedDescription: 'Product Information',
  discount: 10,
  height: 12,
  id: 105,
  isActive: true,
  isFeatured: true,
  isFragile: false,
  isShippingRequired: true,
  keywords: 'Product Information',
  length: 12,
  lowStockThreshold: 120,
  metaDescription: 'Product Information',
  metaTitle: 'Product Information',
  name: 'test-1',
  regularPrice: 999,
  salePrice: 200,
  shortDescription: 'Product Information',
  sku: '32af',
  slug: 'test-1',
  stockQuantity: 1001,
  stockStatus: 'Unknown',
  weight: 100,
  width: 12,
  images: [],
  categoriesWithPathsForEdit: [
    {
      currentCategory: {
        id: 57,
      },
      ancestors: [
        {
          id: 45,
        },
      ],
    },
  ],
  allFilterAttributesWithSelection: [
    {
      id: 1,
      isMultiSelect: false,
      name: 'Benefits',
      options: [
        {
          value: 'Roots Nourishment',
          id: 2,
          isSelected: false,
        },
        {
          value: 'String Roots',
          id: 1,
          isSelected: false,
        },
      ],
    },
    {
      id: 3,
      isMultiSelect: true,
      name: 'New Benefit',
      options: [
        {
          value: 'New Tag',
          id: 9,
          isSelected: false,
        },
      ],
    },
    {
      id: 2,
      isMultiSelect: true,
      name: 'Type of Plant',
      options: [
        {
          value: 'Dry',
          id: 4,
          isSelected: true,
        },
        {
          value: 'Gravity',
          id: 8,
          isSelected: false,
        },
        {
          value: 'Muddy',
          id: 6,
          isSelected: false,
        },
        {
          value: 'Sandish',
          id: 3,
          isSelected: false,
        },
        {
          value: 'Smoky',
          id: 7,
          isSelected: false,
        },
        {
          value: 'Wet',
          id: 5,
          isSelected: false,
        },
      ],
    },
  ],
  options: [
    {
      id: 38,
      name: 'Size',
      type: 'Text',
      values: [
        {
          id: 73,
          value: 'S',
          colorHex: null,
        },
        {
          id: 74,
          value: 'M',
          colorHex: null,
        },
        {
          id: 75,
          value: 'L',
          colorHex: null,
        },
      ],
    },
    {
      id: 39,
      name: 'Colors',
      type: 'Color',
      values: [
        {
          id: 76,
          value: 'White',
          colorHex: '#ffffff',
        },
        {
          id: 77,
          value: 'Black',
          colorHex: '#211e1e',
        },
      ],
    },
  ],
  trackInventory: true,
  variants: [
    {
      id: 75,
      price: 1000,
      salePrice: 200,
      sku: '32af-S-WHITE-zayan',
      stockQuantity: 1001,
      trackInventory: true,
      optionValues: [
        {
          id: 73,
          value: 'S',
          name: 'Size',
        },
        {
          id: 76,
          value: 'White',
          name: 'Colors',
        },
      ],
    },
    {
      id: 76,
      price: 999,
      salePrice: 0,
      sku: '32af-S-BLACK',
      stockQuantity: 0,
      trackInventory: false,
      optionValues: [
        {
          id: 73,
          value: 'S',
          name: 'Size',
        },
        {
          id: 77,
          value: 'Black',
          name: 'Colors',
        },
      ],
    },
    {
      id: 77,
      price: 999,
      salePrice: 0,
      sku: '32af-M-WHITE',
      stockQuantity: 0,
      trackInventory: false,
      optionValues: [
        {
          id: 74,
          value: 'M',
          name: 'Size',
        },
        {
          id: 76,
          value: 'White',
          name: 'Colors',
        },
      ],
    },
    {
      id: 78,
      price: 999,
      salePrice: 0,
      sku: '32af-M-BLACK',
      stockQuantity: 0,
      trackInventory: false,
      optionValues: [
        {
          id: 74,
          value: 'M',
          name: 'Size',
        },
        {
          id: 77,
          value: 'Black',
          name: 'Colors',
        },
      ],
    },
    {
      id: 79,
      price: 999,
      salePrice: 0,
      sku: '32af-L-WHITE',
      stockQuantity: 0,
      trackInventory: false,
      optionValues: [
        {
          id: 75,
          value: 'L',
          name: 'Size',
        },
        {
          id: 76,
          value: 'White',
          name: 'Colors',
        },
      ],
    },
    {
      id: 80,
      price: 999,
      salePrice: 0,
      sku: '32af-L-BLACK',
      stockQuantity: 0,
      trackInventory: false,
      optionValues: [
        {
          id: 75,
          value: 'L',
          name: 'Size',
        },
        {
          id: 77,
          value: 'Black',
          name: 'Colors',
        },
      ],
    },
  ],
};

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data: realProductId, isLoading: productsLoading, isFetching } = useProductEdit(+id);

  const addProduct = useCreateProduct();
  // const { data, isLoading } = useAttributes();

  console.log('productsById:', duplicateOfRealProductsById);

  const onSubmit = (values) => {
    console.log('Form Values:', values);
    values['CategoryIds'] = getLastIdx(values.CategoryIds);
    values['OptionsJson'] = JSON.stringify(transformVariantData(values.Options));
    values['VariantsJson'] = JSON.stringify(values.Variants);

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
    // console.log('FormData entries:');
    // for (const [k, v] of formData.entries()) {
    //   console.log(k, v);
    // }

    // Step 4: Submit
    addProduct.mutate(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    message.info('Form reset to initial values');
  };

  React.useEffect(() => {
    if (duplicateOfRealProductsById) {
      const initialValues = {
        Name: duplicateOfRealProductsById.name,
        Slug: duplicateOfRealProductsById.slug,
        Sku: duplicateOfRealProductsById.sku,
        ShortDescription: duplicateOfRealProductsById.shortDescription,
        DetailedDescription: duplicateOfRealProductsById.detailedDescription,
        MetaTitle: duplicateOfRealProductsById.metaTitle,
        MetaDescription: duplicateOfRealProductsById.metaDescription,
        Keywords: duplicateOfRealProductsById.keywords,
        RegularPrice: duplicateOfRealProductsById.regularPrice,
        SalePrice: duplicateOfRealProductsById.salePrice,
        Discount: duplicateOfRealProductsById.discount,
        StockQuantity: duplicateOfRealProductsById.stockQuantity,
        // stockStatus: duplicateOfRealProductsById.stockStatus,
        Weight: duplicateOfRealProductsById.weight,
        Width: duplicateOfRealProductsById.width,
        Height: duplicateOfRealProductsById.height,
        Length: duplicateOfRealProductsById.length,
        LowStockThreshold: duplicateOfRealProductsById.lowStockThreshold,
        IsFeatured: duplicateOfRealProductsById.isFeatured,
        IsActive: duplicateOfRealProductsById.isActive,
        IsFragile: duplicateOfRealProductsById.isFragile,
        IsShippingRequired: duplicateOfRealProductsById.isShippingRequired,
        CostPrice: duplicateOfRealProductsById.costPrice,
        CategoryIds: duplicateOfRealProductsById.categoriesWithPathsForEdit
          .flatMap((item) => [...item.ancestors.map((a) => a.id), item.currentCategory.id])
          .sort((a, b) => a - b),
        FilterOptions: duplicateOfRealProductsById.allFilterAttributesWithSelection,
        Variants: mapVariantsToForm(duplicateOfRealProductsById.variants),
        Options: mapOptionsToForm(duplicateOfRealProductsById.options),
      };

      // Map dynamic attributes to form fields
      duplicateOfRealProductsById.allFilterAttributesWithSelection.forEach((attr, idx) => {
        if (attr.isMultiSelect) {
          initialValues[`idx_${idx}`] = attr.options
            .filter((opt) => opt.isSelected)
            .map((opt) => opt.id);
        } else {
          const selectedOption = attr.options.find((opt) => opt.isSelected);
          initialValues[`idx_${idx}`] = selectedOption ? selectedOption.id : undefined;
        }
      });

      form.setFieldsValue(initialValues);
    }
  }, [form]);

  return (
    <Form requiredMark={false} form={form} onFinish={onSubmit} layout="vertical">
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
            <Box loading={productsLoading}>
              <Title level={5} className="mb-4">
                Product Images
              </Title>

              <SingleImageUploader
                name={'MainImage'}
                label="Main Image"
                className={'products-main'}
                editPage={id ? true : false}
                productId={+id}
                existingImage={duplicateOfRealProductsById?.images?.find((img) => img?.isMain)}
                isFetching={isFetching}
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
            <Box loading={productsLoading}>
              <ProductTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                attributesData={duplicateOfRealProductsById?.allFilterAttributesWithSelection}
                attributesLoading={productsLoading}
                productsById={duplicateOfRealProductsById}
              />
            </Box>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductManagement;
