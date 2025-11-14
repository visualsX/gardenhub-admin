import React, { useState } from 'react';
import { Upload, Form } from 'antd';

const SingleImageUploader = ({ name = 'images', label = 'Images', className }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Keep only one file
  };

  const uploadProps = {
    listType: 'picture-card',
    fileList,
    onChange: handleChange,
    maxCount: 1,
    accept: 'image/*',
    showUploadList: { showRemoveIcon: true },
    // No `action` → local preview only, no server upload
    beforeUpload: () => false, // Prevent auto-upload
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
              <div style={{ fontSize: 14, color: '#8c8c8c', marginTop: 8 }}>upload image here</div>
            </div>
          )}
        </Upload>
      </Form.Item>
    </div>
  );
};

export default SingleImageUploader;
