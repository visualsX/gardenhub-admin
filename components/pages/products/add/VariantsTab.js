import React, { useState } from 'react';
import { Form, Button, Collapse, message, Select, Dropdown, Menu, Modal, InputNumber } from 'antd';
import { Box } from '@/components/wrappers/box';
import { FormInput, FormInputNumber, FormSwitch } from '@/components/ui/inputs';
import Trash from '@/public/shared/trash-red.svg';
import Edit from '@/public/shared/edit.svg';
import DownIcon from '@/public/shared/select-down.svg';
import { generateCombinations, mergeVariants } from '@/lib/utils/productUtils';


const VariantsTab = ({ editPage, productId }) => {
  const form = Form.useFormInstance();
  const [bulkActionModalVisible, setBulkActionModalVisible] = useState(false);

  const [bulkActionType, setBulkActionType] = useState(null);
  const [bulkActionValue, setBulkActionValue] = useState(0);

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
      optionValues: options.map((opt) => ({
        name: opt.name,
        value: '',
      })),
    };

    // Add new variant at the top
    const updatedVariants = [newVariant, ...existingVariants];
    form.setFieldValue('Variants', updatedVariants);
    message.success('Manual variant added at the top.');
  };

  const handleBulkAction = (actionType) => {
    const variants = form.getFieldValue('Variants') || [];

    if (variants.length === 0) {
      message.warning('No variants to apply bulk action.');
      return;
    }

    switch (actionType) {
      case 'delete_all':
        Modal.confirm({
          title: 'Delete All Variations',
          content: 'Are you sure you want to delete all variations? This action cannot be undone.',
          okText: 'Delete',
          okType: 'danger',
          onOk: () => {
            form.setFieldValue('Variants', []);
            message.success('All variants deleted.');
          },
        });
        break;

      case 'toggle_stock':
        const updatedVariants = variants.map((v) => ({
          ...v,
          trackInventory: !v.trackInventory,
        }));
        form.setFieldValue('Variants', updatedVariants);
        message.success('Stock management toggled for all variants.');
        break;

      case 'set_price':
      case 'set_sale_price':
      case 'increase_price':
      case 'decrease_price':
      case 'increase_sale_price':
      case 'decrease_sale_price':
      case 'set_stock_quantity':
      case 'set_low_stock_threshold':
        setBulkActionType(actionType);
        setBulkActionValue(0);
        setBulkActionModalVisible(true);
        break;

      default:
        break;
    }
  };

  const handleBulkActionSubmit = () => {
    const variants = form.getFieldValue('Variants') || [];
    let updatedVariants = [...variants];

    switch (bulkActionType) {
      case 'set_price':
        updatedVariants = variants.map((v) => ({ ...v, price: bulkActionValue }));
        message.success(`Retail price set to ${bulkActionValue} for all variants.`);
        break;

      case 'set_sale_price':
        updatedVariants = variants.map((v) => ({ ...v, salePrice: bulkActionValue }));
        message.success(`Sale price set to ${bulkActionValue} for all variants.`);
        break;

      case 'increase_price':
        updatedVariants = variants.map((v) => ({
          ...v,
          price: (v.price || 0) + bulkActionValue,
        }));
        message.success(`Retail price increased by ${bulkActionValue} for all variants.`);
        break;

      case 'decrease_price':
        updatedVariants = variants.map((v) => ({
          ...v,
          price: Math.max(0, (v.price || 0) - bulkActionValue),
        }));
        message.success(`Retail price decreased by ${bulkActionValue} for all variants.`);
        break;

      case 'increase_sale_price':
        updatedVariants = variants.map((v) => ({
          ...v,
          salePrice: (v.salePrice || 0) + bulkActionValue,
        }));
        message.success(`Sale price increased by ${bulkActionValue} for all variants.`);
        break;

      case 'decrease_sale_price':
        updatedVariants = variants.map((v) => ({
          ...v,
          salePrice: Math.max(0, (v.salePrice || 0) - bulkActionValue),
        }));
        message.success(`Sale price decreased by ${bulkActionValue} for all variants.`);
        break;

      case 'set_stock_quantity':
        updatedVariants = variants.map((v) => ({
          ...v,
          stockQuantity: bulkActionValue,
          trackInventory: true, // Enable stock management when setting stock
        }));
        message.success(`Stock quantity set to ${bulkActionValue} for all variants.`);
        break;

      case 'set_low_stock_threshold':
        updatedVariants = variants.map((v) => ({
          ...v,
          lowStockThreshold: bulkActionValue,
          trackInventory: true, // Enable stock management when setting threshold
        }));
        message.success(`Low stock threshold set to ${bulkActionValue} for all variants.`);
        break;

      default:
        break;
    }

    form.setFieldValue('Variants', updatedVariants);
    setBulkActionModalVisible(false);
    setBulkActionType(null);
    setBulkActionValue(0);
  };

  const bulkActionItems = [
    {
      key: 'bulk_actions_label',
      label: 'Bulk actions',
      disabled: true,
      className: 'font-semibold',
    },
    {
      key: 'delete_all',
      label: 'Delete all variations',
    },
    {
      type: 'divider',
    },
    {
      key: 'pricing_label',
      label: 'Pricing',
      disabled: true,
      className: 'font-semibold text-gray-400',
    },
    {
      key: 'set_price',
      label: 'Set retail prices',
    },
    {
      key: 'increase_price',
      label: 'Increase retail prices (fixed amount)',
    },
    {
      key: 'decrease_price',
      label: 'Decrease retail prices (fixed amount)',
    },
    {
      key: 'set_sale_price',
      label: 'Set sale prices',
    },
    {
      key: 'increase_sale_price',
      label: 'Increase sale prices (fixed amount)',
    },
    {
      key: 'decrease_sale_price',
      label: 'Decrease sale prices (fixed amount)',
    },
    {
      type: 'divider',
    },
    {
      key: 'inventory_label',
      label: 'Inventory',
      disabled: true,
      className: 'font-semibold text-gray-400',
    },
    {
      key: 'toggle_stock',
      label: 'Toggle "Manage stock"',
    },
    {
      key: 'set_stock_quantity',
      label: 'Set stock quantity',
    },
    {
      key: 'set_low_stock_threshold',
      label: 'Set low stock threshold',
    },
  ];

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
          <Dropdown
            menu={{
              items: bulkActionItems,
              onClick: ({ key }) => handleBulkAction(key),
            }}
            trigger={['click']}
          >
            <Button>
              Bulk actions <DownIcon className="ml-1 inline-block" />
            </Button>
          </Dropdown>
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
                                <div className="text-base font-medium">{variantId}</div>
                                <div className="flex flex-1 gap-3">
                                  {options.map((option, optionIndex) => {
                                    // Get available values for this option
                                    let availableValues = [];
                                    if (option.type === 'Color' && Array.isArray(option.colors)) {
                                      availableValues = option.colors.map((c) => c.name);
                                    } else if (option.type === 'Text' && option.values) {
                                      availableValues = option.values
                                        .split(',')
                                        .map((v) => v.trim())
                                        .filter(Boolean);
                                    }

                                    const currentValue =
                                      variant?.optionValues?.[optionIndex]?.value || '';

                                    return (
                                      <Form.Item
                                        key={optionIndex}
                                        name={[name, 'optionValues', optionIndex, 'value']}
                                        noStyle
                                      >
                                        <Select
                                          placeholder={`Any ${option.name}...`}
                                          suffixIcon={<DownIcon />}
                                          className="min-w-[140px] flex-1"
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(value) => {
                                            // Update the variant name based on selected option values
                                            const currentVariant = form.getFieldValue([
                                              'Variants',
                                              name,
                                            ]);
                                            const updatedOptionValues = [
                                              ...(currentVariant.optionValues || []),
                                            ];
                                            updatedOptionValues[optionIndex] = {
                                              name: option.name,
                                              value: value,
                                            };

                                            // Generate new variant name from all option values
                                            const newName = updatedOptionValues
                                              .map((ov) => ov.value)
                                              .filter(Boolean)
                                              .join(', ');

                                            form.setFieldValue(
                                              ['Variants', name, 'name'],
                                              newName || 'New Variant'
                                            );
                                            form.setFieldValue(
                                              ['Variants', name, 'optionValues'],
                                              updatedOptionValues
                                            );
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
                            rules={[]}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <FormInputNumber
                            {...restField}
                            name={[name, 'price']}
                            label="Retail Price"
                            placeholder="Add Regular Price"
                            rules={[]}
                          />
                          <FormInputNumber
                            {...restField}
                            name={[name, 'salePrice']}
                            label="Sale Price"
                            placeholder="Add Sale Price"
                            rules={[]}
                          />
                          <FormInputNumber
                            {...restField}
                            name={[name, 'discount']}
                            label="Discount"
                            placeholder="Add Discount"
                            rules={[]}
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
                                  rules={[]}
                                />
                                <FormInputNumber
                                  {...restField}
                                  name={[name, 'lowStockThreshold']}
                                  label="Low Stock Threshold"
                                  placeholder="Add Value"
                                  rules={[]}
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
      </Box >

      <Modal
        title={
          bulkActionType === 'set_price'
            ? 'Set Retail Prices'
            : bulkActionType === 'set_sale_price'
              ? 'Set Sale Prices'
              : bulkActionType === 'increase_price'
                ? 'Increase Retail Prices'
                : bulkActionType === 'decrease_price'
                  ? 'Decrease Retail Prices'
                  : bulkActionType === 'increase_sale_price'
                    ? 'Increase Sale Prices'
                    : bulkActionType === 'decrease_sale_price'
                      ? 'Decrease Sale Prices'
                      : bulkActionType === 'set_stock_quantity'
                        ? 'Set Stock Quantity'
                        : bulkActionType === 'set_low_stock_threshold'
                          ? 'Set Low Stock Threshold'
                          : 'Bulk Action'
        }
        open={bulkActionModalVisible}
        onOk={handleBulkActionSubmit}
        onCancel={() => {
          setBulkActionModalVisible(false);
          setBulkActionType(null);
          setBulkActionValue(0);
        }}
        okText="Apply"
      >
        <div className="py-4">
          <label className="mb-2 block font-medium">
            {bulkActionType === 'set_stock_quantity'
              ? 'Stock Quantity:'
              : bulkActionType === 'set_low_stock_threshold'
                ? 'Low Stock Threshold:'
                : bulkActionType?.includes('set')
                  ? 'Price Value:'
                  : 'Amount to adjust:'}
          </label>
          <InputNumber
            value={bulkActionValue}
            onChange={(value) => setBulkActionValue(value || 0)}
            min={0}
            style={{ width: '100%' }}
            placeholder="Enter amount"
            prefix={bulkActionType?.includes('stock') ? null : '$'}
          />
        </div>
      </Modal>
    </div >
  );
};

export default VariantsTab;
