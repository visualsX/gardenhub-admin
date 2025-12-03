'use client';

import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload, Image } from 'antd';

const UploaderMax = ({ name = 'images', label = 'Upload Images', required = false, className }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file) => {
    // No fake loader → no getBase64 → rely on url / thumbUrl only
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(file.name || '');
    setPreviewOpen(true);
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
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        rules={[
          {
            required,
            message: 'Please upload at least one image',
          },
        ]}
      >
        <Upload listType="picture-card" onPreview={handlePreview} accept="image/*" multiple>
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
};

export default UploaderMax;
