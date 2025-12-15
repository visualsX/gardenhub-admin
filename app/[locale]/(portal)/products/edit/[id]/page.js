'use client';
import React, { useState } from 'react';
import { Form, Button, message, Typography } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import { FormSwitch } from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import UploaderMax from '@/components/ui/uploaderM';
import SingleImageUploader from '@/components/ui/singleUpload';
import { useProductEdit, useUpdateProduct } from '@/hooks/products/useProduct';
import Link from 'next/link';
import { getLastIdx } from '@/lib/utils/helpers';
import ProductTabs from '@/components/pages/products/add/ProductTabs';
import {
  transformVariantDataForUpdate,
  mapOptionsToForm,
  mapVariantsToForm,
} from '@/lib/utils/productUtils';
import { useParams } from 'next/navigation';

const { Title, Text } = Typography;

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const { id } = useParams();


  const { data: realProductId, isLoading: productsLoading, isFetching } = useProductEdit(+id);

  const updateProduct = useUpdateProduct();
  // const { data, isLoading } = useAttributes();

  console.log('productsById:', realProductId);

  const onSubmit = (values) => {
    console.log('Form Values:', values);
    values['CategoryIds'] = getLastIdx(values.CategoryIds);

    // Use transformVariantDataForUpdate to preserve IDs
    values['OptionsJson'] = JSON.stringify(transformVariantDataForUpdate(values.Options));

    // Transform Variants to include IDs
    const variantsWithIds = values.Variants?.map(variant => ({
      id: variant.id || null, // Preserve variant ID
      sku: variant.sku,
      price: variant.price,
      salePrice: variant.salePrice,
      discount: variant.discount || 0,
      stockQuantity: variant.stockQuantity,
      lowStockThreshold: variant.lowStockThreshold,
      trackInventory: variant.trackInventory,
      optionValues: variant.optionValues?.map(ov => ({
        id: ov.id || null, // Preserve optionValue ID
        name: ov.name,
        value: ov.value,
      })) || [],
    })) || [];

    values['VariantsJson'] = JSON.stringify(variantsWithIds);
    values['Variants'] = null;
    values['Options'] = null;
    values['Id'] = +id;

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
    updateProduct.mutate({ id: id, data: formData });
  };

  const handleCancel = () => {
    form.resetFields();
    message.info('Form reset to initial values');
  };

  React.useEffect(() => {
    if (realProductId) {
      const initialValues = {
        Name: realProductId.name,
        Slug: realProductId.slug,
        Sku: realProductId.sku,
        ShortDescription: realProductId.shortDescription,
        DetailedDescription: realProductId.detailedDescription,
        MetaTitle: realProductId.metaTitle,
        MetaDescription: realProductId.metaDescription,
        Keywords: realProductId.keywords,
        RegularPrice: realProductId.regularPrice,
        costPrice: realProductId.costPrice,
        SalePrice: realProductId.salePrice,
        Discount: realProductId.discount,
        StockQuantity: realProductId.stockQuantity,
        Weight: realProductId.weight,
        Width: realProductId.width,
        Height: realProductId.height,
        Length: realProductId.length,
        LowStockThreshold: realProductId.lowStockThreshold,
        IsFeatured: realProductId.isFeatured,
        IsActive: realProductId.isActive,
        HasVariants: realProductId.hasVariants,
        TrackInventory: realProductId.trackInventory,
        IsFragile: realProductId.isFragile,
        IsShippingRequired: realProductId.isShippingRequired,
        CostPrice: realProductId.costPrice,
        CategoryIds: realProductId.categoriesWithPathsForEdit
          .flatMap((item) => [...item.ancestors.map((a) => a.id), item.currentCategory.id])
          .sort((a, b) => a - b),
        FilterOptions: realProductId.allFilterAttributesWithSelection,
        Variants: mapVariantsToForm(realProductId.variants),
        Options: mapOptionsToForm(realProductId.options),
      };

      // Map dynamic attributes to form fields
      realProductId.allFilterAttributesWithSelection.forEach((attr, idx) => {
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
  }, [form, realProductId]);

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
            loading={updateProduct.isPending}
            disabled={updateProduct.isPending}
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
                existingImage={realProductId?.images?.find((img) => img?.isMain)}
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
                attributesData={realProductId?.allFilterAttributesWithSelection}
                attributesLoading={productsLoading}
                productsById={realProductId}
              />
            </Box>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductManagement;
