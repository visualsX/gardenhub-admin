import React from 'react';
import { Form, Button, Collapse, message } from 'antd';
import { Box } from '@/components/wrappers/box';
import { FormInput, FormInputNumber, FormSwitch } from '@/components/ui/inputs';
import Trash from '@/public/shared/trash-red.svg';
import Edit from '@/public/shared/edit.svg';
import { generateCombinations, mergeVariants } from '@/lib/utils/productUtils';

const VariantsTab = () => {
  const form = Form.useFormInstance();

  const handleGenerateVariants = () => {
    const values = form.getFieldsValue();
    const options = values.Options || [];
    const mainSku = values.Sku || '';
    const existingVariants = values.Variants || [];

    if (options.length === 0) {
      message.warning('Please add at least one variant in the General tab.');
      return;
    }

    const combinations = generateCombinations(options);

    if (combinations.length === 0) {
      message.warning('Please ensure all variants have values.');
      return;
    }

    const mergedVariants = mergeVariants(existingVariants, combinations, mainSku);

    form.setFieldValue('Variants', mergedVariants);
    message.success(`${mergedVariants.length} variants generated/updated.`);
  };

  return (
    <div className="space-y-6">
      <Box header title={'All Variants'} description={'Basic details about the product'}>
        <Button type="primary" className="mb-6 bg-[#1B5E20]" onClick={handleGenerateVariants}>
          Generate Variants
        </Button>

        <Form.List name="Variants">
          {(fields, { remove }) => (
            <div className="space-y-4">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="rounded-lg border border-gray-200 bg-white">
                  <Collapse ghost expandIconPosition="start" className="w-full">
                    <Collapse.Panel
                      header={
                        <div className="flex w-full items-center justify-between pr-4">
                          <div className="w-1/4 font-medium">
                            <Form.Item
                              shouldUpdate={(prev, curr) =>
                                prev.Variants?.[name]?.name !== curr.Variants?.[name]?.name
                              }
                              noStyle
                            >
                              {() => (
                                <div className="truncate">
                                  {form.getFieldValue(['Variants', name, 'name'])}
                                </div>
                              )}
                            </Form.Item>
                          </div>
                          <div className="w-1/4 text-gray-500">
                            <Form.Item
                              shouldUpdate={(prev, curr) =>
                                prev.Variants?.[name]?.sku !== curr.Variants?.[name]?.sku
                              }
                              noStyle
                            >
                              {() => (
                                <div className="truncate">
                                  {form.getFieldValue(['Variants', name, 'sku'])}
                                </div>
                              )}
                            </Form.Item>
                          </div>
                          <div className="w-1/4 text-gray-500">
                            <Form.Item
                              shouldUpdate={(prev, curr) =>
                                prev.Variants?.[name]?.price !== curr.Variants?.[name]?.price
                              }
                              noStyle
                            >
                              {() => {
                                const price = form.getFieldValue(['Variants', name, 'price']);
                                return price ? price.toLocaleString() : '0';
                              }}
                            </Form.Item>
                          </div>
                          <div className="w-1/4 text-gray-500">
                            <Form.Item
                              shouldUpdate={(prev, curr) =>
                                prev.Variants?.[name]?.stockQuantity !==
                                curr.Variants?.[name]?.stockQuantity
                              }
                              noStyle
                            >
                              {() => form.getFieldValue(['Variants', name, 'stockQuantity']) || '0'}
                            </Form.Item>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trash
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(name);
                              }}
                            />
                            <Edit className="cursor-pointer" />
                          </div>
                        </div>
                      }
                      key={key}
                    >
                      <div className="border-t border-gray-100 p-4">
                        <FormSwitch
                          {...restField}
                          name={[name, 'trackInventory']}
                          label="Manage Stock?"
                          className="mb-4"
                        />

                        <div className="mb-4">
                          <FormInput
                            {...restField}
                            name={[name, 'sku']}
                            label="SKU"
                            placeholder="Add values"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <FormInputNumber
                            {...restField}
                            name={[name, 'price']}
                            label="Retail Price"
                            placeholder="Add Regular Price"
                          />
                          <FormInputNumber
                            {...restField}
                            name={[name, 'salePrice']}
                            label="Sale Price"
                            placeholder="Add Sale Price"
                          />
                          <FormInputNumber
                            {...restField}
                            name={[name, 'discount']}
                            label="Discount"
                            placeholder="Add Discount"
                          />
                        </div>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, curr) =>
                            prev.Variants?.[name]?.trackInventory !==
                            curr.Variants?.[name]?.trackInventory
                          }
                        >
                          {({ getFieldValue }) => {
                            const trackInventory = getFieldValue([
                              'Variants',
                              name,
                              'trackInventory',
                            ]);
                            return trackInventory ? (
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <FormInputNumber
                                  {...restField}
                                  name={[name, 'stockQuantity']}
                                  label="Stock Quantity"
                                  placeholder="Add Stock Quantity"
                                />
                                <FormInputNumber
                                  {...restField}
                                  name={[name, 'lowStockThreshold']}
                                  label="Low Stock Threshold"
                                  placeholder="Add Value"
                                />
                              </div>
                            ) : null;
                          }}
                        </Form.Item>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              ))}
            </div>
          )}
        </Form.List>
      </Box>
    </div>
  );
};

export default VariantsTab;
