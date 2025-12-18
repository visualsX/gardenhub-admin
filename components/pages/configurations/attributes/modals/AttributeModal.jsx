'use client';

import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import { useCreateAttribute, useUpdateAttribute } from '@/hooks/useAttributeMutations';
import { FormInput, FormSwitch } from '@/components/ui/inputs';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import useUiStates from '@/store/useUiStates';

export default function AttributeModal() {
    const { isModalOpen, closeModal } = useUiStates();
    const [form] = Form.useForm();
    const createAttribute = useCreateAttribute();
    const updateAttribute = useUpdateAttribute();

    const initialValues = isModalOpen.data?.data;
    const isEdit = !!initialValues;

    useEffect(() => {
        if (isModalOpen.open) {
            form.resetFields();
            if (isEdit && initialValues) {
                form.setFieldsValue({
                    name: initialValues.name,
                    isMultiSelect: initialValues.isMultiSelect,
                });
            }
        }
    }, [isModalOpen.open, initialValues, form, isEdit]);

    const onFinish = async (values) => {
        try {
            if (isEdit) {
                await updateAttribute.mutateAsync({ id: initialValues.id, ...values });
            } else {
                await createAttribute.mutateAsync(values);
            }
            closeModal();
        } catch (e) {
            // Error handling in hook
        }
    };

    return (
        <ModalWrapper>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="py-2"
                requiredMark={false}
            >
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">{isEdit ? 'Edit Attribute' : 'Create New Attribute'}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {isEdit ? 'Update existing attribute details' : 'Add a new attribute for your products'}
                    </p>
                </div>

                <FormInput
                    name="name"
                    label="Attribute Name *"
                    placeholder="e.g. Material, Size, Color"
                    rules={[{ required: true, message: 'Please enter attribute name' }]}
                />

                <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                        <p className="font-medium text-gray-900">Allow Multiple Selection</p>
                        <p className="text-sm text-gray-500">Allow multiple options to be selected</p>
                    </div>
                    <FormSwitch
                        name="isMultiSelect"
                        className="mb-0!"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                        size="large"
                        onClick={() => closeModal(false, null)}
                        className="rounded-lg"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={createAttribute.isPending || updateAttribute.isPending}
                        disabled={createAttribute.isPending || updateAttribute.isPending}
                        className="rounded-lg bg-green-600 hover:bg-green-700"
                    >
                        {isEdit ? 'Update Attribute' : 'Create Attribute'}
                    </Button>
                </div>
            </Form>
        </ModalWrapper>
    );
}
