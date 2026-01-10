// 'use client';
import { CrossIcon } from '@/lib/const/icons';

import { Modal } from 'antd';
import useUiStates from '@/store/useUiStates';

const ModalWrapper = ({ children, width, open, onCancel }) => {
  const { isModalOpen, closeModal } = useUiStates();

  return (
    <Modal
      open={open ?? isModalOpen.open}
      onCancel={onCancel || (() => closeModal(false, null))}
      footer={null}
      closeIcon={<CrossIcon className="h-5 w-5 text-gray-400" />}
      width={width}
      destroyOnHidden
    >
      {children}
    </Modal>
  );
};

export default ModalWrapper;
