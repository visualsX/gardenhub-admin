'use client';

import React, { useState } from 'react';
import { Button, InputNumber, Popconfirm, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Box } from '@/components/wrappers/box';
import {
  useProductAddons,
  useAssignProductAddon,
  useUpdateProductAddonAssignment,
  useDeleteProductAddonAssignment,
  useAddons,
} from '@/hooks/useAddons';

import Trash2 from '@/public/shared/trash-red.svg';
import Edit2 from '@/public/shared/edit-btn.svg';
import Badge from '@/components/ui/badge';
import ImagePlaceholder from '@/public/shared/sidebar/image-placeholder.svg';
import { FormInputNumber, FormSelect, FormSwitch } from '@/components/ui/inputs';
import InputWrapper from '@/components/wrappers/input-wrapper';

export default function ProductAddonAssignment({ productId, variantId = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [form] = Form.useForm();

  const { data: assignedAddons, isLoading } = useProductAddons(productId, variantId);
  const { data: availableAddons } = useAddons();
  const assignAddon = useAssignProductAddon();
  const updateAssignment = useUpdateProductAddonAssignment();
  const deleteAssignment = useDeleteProductAddonAssignment();

  const handleOpenModal = (assignment = null) => {
    setEditingAssignment(assignment);
    if (assignment) {
      // Populate form for editing
      const selectedAddon = availableAddons?.find((a) => a.id === assignment.globalAddonId);
      const priceOverrides =
        assignment.options?.map((opt) => ({
          globalAddonOptionId: opt.id,
          overridePrice: 0,
          _optionName: opt.name,
          _originalPrice: opt.defaultPrice || opt.salePrice || 0,
        })) || [];

      form.setFieldsValue({
        globalAddonId: assignment.globalAddonId,
        isRequired: assignment.isRequired,
        displayOrder: assignment.displayOrder,
        isActive: assignment.isActive !== false,
        priceOverrides: priceOverrides,
      });
    } else {
      // Reset form for new assignment
      form.resetFields();
      form.setFieldsValue({
        isRequired: false,
        displayOrder: 0,
        isActive: true,
        priceOverrides: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      // Clean price overrides - remove helper fields
      const cleanedOverrides = (values.priceOverrides || []).map((override) => ({
        globalAddonOptionId: override.globalAddonOptionId,
        overridePrice: override.overridePrice || 0,
      }));

      if (editingAssignment) {
        // Update existing assignment
        await updateAssignment.mutateAsync({
          id: editingAssignment.productAddonAssignmentId,
          isRequired: values.isRequired,
          isActive: values.isActive,
          displayOrder: values.displayOrder,
          priceOverrides: cleanedOverrides,
        });
      } else {
        // Create new assignment
        await assignAddon.mutateAsync({
          productId: parseInt(productId),
          productVariantId: variantId ? parseInt(variantId) : null,
          globalAddonId: values.globalAddonId,
          isRequired: values.isRequired,
          isActive: values.isActive,
          displayOrder: values.displayOrder,
          priceOverrides: cleanedOverrides,
        });
      }
      handleCloseModal();
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await deleteAssignment.mutateAsync(assignmentId);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <>
      <Box header title="Assigned Addons" description="Manage addon assignments">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {assignedAddons && assignedAddons.length > 0 ? (
              <div className="mb-4 space-y-3">
                {assignedAddons.map((addon) => (
                  <Box key={addon.globalAddonId} classRest="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="text-base font-semibold text-gray-900">{addon.name}</h4>
                          <Badge variant="success">
                            {addon.isRequired ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                        <div className="border-with-radius block w-fit px-4 py-1 text-xs">
                          <span className="text-gray-500">Type: </span>
                          {addon.addonTypeName} |{' '}
                          <span className="text-gray-500">Display Order:</span> {addon.displayOrder}
                        </div>
                        {addon.options && addon.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-sm font-semibold">Options:</div>
                            <div className="flex flex-wrap gap-2">
                              {addon.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="border-with-radius flex flex-col items-center gap-2 p-4 text-xs text-gray-600"
                                >
                                  <div className="grid grid-cols-[80px_1fr]">
                                    <div className="border-with-radius grid h-16 w-16 place-items-center overflow-hidden rounded-2xl">
                                      {opt.imageUrl ? (
                                        <img
                                          src={opt.imageUrl}
                                          alt={opt.name}
                                          className="h-16 w-16 object-cover"
                                        />
                                      ) : (
                                        <ImagePlaceholder className="h-8 w-8 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span>{opt.name}</span>
                                      <span className="text-gray-400">
                                        {opt.salePrice || opt.price} AED
                                      </span>
                                      {opt.isDefault && <Badge variant="info">Default</Badge>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-2 space-y-1">
                          <div className="text-sm font-semibold">Description:</div>
                          <div className="border-with-radius p-4">
                            <span>{addon.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex">
                        <Button
                          type="text"
                          icon={<Edit2 />}
                          onClick={() => handleOpenModal(addon)}
                        />
                        <Popconfirm
                          title="Delete assignment"
                          description="Are you sure you want to remove this addon?"
                          onConfirm={() => handleDelete(addon.productAddonAssignmentId)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 />}
                            loading={deleteAssignment.isPending}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  </Box>
                ))}
              </div>
            ) : (
              <div className="mb-4 py-4 text-center text-gray-500">No addons assigned yet</div>
            )}

            <Button type="dashed" block icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              Assign New Addon
            </Button>
          </>
        )}
      </Box>

      <Modal
        title={editingAssignment ? 'Update Addon Assignment' : 'Assign New Addon'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={assignAddon.isPending || updateAssignment.isPending}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <div className="grid grid-cols-2 gap-x-4">
            <FormSelect
              name="globalAddonId"
              label="Select Addon"
              placeholder="Choose an addon"
              options={availableAddons?.map((addon) => ({
                label: `${addon.name} (${addon.addonTypeName})`,
                value: addon.id,
              }))}
              disabled={!!editingAssignment}
              onChange={(value) => {
                // When addon changes, reset price overrides
                const selectedAddon = availableAddons?.find((a) => a.id === value);
                if (selectedAddon?.options) {
                  // Initialize with all options selected by default
                  const initialOverrides = selectedAddon.options.map((opt) => ({
                    globalAddonOptionId: opt.id,
                    overridePrice: 0,
                    _optionName: opt.name,
                    _originalPrice: opt.defaultPrice || opt.salePrice || 0,
                  }));
                  form.setFieldValue('priceOverrides', initialOverrides);
                }
              }}
            />
            <FormInputNumber name="displayOrder" label="Display Order" className="w-full" min={0} />
          </div>

          <InputWrapper
            title={'Set the Addon Required'}
            desc="If the addon is required, it will be mandatory for the customer to select it"
          >
            <FormSwitch name="isRequired" valuePropName="checked" />
          </InputWrapper>
          <InputWrapper
            title={'Set the Addon Active'}
            desc="If the addon is active, it will be visible to the customer"
          >
            <FormSwitch name="isActive" valuePropName="checked" />
          </InputWrapper>

          {/* Price Overrides Section */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.globalAddonId !== curr.globalAddonId}
          >
            {() => {
              const selectedAddonId = form.getFieldValue('globalAddonId');
              const selectedAddon = availableAddons?.find((a) => a.id === selectedAddonId);

              if (!selectedAddon?.options || selectedAddon.options.length === 0) {
                return null;
              }

              return (
                <Box
                  header
                  title={'Option Price Overrides'}
                  description={
                    'Select which options to include and optionally override their prices'
                  }
                >
                  <Form.List name="priceOverrides">
                    {(fields, { add, remove }) => (
                      <div className="border-with-radius max-h-60 space-y-2 overflow-y-auto! p-3">
                        {fields.map((field, index) => {
                          const { key, ...restField } = field;
                          const override = form.getFieldValue(['priceOverrides', field.name]);
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-2 rounded-2xl bg-gray-100 p-2"
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium">{override?._optionName}</div>
                                <div className="text-xs text-gray-500">
                                  Original: {override?._originalPrice} AED
                                </div>
                              </div>
                              <Form.Item
                                {...restField}
                                name={[restField.name, 'overridePrice']}
                                label="Override Price"
                                className="mb-0 w-32"
                              >
                                <InputNumber
                                  min={0}
                                  placeholder="Price"
                                  className="w-52"
                                  suffix="AED"
                                />
                              </Form.Item>
                              <Button
                                type="text"
                                danger
                                icon={<Trash2 />}
                                onClick={() => remove(restField.name)}
                              />
                              {/* Hidden fields to preserve option data */}
                              <Form.Item
                                {...restField}
                                name={[restField.name, 'globalAddonOptionId']}
                                hidden
                              >
                                <input />
                              </Form.Item>
                            </div>
                          );
                        })}

                        {fields.length < selectedAddon.options.length && (
                          <Button
                            type="dashed"
                            block
                            onClick={() => {
                              const currentOverrides = form.getFieldValue('priceOverrides') || [];
                              const usedOptionIds = currentOverrides.map(
                                (o) => o.globalAddonOptionId
                              );
                              const availableOption = selectedAddon.options.find(
                                (opt) => !usedOptionIds.includes(opt.id)
                              );
                              if (availableOption) {
                                add({
                                  globalAddonOptionId: availableOption.id,
                                  overridePrice: 0,
                                  _optionName: availableOption.name,
                                  _originalPrice:
                                    availableOption.defaultPrice || availableOption.salePrice || 0,
                                });
                              }
                            }}
                          >
                            Add Option
                          </Button>
                        )}
                      </div>
                    )}
                  </Form.List>
                </Box>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
