import { useState } from 'react';
import { Modal, Button, Form } from 'antd';
import { CrossIcon, PlusWhite, PlusGray } from '@/lib/const/icons';
import { FormInput, FormSwitch } from '@/components/ui/inputs';
import { useCreateCategory } from '@/hooks/useCategories';

export default function CreateCategoryModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const category = useCreateCategory();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    category.mutate(values);
  };

  return (
    <div className="">
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        <PlusWhite />
        Add Categories
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CrossIcon className="h-5 w-5 text-gray-400" />}
        width={600}
        centered
      >
        <Form onFinish={onFinish} layout="vertical" className="py-2">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Create New Category</h2>
            <p className="mt-1 text-sm text-gray-500">Add a new main category for your products</p>
          </div>

          <FormInput label={'Category Name *'} name={'name'} />

          {/* Add Subcategory Button */}
          <div className="mb-6">
            <Button
              icon={<PlusGray className="h-4 w-4" />}
              className="round flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Add Subcategory
            </Button>
          </div>

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
              className="rounded-lg bg-green-600 hover:bg-green-700"
            >
              Create Category
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
