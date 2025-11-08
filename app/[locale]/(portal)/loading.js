import { Spin } from 'antd';
import React from 'react';

export default function loading() {
  return (
    <div className="grid h-1/2 place-items-center">
      <Spin size="large" spinning />
    </div>
  );
}
