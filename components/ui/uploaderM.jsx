'use client';

import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload, Image } from 'antd';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploaderMax = ({ name = 'images', label = 'Upload Images', required = false, className }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url?.substring(file.url?.lastIndexOf('/') + 1));
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
        multiple={false}
        count={0}
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
