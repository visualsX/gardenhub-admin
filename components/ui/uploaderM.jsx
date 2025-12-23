'use client';

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload, Image } from 'antd';

const UploaderMax = forwardRef(
  (
    {
      name = 'images',
      label = 'Upload Images',
      required = false,
      className,
      existingImages = [], // Array of existing images from API
      editPage = false,
    },
    ref
  ) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewTitle, setPreviewTitle] = useState('');
    const [deletedExistingUrls, setDeletedExistingUrls] = useState(new Set());

    // Expose method to parent to get existing URLs that weren't deleted
    useImperativeHandle(ref, () => ({
      getExistingImageUrls: () => {
        if (!editPage) return [];

        const additionalImages = existingImages.filter((img) => !img.isMain);
        return additionalImages
          .map((img) => img.imageUrl)
          .filter((url) => !deletedExistingUrls.has(url));
      },
    }));

    const handlePreview = async (file) => {
      setPreviewImage(file.url || file.thumbUrl);
      setPreviewTitle(file.name || '');
      setPreviewOpen(true);
    };

    const handleRemove = (file) => {
      // If it's an existing image from API, track it as deleted
      if (file.isExisting && file.existingUrl) {
        setDeletedExistingUrls((prev) => new Set([...prev, file.existingUrl]));
      }
      return true; // Allow removal
    };

    const UploadButton = (
      <button className="" type="button">
        <PlusOutlined />
        <div>Upload</div>
      </button>
    );

    return (
      <div className={className}>
        <Form.Item
          layout="vertical"
          name={name}
          label={label}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}
          rules={[
            {
              required,
              message: 'Please upload at least one image',
            },
          ]}
        >
          <Upload
            listType="picture-card"
            onPreview={handlePreview}
            onRemove={handleRemove}
            accept="image/*"
            multiple
            beforeUpload={() => false} // Prevent auto upload
          >
            {UploadButton}
          </Upload>
        </Form.Item>
        <Image
          className="w-full! object-contain"
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          title={previewTitle}
          src={previewImage}
        />
      </div>
    );
  }
);

UploaderMax.displayName = 'UploaderMax';

export default UploaderMax;
