import React, { useState } from 'react';
import { Upload, Button, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUploadAddonOptionImage, useDeleteAddonOptionImage } from '@/hooks/useAddons';

const AddonOptionImageUploader = ({ optionId, imageUrl }) => {
  const [loading, setLoading] = useState(false);
  
  const uploadImage = useUploadAddonOptionImage();
  const deleteImage = useDeleteAddonOptionImage();

  const handleUpload = async ({ file }) => {
    try {
      setLoading(true);
      await uploadImage.mutateAsync({ optionId, file });
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await deleteImage.mutateAsync(optionId);
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="relative inline-block">
      {imageUrl ? (
        <div className="relative h-24 w-24 rounded-md border border-gray-200 overflow-hidden group">
          <img src={imageUrl} alt="Option" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {loading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />} />
            ) : (
              <Button 
                type="text" 
                icon={<DeleteOutlined style={{ color: 'white', fontSize: 20 }} />} 
                onClick={handleDelete}
              />
            )}
          </div>
        </div>
      ) : (
        <Upload
          name="image"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={handleUpload}
          disabled={loading}
        >
          {uploadButton}
        </Upload>
      )}
    </div>
  );
};

export default AddonOptionImageUploader;
