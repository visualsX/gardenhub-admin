'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button, message } from 'antd';
import { FormInput, FormInputNumber, FormSelect } from '@/components/ui/inputs';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import { useCreateFeaturedCategory, useUpdateFeaturedCategory, useUpdateFeaturedCategoryImage } from '@/hooks/useLandingPage';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { PLACEMENT_AREAS } from '@/lib/const/styling-dropdowns';
import useUiStates from '@/store/useUiStates';

const FeaturedCategoryModal = () => {
    const { isModalOpen, closeModal } = useUiStates();
    const [form] = Form.useForm();

    const createFeaturedCategory = useCreateFeaturedCategory();
    const updateFeaturedCategory = useUpdateFeaturedCategory();
    const { data: categories, isLoading: isCategoriesLoading } = useCategoryDropdown();

    const initialValues = isModalOpen.data;
    const isEdit = !!initialValues;
    const isLoading = createFeaturedCategory.isPending || updateFeaturedCategory.isPending;

    useEffect(() => {
        if (isModalOpen.open) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
                form.setFieldsValue({
                    displayOrder: 0,
                    placementArea: 'top-categories'
                });
            }
        }
    }, [isModalOpen.open, initialValues, form]);

    const handleOk = async (values) => {
        try {
            if (isEdit) {
                await updateFeaturedCategory.mutateAsync({ ...values, id: initialValues.id });
            } else {
                await createFeaturedCategory.mutateAsync(values);
            }

            closeModal();
        } catch (error) {
            console.error('Operation failed:', error);
        }
    };

    // Filter categories to only show top-level ones (parentCategoryId is null)
    const categoryOptions = categories
        ?.filter(cat => !cat.parentCategoryId)
        .map(cat => ({
            label: cat.name,
            value: cat.id
        })) || [];

    return (
        <ModalWrapper width={600}>
            <Form form={form} layout="vertical" onFinish={handleOk} className="py-2" requiredMark={false}>
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">{isEdit ? 'Edit Featured Category' : 'Add Featured Category'}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {isEdit ? 'Update existing featured category details' : 'Configure a new featured category for the landing page'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <FormSelect
                        name="categoryId"
                        label="Category"
                        placeholder="Select a category"
                        options={categoryOptions}
                        loading={isCategoriesLoading}
                        rules={[{ required: true, message: 'Please select a category' }]}
                        disabled={isEdit} // category usually doesn't change for featured category
                    />
                    <FormSelect
                        name="placementArea"
                        label="Placement Area"
                        placeholder="Select placement"
                        options={PLACEMENT_AREAS}
                        rules={[{ required: true, message: 'Please select a placement area' }]}
                    />
                    <FormInput
                        name="customTitle"
                        label="Custom Title (Optional)"
                        placeholder="Override category name"
                    />
                    <FormInputNumber
                        name="displayOrder"
                        label="Display Order"
                        min={0}
                        className="w-full"
                    />
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    <Button size="large" onClick={() => closeModal()} className="rounded-lg">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={isLoading}
                        disabled={isLoading}
                        className="rounded-lg bg-green-600 hover:bg-green-700 h-[45px] px-8"
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Form>
        </ModalWrapper>
    );
};

export default FeaturedCategoryModal;
