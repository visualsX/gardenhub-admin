import React from 'react';
import {
  Tabs,
  Form,
  Skeleton,
  Checkbox,
  Select,
  Button,
  Divider,
  ColorPicker,
  Collapse,
  message,
} from 'antd';
import Cross from '@/public/shared/cross-20.svg';
import Trash from '@/public/shared/trash-red.svg';
import Edit from '@/public/shared/edit.svg';
import PlusGreen from '@/public/shared/plus-green-dark.svg';
import PlusGray from '@/public/shared/Plus-gray.svg';

import {
  FormInput,
  FormTextArea,
  FormSwitch,
  FormInputNumber,
  FormSelect,
} from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import CategoryCascader from '@/components/ui/select-dropdowns/CategoryCascader';
import VariantsTab from './VariantsTab';

const ProductTabs = ({
  activeTab,
  setActiveTab,
  attributesData,
  attributesLoading,
  productsById,
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
          rules={[]}
          name="ShortDescription"
          label="Short Description"
          placeholder="Enter short description"
          rows={3}
          className="mb-4"
        />
        <FormTextArea
          rules={[]}
          name="DetailedDescription"
          label="Detailed Description"
          placeholder="Enter detailed description"
          rows={4}
          className="mb-0"
        />
      </Box>

      <Box
        header
        title={'Product Variants'}
        description={'Manage product variations like size and color'}
      >
        <FormSwitch name="HasVariants" label="Has Variants" className="mb-4" />

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.HasVariants !== currentValues.HasVariants
          }
        >
          {({ getFieldValue }) => {
            const hasVariants = getFieldValue('HasVariants');
            return hasVariants ? (
              <Form.List name="Options">
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields.map(({ key, name, ...restField }) => (
                      <Box classRest="relative" header title={`Varient ${key + 1}`} key={key}>
                        <Trash onClick={() => remove(name)} className="absolute top-2 right-2" />
                        <div className="mb-4 grid grid-cols-[1fr_2fr] gap-4">
                          <FormInput
                            {...restField}
                            name={[name, 'name']}
                            label="Variant Name"
                            placeholder="e.g. Size, Color"
                            rules={[{ required: true, message: 'Missing variant name' }]}
                            className="mb-0"
                          />
                          <FormSelect
                            {...restField}
                            name={[name, 'type']}
                            label="Type"
                            rules={[{ required: true, message: 'Missing type' }]}
                            className="mb-0"
                            options={[
                              { value: 'Text', label: 'Text' },
                              { value: 'Color', label: 'Color' },
                            ]}
                          />
                        </div>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) =>
                            prevValues.Options?.[name]?.type !== currentValues.Options?.[name]?.type
                          }
                        >
                          {({ getFieldValue }) => {
                            const type = getFieldValue(['Options', name, 'type']);
                            return type === 'Color' ? (
                              <Form.List className="mb-0" name={[name, 'colors']}>
                                {(subFields, { add: addSub, remove: removeSub }) => (
                                  <div className="space-y-2">
                                    {subFields.map(({ key: subKey, name: subName, ...subRest }) => (
                                      <div className="flex w-full items-baseline gap-x-4">
                                        <div
                                          key={subKey}
                                          className="flex w-full items-center gap-x-4"
                                        >
                                          <FormInput
                                            {...subRest}
                                            name={[subName, 'name']}
                                            placeholder="Color Name"
                                            className="mb-0 flex-1"
                                            rules={[
                                              { required: true, message: 'Missing color name' },
                                            ]}
                                          />

                                          <Form.Item
                                            {...subRest}
                                            name={[subName, 'hex']}
                                            rules={[
                                              { required: true, message: 'Missing hex code' },
                                            ]}
                                            className="mb-0 flex-1"
                                            getValueFromEvent={(color) => {
                                              return typeof color === 'string'
                                                ? color
                                                : color.toHexString();
                                            }}
                                          >
                                            <ColorPicker
                                              size="large"
                                              className="[38px]! w-full"
                                              showText
                                              format="hex"
                                            />
                                          </Form.Item>
                                        </div>
                                        <Cross onClick={() => removeSub(subName)} />
                                      </div>
                                    ))}
                                    <Button
                                      type="default"
                                      onClick={() => addSub()}
                                      icon={<PlusGray />}
                                    >
                                      Add Value
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            ) : type === 'Text' ? (
                              <FormInput
                                {...restField}
                                name={[name, 'values']}
                                label="Values"
                                placeholder="e.g. S, M, L, XL"
                                rules={[{ required: true, message: 'Missing values' }]}
                                className="mb-0"
                              />
                            ) : null;
                          }}
                        </Form.Item>
                      </Box>
                    ))}

                    <Button
                      onClick={() => add()}
                      className="text-primary! bg-primary/10! border-primary/10! border"
                      icon={<PlusGreen />}
                    >
                      Add Another Varient
                    </Button>
                  </div>
                )}
              </Form.List>
            ) : null;
          }}
        </Form.Item>
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
          rules={[]}
        />
        <FormTextArea
          name="MetaDescription"
          label="Meta Description"
          placeholder="Enter meta description"
          rows={3}
          className="mb-4"
          rules={[]}
        />
        <FormInput rules={[]} name="Keywords" label="Keywords" placeholder="Enter keywords" className="mb-0" />
      </Box>
    </div>
  );

  const pricingTab = (
    <Box header title={'Pricing Information'} description={'Set product pricing and margins'}>
      <div className="grid grid-cols-2 gap-x-4">
        <FormInputNumber
          name="CostPrice"
          label="Cost Price"
          placeholder="0.00"
          suffix="AED"
          className="mb-4"
        />
        <FormInputNumber
          name="SalePrice"
          label="Sale Price"
          placeholder="0.00"
          suffix="AED"
          className="mb-4"
        />
        <FormInputNumber
          name="RegularPrice"
          label="Retail Price"
          placeholder="0.00"
          suffix="AED"
          className="mb-4"
        />
        <FormInputNumber
          name="Discount"
          label="Discount"
          placeholder="0"
          suffix="%"
          className="mb-0"
        />
      </div>
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
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.HasVariants !== curr.HasVariants}>
          {({ getFieldValue }) => {
            const hasVariants = getFieldValue('HasVariants');

            if (hasVariants) {
              return (
                <div className="text-gray-500 italic">
                  Stock management is handled at the variant level.
                </div>
              );
            }

            return (
              <>
                <FormSwitch name="TrackInventory" label="Track Inventory" className="mb-4" />

                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) => prev.TrackInventory !== curr.TrackInventory}
                >
                  {({ getFieldValue }) => {
                    const trackInventory = getFieldValue('TrackInventory');

                    if (!trackInventory) return null;

                    return (
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
                    );
                  }}
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      </Box>

      <Box header title={'Shipping Information'}>
        <div className="grid grid-cols-2 gap-4">
          <FormSwitch name="IsShippingRequired" label="Shipping Required" className="mb-4" />
          <FormSwitch name="IsFragile" label="Fragile Item" className="mb-0" />
        </div>
      </Box>
    </div>
  );

  const form = Form.useFormInstance();

  const tabItems = [
    { key: '1', label: 'General' },
    { key: '2', label: 'Pricing' },
    { key: '3', label: 'Specifications' },
    { key: '4', label: 'Inventory' },
    { key: '5', label: 'Variations' },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Render all tab content, but hide inactive ones */}
      <div style={{ display: activeTab === '1' ? 'block' : 'none' }}>{generalTab}</div>
      <div style={{ display: activeTab === '2' ? 'block' : 'none' }}>{pricingTab}</div>
      <div style={{ display: activeTab === '3' ? 'block' : 'none' }}>{specificationsTab}</div>
      <div style={{ display: activeTab === '4' ? 'block' : 'none' }}>{inventoryTab}</div>
      <div style={{ display: activeTab === '5' ? 'block' : 'none' }}>
        <VariantsTab editPage={!!productsById} productId={productsById?.id} />
      </div>
    </div>
  );
};

export default ProductTabs;
