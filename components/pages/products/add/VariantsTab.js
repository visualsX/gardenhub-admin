import React from 'react';
import { Form, Button, Collapse, message, Select } from 'antd';
import { Box } from '@/components/wrappers/box';
import { FormInput, FormInputNumber, FormSwitch } from '@/components/ui/inputs';
import Trash from '@/public/shared/trash-red.svg';
import Edit from '@/public/shared/edit.svg';
import DownIcon from '@/public/shared/select-down.svg';
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

  const handleAddManually = () => {
    const values = form.getFieldsValue();
    const existingVariants = values.Variants || [];
    const options = values.Options || [];

    if (options.length === 0) {
      message.warning('Please add at least one option in the General tab first.');
      return;
    }

    // Create a new empty variant
    const newVariant = {
      name: 'New Variant',
      sku: '',
      price: 0,
      salePrice: 0,
      discount: 0,
      stockQuantity: 0,
      lowStockThreshold: 0,
      trackInventory: false,
      optionValues: options.map(opt => ({
        name: opt.name,
        value: ''
      }))
    };

    // Add new variant at the top
    const updatedVariants = [newVariant, ...existingVariants];
    form.setFieldValue('Variants', updatedVariants);
    message.success('Manual variant added at the top.');
  };

  return (
    <div className="space-y-6">
      <Box header title={'All Variants'} description={'Basic details about the product'}>
        <div className="mb-6 flex gap-3">
          <Button type="primary" className="bg-[#1B5E20]" onClick={handleGenerateVariants}>
            Generate Variants
          </Button>
          <Button type="default" onClick={handleAddManually}>
            Add Manually
          </Button>
        </div>

        <Form.List name="Variants">
          {(fields, { remove }) => (
            <div className="space-y-4">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="rounded-lg border border-gray-200 bg-white">
                  <Collapse ghost expandIconPosition="start" className="w-full">
                    <Collapse.Panel
                      header={
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, curr) => {
                            const prevOptions = prev.Variants?.[name]?.optionValues;
                            const currOptions = curr.Variants?.[name]?.optionValues;
                            return JSON.stringify(prevOptions) !== JSON.stringify(currOptions);
                          }}
                        >
                          {() => {
                            const values = form.getFieldsValue();
                            const options = values.Options || [];
                            const variant = values.Variants?.[name];
                            const variantId = variant?.id || `#${0 + name}`;

                            return (
                              <div className="flex w-full items-center gap-4 pr-4">
                                <div className="font-medium text-base">{variantId}</div>
                                <div className="flex flex-1 gap-3">
                                  {options.map((option, optionIndex) => {
                                    // Get available values for this option
                                    let availableValues = [];
                                    if (option.type === 'Color' && Array.isArray(option.colors)) {
                                      availableValues = option.colors.map(c => c.name);
                                    } else if (option.type === 'Text' && option.values) {
                                      availableValues = option.values
                                        .split(',')
                                        .map(v => v.trim())
                                        .filter(Boolean);
                                    }

                                    const currentValue = variant?.optionValues?.[optionIndex]?.value || '';

                                    return (
                                      <Form.Item
                                        key={optionIndex}
                                        name={[name, 'optionValues', optionIndex, 'value']}
                                        noStyle
                                      >
                                        <Select
                                          placeholder={`Any ${option.name}...`}
                                          suffixIcon={<DownIcon />}
                                          className="flex-1 min-w-[140px]"
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(value) => {
                                            // Update the variant name based on selected option values
                                            const currentVariant = form.getFieldValue(['Variants', name]);
                                            const updatedOptionValues = [...(currentVariant.optionValues || [])];
                                            updatedOptionValues[optionIndex] = {
                                              name: option.name,
                                              value: value
                                            };
                                            
                                            // Generate new variant name from all option values
                                            const newName = updatedOptionValues
                                              .map(ov => ov.value)
                                              .filter(Boolean)
                                              .join(', ');
                                            
                                            form.setFieldValue(['Variants', name, 'name'], newName || 'New Variant');
                                            form.setFieldValue(['Variants', name, 'optionValues'], updatedOptionValues);
                                          }}
                                        >
                                          {availableValues.map((val) => (
                                            <Select.Option key={val} value={val}>
                                              {val}
                                            </Select.Option>
                                          ))}
                                        </Select>
                                      </Form.Item>
                                    );
                                  })}
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
                            );
                          }}
                        </Form.Item>
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
