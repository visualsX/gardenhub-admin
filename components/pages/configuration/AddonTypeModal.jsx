'use client';

import React, { useEffect } from 'react';
import { Form, Button } from 'antd';
import { FormInput, FormTextArea, FormInputNumber, FormSwitch } from '@/components/ui/inputs';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import { useCreateAddonType, useUpdateAddonType } from '@/hooks/useAddons';
import useUiStates from '@/store/useUiStates';
import InputWrapper from '@/components/wrappers/input-wrapper';

const AddonTypeModal = () => {
  const { isModalOpen, closeModal } = useUiStates();
  const [form] = Form.useForm();

  const createAddonType = useCreateAddonType();
  const updateAddonType = useUpdateAddonType();

  const initialValues = isModalOpen.data;
  const isEdit = !!initialValues;
  const isLoading = createAddonType.isPending || updateAddonType.isPending;

  useEffect(() => {
    if (isModalOpen.open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({
          isActive: true,
          displayOrder: 0,
        });
      }
    }
  }, [isModalOpen.open, initialValues, form]);

  const handleOk = async (values) => {
    try {
      if (isEdit) {
        await updateAddonType.mutateAsync({ ...values, id: initialValues.id });
      } else {
        await createAddonType.mutateAsync(values);
      }
      closeModal();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <ModalWrapper>
      <Form form={form} layout="vertical" onFinish={handleOk} className="py-2" requiredMark={false}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit Addon Type' : 'Add Addon Type'}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? 'Update existing addon type details' : 'Add a new addon type'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <FormInput
            name="name"
            label="Name"
            placeholder="e.g. Gift Wrap"
            rules={[{ required: true, message: 'Please enter a name' }]}
          />
          <FormInputNumber name="displayOrder" label="Display Order" min={0} />
        </div>
        <FormTextArea
          name="description"
          label="Description"
          placeholder="Description of the addon type"
          rows={3}
        />
        <InputWrapper
          title={'Visible in Store'}
          desc={'If disabled, the addon type will not be visible in the store.'}
        >
          <FormSwitch name="isActive" className="mb-0!" />
        </InputWrapper>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button size="large" onClick={() => closeModal()} className="rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            className="rounded-lg bg-green-600 hover:bg-green-700"
          >
            {isEdit ? 'Update Type' : 'Create Type'}
          </Button>
        </div>
      </Form>
    </ModalWrapper>
  );
};

export default AddonTypeModal;
