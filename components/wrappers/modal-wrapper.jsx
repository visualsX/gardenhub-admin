// 'use client';
import { CrossIcon } from '@/lib/const/icons';

import { Modal } from 'antd';
import useUiStates from '@/store/useUiStates';

const ModalWrapper = ({ children, width }) => {
  const { isModalOpen, closeModal } = useUiStates();

  return (
    <Modal
      open={isModalOpen.open}
      onCancel={() => closeModal(false, null)}
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
