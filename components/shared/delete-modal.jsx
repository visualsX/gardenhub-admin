import { Button, Modal } from 'antd';
import DeleteWarnIcon from '@/public/shared/delete-warn.svg';
import useUiStates from '@/store/useUiStates';

export default function DeleteModal({
  onConfirm = () =>
    console.error('Default Function: Pass onConfirm prop in <DeleteModal/> for delete mutation! '),
  loading = false,
}) {
  const { isDeleteModalOpen, closeDeleteModal } = useUiStates();

  const handleDelete = () => {
    onConfirm();
  };
  return (
    <Modal
      centered
      open={isDeleteModalOpen.open}
      footer={null}
      closable={false}
      onCancel={() => closeDeleteModal(false, null)}
      width={400}
      className="m-0! p-0!"
    >
      <div className="text-content-color font-cairo flex flex-col gap-y-6 font-semibold">
        <div className="text-pinkish grid place-items-start gap-y-1">
          <DeleteWarnIcon />
          <span className="text-lg font-semibold">Delete product from DB?</span>
          <span className="text-sm font-normal">This action cannot be undone!</span>
        </div>
        <div className="grid gap-y-4">
          <div className="flex justify-start gap-4">
            <Button
              type="primary"
              onClick={() => closeDeleteModal(false, null)}
              disabled={loading}
              className="w-full!"
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              color="danger"
              variant="solid"
              onClick={handleDelete}
              loading={loading}
              disabled={loading}
              className="w-full!"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
