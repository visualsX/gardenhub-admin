import React, { useState, useEffect } from 'react';
import { Upload, Form, message } from 'antd';
import DeleteIcon from '@/public/shared/trash.svg';
import { useDeleteProductImage, useUpdateProductImage } from '@/hooks/useProduct';

const SingleImageUploader = ({
  name = 'images',
  label = 'Images',
  className,
  existingImage,
  editPage = false,
  productId,
  onDeleteImage, // callback for delete API
  onUploadImage, // callback for upload API
  isFetching,
}) => {
  const getInitialFile = () => {
    if (!editPage || !existingImage) return [];
    return [
      {
        uid: '-1',
        name: existingImage?.imageUrl.split('/').pop() || 'existing-image',
        status: 'done',
        url: existingImage?.imageUrl, // MOST IMPORTANT for preview
      },
    ];
  };

  const [fileList, setFileList] = useState(getInitialFile());
  console.log('filelist: ', fileList);
  useEffect(() => {
    if (editPage && existingImage) {
      setFileList(getInitialFile());
    }
  }, [editPage, existingImage]);

  const deleteImage = useDeleteProductImage();
  const updateImage = useUpdateProductImage();

  const handleChange = async ({ file, fileList: newFileList }) => {
    // If user uploads a new file
    // console.log('uploading file: ', file);

    setFileList(file);
    if (file.status !== 'removed') {
      const formData = new FormData();
      formData.append('IsMain', String(true)); // booleans must be strings
      formData.append('ImageFile', file); // file object goes directly

      const payload = {
        productId,
        formData,
      };
      updateImage?.mutate(payload, {
        onSuccess: () => {
          return true; // allow removal
        },
      });
    }

    // setFileList(latestFile);
  };

  const handleRemove = async (file) => {
    if (editPage && existingImage) {
      const ids = { productId, imageId: existingImage?.id };
      deleteImage.mutate(ids, {
        onSuccess: () => {
          setFileList([]);
          return true; // allow removal
        },
      });
    }
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
};

export default SingleImageUploader;
