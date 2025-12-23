import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Upload, Form, message } from 'antd';
// import DeleteIcon from '@/public/shared/trash.svg';
// import { useDeleteProductImage, useUpdateProductImage } from '@/hooks/products/useProduct';

const SingleImageUploader = forwardRef(
  (
    {
      name = 'images',
      label = 'Images',
      className,
      existingImage,
      editPage = false,
      // productId,
      // onDeleteImage, // callback for delete API
      // onUploadImage, // callback for upload API
      // isFetching,
    },
    ref
  ) => {
    const getInitialFile = () => {
      if (!editPage || !existingImage) return [];
      return [
        {
          uid: '-1',
          name: existingImage?.imageUrl.split('/').pop() || 'existing-image',
          status: 'done',
          url: existingImage?.imageUrl, // MOST IMPORTANT for preview
          isExisting: true, // Mark as existing image from API
        },
      ];
    };

    const [fileList, setFileList] = useState(getInitialFile());
    const [existingImageDeleted, setExistingImageDeleted] = useState(false);

    // Expose method to parent component to get existing image URL if not deleted
    useImperativeHandle(ref, () => ({
      getExistingImageUrl: () => {
        if (editPage && existingImage && !existingImageDeleted) {
          return existingImage.imageUrl;
        }
        return null;
      },
      hasExistingImage: () => editPage && existingImage && !existingImageDeleted,
    }));

    useEffect(() => {
      if (editPage && existingImage) {
        setFileList(getInitialFile());
        setExistingImageDeleted(false);
      }
    }, [editPage, existingImage]);

    const handleChange = async ({ file, fileList: newFileList }) => {
      // If user uploads a new file, replace the existing one
      setFileList(newFileList);

      // If there was an existing image and user uploads new one, mark existing as deleted
      if (editPage && existingImage && file.status !== 'removed') {
        setExistingImageDeleted(true);
      }
    };

    const handleRemove = async (file) => {
      // If removing an existing image from API
      if (file.isExisting && editPage && existingImage) {
        setExistingImageDeleted(true);
        setFileList([]);
      } else {
        // Removing a newly uploaded file
        setFileList([]);
      }
      return true;
    };

    const uploadProps = {
      listType: 'picture-card',
      fileList,
      defaultFileList: fileList,
      onChange: handleChange,
      onRemove: handleRemove,
      maxCount: 1,
      accept: 'image/*',
      showUploadList: { showRemoveIcon: true },
      beforeUpload: () => false, // local upload only
    };

    return (
      <div className={className}>
        <Form.Item
          name={name}
          label={label}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e.slice(-1) : e?.fileList?.slice(-1) || [])}
        >
          <Upload {...uploadProps}>
            {fileList.length < 1 && (
              <div>
                <div className="mt-2 text-[14px] text-[#8c8c8c]">upload image here</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </div>
    );
  }
);

SingleImageUploader.displayName = 'SingleImageUploader';

export default SingleImageUploader;
