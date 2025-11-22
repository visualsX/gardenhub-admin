'use client';

import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import Search from '@/public/shared/search.svg';
import PlusIcon from '@/public/shared/plus-green.svg';
import MinusIcon from '@/public/shared/minus-red.svg';
import SetValueIcon from '@/public/shared/blue-restart.svg';
import GoBack from '@/components/ui/go-back.jsx';
import Badge from '@/components/ui/badge';
import { Box } from '@/components/wrappers/box';
import DataTable from '@/components/shared/data-table';
import { FormInputNumber, FormTextArea } from '@/components/ui/inputs';
import { useInventory, useUpdateInventory } from '@/hooks/useInventory';
import SelectInventoryAdjustments from '@/components/ui/select-dropdowns/SelectInventoryAdjustments';
import InputSearch from '@/components/ui/input-search';

const PAGINATION_KEY = 'inventory-update-table';
const PAGE_SIZE = 8;

const statusBadge = (status) => {
  if (status === 'In Stock') return <Badge variant="success">In Stock</Badge>;
  if (status === 'Low Stock') return <Badge variant="warning">Low Stock</Badge>;
  return <Badge variant="danger">Out of Stock</Badge>;
};

const columns = [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (
      <div className="flex items-center gap-3">
        <span className="bg-primary/5 text-primary grid h-10 w-10 place-items-center rounded-xl text-lg font-semibold">
          {text.charAt(0)}
        </span>
        <span className="font-medium text-gray-900">{text}</span>
      </div>
    ),
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    render: (val) => <Badge variant="default">{val}</Badge>,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (val) => <Badge variant="transparent">{val}</Badge>,
  },
  {
    title: 'Current Stock',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock) => <span className="font-semibold text-gray-900">{stock}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: statusBadge,
  },
];

const UpdateStockPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const adjustInventory = useUpdateInventory();
  const { data, isLoading, isFetching, pageState } = useInventory({
    paginationKey: PAGINATION_KEY,
    pageSize: PAGE_SIZE,
  });

  const adjustmentType = Form.useWatch('adjustmentType', form);
  const isManual = adjustmentType === 'ManualCorrection';

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  const handleValuesChange = (changed) => {
    if (changed.adjustmentType) {
      if (changed.adjustmentType === 'ManualCorrection') {
        form.setFieldsValue({ adjustmentQuantity: undefined });
      } else {
        form.setFieldsValue({ newStockValue: undefined });
      }
    }
  };

  const onFinishHandle = (values) => {
    if (!selectedRowKeys.length) {
      message.error('Please select at least one product.');
      return;
    }

    const payload = {
      products: selectedRowKeys.map((key) => ({ productId: key })),
      adjustmentType: values.adjustmentType,
      adjustmentQuantity: isManual ? 0 : Number(values.adjustmentQuantity ?? 0),
      newStockValue: isManual ? Number(values.newStockValue ?? null) : null,
      reason: values.reason ?? '',
      referenceId: null,
    };

    adjustInventory.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setSelectedRowKeys([]);
      },
    });
  };

  return (
    <div className="min-h-screen space-y-6">
      <GoBack title="Update Stock" desc="Bulk update inventory levels across products" />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Box header title="Select Products" description="Choose products to update stock levels">
          <InputSearch
            className="mb-6"
            placeholder="Search products by name or SKU"
            onSearchChange={(value) => console.log('Search value:', value)}
          />
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <DataTable
              rowSelection={rowSelection}
              columns={columns}
              data={data?.nodes?.map((item) => ({ key: item.id, ...item }))}
              loading={isLoading || isFetching}
              pagination={false}
              cursorPaginationProps={{
                paginationKey: PAGINATION_KEY,
                pageInfo: data?.pageInfo ?? {},
                totalCount: data?.totalCount,
                pageSize: pageState.pageSize,
                loading: isLoading || isFetching,
              }}
              minHeight={400}
            />
          </div>
        </Box>

        <Box header title="Update Settings" description="Configure stock adjustment parameters">
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinishHandle}
            onValuesChange={handleValuesChange}
            requiredMark={false}
          >
            <SelectInventoryAdjustments name="adjustmentType" label="Inventory Adjustment Type" />

            {isManual ? (
              <FormInputNumber
                label="New Stock Value"
                name="newStockValue"
                placeholder="Enter stock value"
                type="number"
              />
            ) : (
              <FormInputNumber
                label="Quantity"
                name="adjustmentQuantity"
                placeholder="Enter quantity"
                type="number"
              />
            )}

            <FormTextArea
              name="reason"
              label="Reason"
              placeholder="Enter reason for adjustment..."
            />

            <Button
              type="primary"
              htmlType="submit"
              loading={adjustInventory.isPending}
              className="h-12 w-full rounded-2xl border border-green-700 bg-green-700 text-base font-semibold"
            >
              Update Changes
            </Button>
          </Form>
        </Box>
      </div>
    </div>
  );
};

export default UpdateStockPage;
