'use client';
import React, { useState } from 'react';
import { Form, Button, message, Typography } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import { FormSwitch } from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import UploaderMax from '@/components/ui/uploaderM';
import SingleImageUploader from '@/components/ui/singleUpload';
import { useCreateProduct } from '@/hooks/products/useProduct';
import { useAttributes } from '@/hooks/useAttribute';
import Link from 'next/link';
import { getLastIdx } from '@/lib/utils/helpers';
import ProductTabs from '@/components/pages/products/add/ProductTabs';
import { transformVariantData } from '@/lib/utils/productUtils';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const ProductManagement = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  const addProduct = useCreateProduct();
  const { data, isLoading } = useAttributes();

  const onSubmit = (values) => {
    values['CategoryIds'] = getLastIdx(values.CategoryIds);
    values['OptionsJson'] = values.Options
      ? JSON.stringify(transformVariantData(values.Options))
      : null;
    values['VariantsJson'] = values.Variants ? JSON.stringify(values.Variants) : null;
    values['Variants'] = null;
    values['Options'] = null;

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
    router.push('/products');
  };

  return (
    <Form
      initialValues={{
        Weight: 0,
        Length: 0,
        Width: 0,
        Height: 0,
        IsActive: true,
        IsFeatured: false,
        IsShippingRequired: true,
      }}
      requiredMark={false}
      form={form}
      onFinish={onSubmit}
      layout="vertical"
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
              <ProductTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                attributesData={data}
                attributesLoading={isLoading}
              />
            </Box>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ProductManagement;
