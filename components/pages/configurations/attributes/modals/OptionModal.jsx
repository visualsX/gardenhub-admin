'use client';

import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import { useCreateOption, useUpdateOption } from '@/hooks/useAttributeMutations';
import { FormInput, FormTextArea, FormSelect } from '@/components/ui/inputs';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import useUiStates from '@/store/useUiStates';

export default function OptionModal({ attributes = [] }) {
  const { isModalOpen, closeModal } = useUiStates();
  const [form] = Form.useForm();
  const createOption = useCreateOption();
  const updateOption = useUpdateOption();

  const data = isModalOpen.data?.data;
  // Data can be:
  // 1. { attributeId: '...' } -> Add new option to specific attribute
  // 2. { id: '...', value: '...', attributeId: '...' } -> Edit existing option
  const isEdit = !!(data?.id && data?.value);
  const attributeId = data?.attributeId || data?.filterAttributeId;

  useEffect(() => {
    if (isModalOpen.open) {
      form.resetFields();
      if (isEdit) {
        form.setFieldsValue({
          value: data.value,
          description: data.description,
          attributeId: data.filterAttributeId || attributeId,
        });
      } else if (attributeId) {
        form.setFieldsValue({
          attributeId: attributeId,
        });
      }
    }
  }, [isModalOpen.open, data, attributeId, form, isEdit]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await updateOption.mutateAsync({ id: data.id, ...values });
      } else {
        await createOption.mutateAsync(values);
      }
      closeModal();
    } catch (e) {
      // Error handling in hook
    }
  };

  const attributeOptions = attributes.map((attr) => ({
    label: attr.name,
    value: attr.id,
  }));

  return (
    <ModalWrapper>
      <Form form={form} layout="vertical" onFinish={onFinish} className="py-2" requiredMark={false}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit Option' : 'Create New Option'}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? 'Update existing option details' : 'Add a new option value'}
          </p>
        </div>

        <FormSelect
          name="attributeId"
          label="Attribute *"
          placeholder="Select Attribute"
          options={attributeOptions}
          rules={[{ required: true, message: 'Please select an attribute' }]}
          disabled={!!attributeId} // Disable if pre-filled
        />

        <FormInput
          name="value"
          label="Option Value *"
          placeholder="e.g. Red, XL, Cotton"
          rules={[{ required: true, message: 'Please enter option value' }]}
        />

        <FormTextArea
          name="description"
          label="Description"
          placeholder="Optional description"
          rows={3}
        />

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <Button size="large" onClick={() => closeModal(false, null)} className="rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={createOption.isPending || updateOption.isPending}
            disabled={createOption.isPending || updateOption.isPending}
            className="rounded-lg bg-green-600 hover:bg-green-700"
          >
            {isEdit ? 'Update Option' : 'Create Option'}
          </Button>
        </div>
      </Form>
    </ModalWrapper>
  );
}
