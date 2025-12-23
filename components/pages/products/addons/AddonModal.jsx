'use client';

import React, { useEffect } from 'react';
import { Form, Button } from 'antd';
import AddonForm from './AddonForm';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import { useCreateAddon, useUpdateAddon } from '@/hooks/useAddons';
import useUiStates from '@/store/useUiStates';

const AddonModal = () => {
  const { isModalOpen, closeModal } = useUiStates();
  const [form] = Form.useForm();

  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();

  const initialValues = isModalOpen.data;
  const isEdit = !!initialValues;
  const isLoading = createAddon.isPending || updateAddon.isPending;

  useEffect(() => {
    if (isModalOpen.open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({
          isActive: true,
          displayOrder: 0,
          options: [],
        });
      }
    }
  }, [isModalOpen.open, initialValues, form]);

  const handleOk = async (values) => {
    try {
      if (isEdit) {
        await updateAddon.mutateAsync({ ...values, id: initialValues.id });
      } else {
        await createAddon.mutateAsync(values);
      }
      closeModal();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <ModalWrapper width={800}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOk}
        requiredMark={false}
        className="py-2"
        initialValues={{
          isActive: true,
          displayOrder: 0,
          options: [],
        }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit Addon' : 'Add New Addon'}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? 'Update existing addon details'
              : 'Add a new global addon (e.g., Warranty, Gift Wrap)'}
          </p>
        </div>

        <AddonForm />

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
            {isEdit ? 'Update Addon' : 'Create Addon'}
          </Button>
        </div>
      </Form>
    </ModalWrapper>
  );
};

export default AddonModal;
