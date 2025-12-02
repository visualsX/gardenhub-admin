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

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data: realProductId, isLoading: productsLoading, isFetching } = useProductEdit(+id);

  const addProduct = useCreateProduct();
  // const { data, isLoading } = useAttributes();

  const duplicateOfRealProductsById = {
    costPrice: 10,
    detailedDescription: 'Basic details about the product',
    discount: 10,
    height: 12,
    id: 88,
    isActive: false,
    isFeatured: false,
    isFragile: true,
    isShippingRequired: true,
    keywords: 'Search engine optimization details',
    length: 12,
    lowStockThreshold: 12,
    metaDescription: 'Search engine optimization details\r\n\r\n',
    metaTitle: 'Options',
    name: 'Cactus',
    regularPrice: 200,
    salePrice: 100,
    shortDescription: 'Basic details about the product\r\n\r\n',
    sku: 'tes2',
    slug: 'cactus',
    stockQuantity: 0,
    stockStatus: 'Unknown',
    weight: 12,
    width: 12,
    images: [
      {
        id: 136,
        imageUrl:
          'https://api.gardenhub.ae/ProductImages/88-894d74a5-d09d-44d7-b593-e4a0827fa448.png',
        isMain: true,
      },
      {
        id: 137,
        imageUrl:
          'https://api.gardenhub.ae/ProductImages/88-e2f3abe1-7425-4093-8a05-58a1bb8ce69f.png',
        isMain: false,
      },
      {
        id: 138,
        imageUrl:
          'https://api.gardenhub.ae/ProductImages/88-4cd0c72f-7f60-40ff-a75f-8357cfe232fd.png',
        isMain: false,
      },
    ],
    categoriesWithPathsForEdit: [
      {
        currentCategory: {
          id: 59,
        },
        ancestors: [
          {
            id: 46,
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
            isSelected: true,
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
            isSelected: true,
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
            isSelected: true,
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
        id: 13,
        name: 'Size',
        type: 'Text',
        values: [
          {
            id: 29,
            value: 'S',
            colorHex: null,
          },
          {
            id: 30,
            value: 'M',
            colorHex: null,
          },
          {
            id: 31,
            value: 'L',
            colorHex: null,
          },
          {
            id: 32,
            value: 'XL',
            colorHex: null,
          },
        ],
      },
      {
        id: 14,
        name: 'Brands',
        type: 'Text',
        values: [
          {
            id: 33,
            value: 'Alpha',
            colorHex: null,
          },
          {
            id: 34,
            value: 'Beta',
            colorHex: null,
          },
          {
            id: 35,
            value: 'Gamma',
            colorHex: null,
          },
        ],
      },
      {
        id: 15,
        name: 'Colors',
        type: 'Color',
        values: [
          {
            id: 36,
            value: 'Brown',
            colorHex: '#d69393',
          },
          {
            id: 37,
            value: 'Magenta',
            colorHex: '#58a0a1',
          },
          {
            id: 38,
            value: 'Marinda',
            colorHex: '#ff9100',
          },
        ],
      },
    ],
    trackInventory: true,
    variants: [
      {
        id: 27,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-ALPHA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 28,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-ALPHA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 29,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-ALPHA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 30,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-BETA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 31,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-BETA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 32,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-BETA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 33,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-GAMMA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 34,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-GAMMA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 35,
        price: 200,
        salePrice: 0,
        sku: 'tes2-S-GAMMA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 29,
            value: 'S',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 36,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-ALPHA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 37,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-ALPHA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 38,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-ALPHA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 39,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-BETA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 40,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-BETA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 41,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-BETA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 42,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-GAMMA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 43,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-GAMMA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 44,
        price: 200,
        salePrice: 0,
        sku: 'tes2-M-GAMMA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 30,
            value: 'M',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 45,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-ALPHA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 46,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-ALPHA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 47,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-ALPHA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 48,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-BETA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 49,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-BETA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 50,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-BETA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 51,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-GAMMA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 52,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-GAMMA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 53,
        price: 200,
        salePrice: 0,
        sku: 'tes2-L-GAMMA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 31,
            value: 'L',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 54,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-ALPHA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 55,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-ALPHA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 56,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-ALPHA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 33,
            value: 'Alpha',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 57,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-BETA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 58,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-BETA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 59,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-BETA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 34,
            value: 'Beta',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
      {
        id: 60,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-GAMMA-BROWN',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 36,
            value: 'Brown',
            name: 'Colors',
          },
        ],
      },
      {
        id: 61,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-GAMMA-MAGENTA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 37,
            value: 'Magenta',
            name: 'Colors',
          },
        ],
      },
      {
        id: 62,
        price: 200,
        salePrice: 0,
        sku: 'tes2-XL-GAMMA-MARINDA',
        stockQuantity: 0,
        trackInventory: false,
        optionValues: [
          {
            id: 32,
            value: 'XL',
            name: 'Size',
          },
          {
            id: 35,
            value: 'Gamma',
            name: 'Brands',
          },
          {
            id: 38,
            value: 'Marinda',
            name: 'Colors',
          },
        ],
      },
    ],
  };
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
  }, [duplicateOfRealProductsById, form]);

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
