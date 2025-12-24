'use client';

import React, { useState } from 'react';
import { Button, Select, InputNumber, Switch, Popconfirm, Modal, Form } from 'antd';
import { PlusOutlined, } from '@ant-design/icons';
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
      form.setFieldsValue({
        globalAddonId: assignment.globalAddonId,
        isRequired: assignment.isRequired,
        displayOrder: assignment.displayOrder,
        isActive: assignment.isActive !== false,
      });
    } else {
      // Reset form for new assignment
      form.resetFields();
      form.setFieldsValue({
        isRequired: false,
        displayOrder: 0,
        isActive: true,
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
      if (editingAssignment) {
        // Update existing assignment
        await updateAssignment.mutateAsync({
          id: editingAssignment.globalAddonId,
          isRequired: values.isRequired,
          isActive: values.isActive,
          displayOrder: values.displayOrder,
          priceOverrides: [],
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
          priceOverrides: [],
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
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : (
          <>
            {assignedAddons && assignedAddons.length > 0 ? (
              <div className="space-y-3 mb-4">
                {assignedAddons.map((addon) => (
                  <Box key={addon.globalAddonId} classRest="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{addon.name}</h4>
                          <Badge  variant='success'>
                             {addon.isRequired ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                        <div className="text-xs border-with-radius px-4 py-1 block w-fit">
                          <span className='text-gray-500'>Type: </span>{addon.addonTypeName} | <span className='text-gray-500'>Display Order:</span> {addon.displayOrder}
                        </div>
                        {addon.options && addon.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-sm font-semibold">Options:</div>
                            <div className="flex gap-2 flex-wrap">
                              {addon.options.map((opt) => (
                              <div key={opt.id} className="text-xs text-gray-600 flex flex-col items-center gap-2 border-with-radius p-4">
                                <div className="grid grid-cols-[80px_1fr]">
                                 <div className="w-16 h-16 border-with-radius  grid place-items-center rounded-2xl overflow-hidden">
                                  {opt.imageUrl?<img src={opt.imageUrl} alt={opt.name} className="w-16 h-16 object-cover" />:<ImagePlaceholder className="h-8 w-8 text-gray-400" />}
                                 </div>
                                <div className="flex flex-col">
                                    <span>{opt.name}</span>
                                <span className="text-gray-400">
                                  {opt.salePrice || opt.price} AED
                                </span>
                                {opt.isDefault && <Badge variant='info'>Default</Badge>}
                                </div>
                                </div>
                              </div>
                            ))}
                            </div>
                          </div>
                        )}
                         <div className="mt-2 space-y-1">
                          <div className="text-sm font-semibold">Description:</div>
                        <div className='border-with-radius p-4'>
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
              <div className="text-center py-4 text-gray-500 mb-4">
                No addons assigned yet
              </div>
            )}

            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
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
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
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
          />
          <FormInputNumber
          name="displayOrder"
              label="Display Order"
              className="w-full" min={0}
          />
         </div>

            <InputWrapper title={"Set the Addon Required"} desc="If the addon is required, it will be mandatory for the customer to select it">
            <FormSwitch
             name="isRequired"
              valuePropName="checked"
            />
            </InputWrapper>
            <InputWrapper title={"Set the Addon Active"} desc="If the addon is active, it will be visible to the customer">
            <FormSwitch
               name="isActive"
            valuePropName="checked"
            />
            </InputWrapper>
            
        </Form>
      </Modal>
    </>
  );
}
