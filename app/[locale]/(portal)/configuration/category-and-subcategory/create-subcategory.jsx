import { Button, Form, Modal } from 'antd';
import { PlusGray } from '@/lib/const/icons';
import { FormInput, FormSwitch } from '@/components/ui/inputs';
import { useCreateCategory } from '@/hooks/useCategories';
import { useState } from 'react';
import { CrossIcon } from '@/lib/const/icons';

export default function CreateSubCategoryModal({ parentId }) {
  const [isOpen, setIsOpen] = useState(false);

  const category = useCreateCategory();

  const handleCancel = () => {
    setIsOpen(false);
  };

  const onFinish = async (values) => {
    try {
      await category.mutateAsync({
        ...values,
        parentCategoryId: parentId,
      });
    } catch (error) {
      console.error('Category creation failed:', error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true, null)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <PlusGray className="h-4 w-4" />
        Add Subcategory
      </button>

      <Modal
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        closeIcon={<CrossIcon className="h-5 w-5 text-gray-400" />}
        destroyOnHidden
      >
        <Form onFinish={onFinish} layout="vertical" className="py-2">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Create New Sub Category</h2>
            <p className="mt-1 text-sm text-gray-500">Add a new sub category for your products</p>
          </div>

          <FormInput label={'Sub Category Name *'} name={'name'} />

          {/* Visible to Customers Toggle */}
          <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <p className="font-medium text-gray-900">Visible to Customers</p>
              <p className="text-sm text-gray-500">Show this category on the store</p>
            </div>
            <FormSwitch className={'m-0!'} name={'isVisible'} />
            {/* <Switch checked={isVisible} onChange={setIsVisible} size="default" /> */}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3">
            <Button size="large" onClick={handleCancel} className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={category.isPending}
              disabled={category.isPending}
              className="px-16!"
            >
              Create
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
