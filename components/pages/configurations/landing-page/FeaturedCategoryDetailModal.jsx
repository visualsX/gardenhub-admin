'use client';

import React, { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import ModalWrapper from '@/components/wrappers/modal-wrapper';
import { useUpdateFeaturedCategoryImage, useFeaturedCategory } from '@/hooks/useLandingPage';
import useUiStates from '@/store/useUiStates';
import SingleImageUploader from '@/components/ui/singleUpload';
import LabelAndValue from '@/components/ui/label-value';

const FeaturedCategoryDetailModal = () => {
  const { isDetailModalOpen, closeDetailModal } = useUiStates();
  const [form] = Form.useForm();
  const updateImage = useUpdateFeaturedCategoryImage();
  const imageFile = Form.useWatch('image', form);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const initialData = isDetailModalOpen.data;
  const { data: featuredCategory } = useFeaturedCategory(initialData?.id);
  const currentCategory = featuredCategory || initialData;

  useEffect(() => {
    if (isDetailModalOpen.open && currentCategory?.imageUrl) {
      form.setFieldsValue({
        image: [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: `${currentCategory.imageUrl}?v=${refreshCounter}`,
          },
        ],
      });
    } else if (isDetailModalOpen.open && !currentCategory?.imageUrl) {
      form.setFieldsValue({ image: [] });
    }
  }, [isDetailModalOpen.open, currentCategory?.imageUrl, refreshCounter, form]);

  const handleImageUpdate = async () => {
    if (!currentCategory?.id) return;

    const fileList = form.getFieldValue('image');
    if (fileList && fileList[0]?.originFileObj) {
      const formData = new FormData();
      formData.append('FeaturedCategoryId', currentCategory.id);
      formData.append('ImageFile', fileList[0].originFileObj);

      try {
        await updateImage.mutateAsync({ id: currentCategory.id, formData });
        setRefreshCounter((prev) => prev + 1);
        form.resetFields(['image']);
      } catch (error) {
        console.error('Failed to update image:', error);
      }
    }
  };

  return (
    <ModalWrapper width={700} open={isDetailModalOpen.open} onCancel={closeDetailModal}>
      <div className="py-2">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Featured Category Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              View details and manage category cover image
            </p>
          </div>
          <Button onClick={closeDetailModal}>Close</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <LabelAndValue label="Category" value={currentCategory?.categoryName} />
            <LabelAndValue label="Custom Title" value={currentCategory?.customTitle || 'N/A'} />
            <LabelAndValue
              label="Placement"
              value={currentCategory?.placementArea?.replace(/-/g, ' ')}
              className="capitalize"
            />
            <LabelAndValue label="Display Order" value={currentCategory?.displayOrder} />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <label className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-900">
              Cover Image
              <span className="text-[10px] font-normal text-gray-500">Recommended: 800x600px</span>
            </label>

            <Form form={form} layout="vertical">
              <SingleImageUploader
                name="image"
                label=""
                editPage={true}
                existingImage={
                  currentCategory?.imageUrl
                    ? { imageUrl: `${currentCategory.imageUrl}?v=${refreshCounter}` }
                    : null
                }
              />

              <Button
                type="primary"
                onClick={handleImageUpdate}
                loading={updateImage.isPending}
                disabled={!imageFile?.[0]?.originFileObj}
                className="h-[42px] w-full bg-green-600 hover:bg-green-700"
              >
                Update Image
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default FeaturedCategoryDetailModal;
