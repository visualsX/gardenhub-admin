'use client';

import React, { useState } from 'react';
import { Button, Table, Space, Tag, Modal } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import Edit from '@/public/shared/edit.svg';
import Trash2 from '@/public/shared/trash-red.svg';
import { Box } from '@/components/wrappers/box';
import { useShippingZone, useDeleteShippingRate } from '@/hooks/useShipping';
import ShippingRateModal from '@/components/pages/shipping/ShippingRateModal';
import LabelAndValue from '@/components/ui/label-value';
import DataTable from '@/components/shared/data-table';

export default function ShippingZoneDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: zone, isLoading } = useShippingZone(+id);

  // Rate Management States
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [rateToDelete, setRateToDelete] = useState(null);
  const deleteRate = useDeleteShippingRate();

  const handleRateEdit = (rate) => {
    setEditingRate(rate);
    setIsRateModalOpen(true);
  };

  const handleAddRate = () => {
    setEditingRate(null);
    setIsRateModalOpen(true);
  };

  const confirmDeleteRate = () => {
    if (rateToDelete) {
      // Pass separate args or object depending on hook signature
      // Hook signature update: mutationFn: async ({ id, shippingZoneId })
      deleteRate.mutate(
        { id: rateToDelete.id, shippingZoneId: zone.id },
        {
          onSuccess: () => setRateToDelete(null),
        }
      );
    }
  };

  if (isLoading)
    return <div className="p-12 text-center text-gray-500">Loading zone details...</div>;
  if (!zone) return <div className="p-12 text-center text-red-500">Zone not found</div>;

  const countryList =
    typeof zone.countryCodes === 'string'
      ? zone.countryCodes.split(',').map((c) => c.trim())
      : Array.isArray(zone.countryCodes)
        ? zone.countryCodes
        : [];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeft className="h-5 w-5" />}
            onClick={() => router.push('/configuration/shipping')}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{zone.name}</h1>
            <p className="text-sm text-gray-500">Zone ID: #{zone.id}</p>
          </div>
        </div>
        <Button
          icon={<Edit />}
          onClick={() => router.push(`/configuration/shipping/edit/${zone.id}`)}
        >
          Edit Zone Details
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Zone Info */}
        <div className="space-y-6 lg:col-span-1">
          <Box title="Zone Information" header>
            <div className="space-y-4">
              <LabelAndValue label="Zone Name" value={zone.name} />
              <div>
                <p className="mb-2 text-sm text-gray-500">Emirates / Regions</p>
                <div className="flex flex-wrap gap-2">
                  {countryList.length > 0 ? (
                    countryList.map((code) => <Tag key={code}>{code}</Tag>)
                  ) : (
                    <span className="text-sm text-gray-400">No countries selected</span>
                  )}
                </div>
              </div>
            </div>
          </Box>
        </div>

        {/* Right Column: Rates */}
        <div className="lg:col-span-2">
          <Box
            title="Shipping Rates"
            header
            description="Manage shipping rates for this zone"
            extra={
              <Button type="primary" onClick={handleAddRate}>
                Add Rate
              </Button>
            }
          >
            <DataTable
              data={zone.rates || []}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: 'Rate Name',
                  dataIndex: 'rateName',
                  key: 'rateName',
                  render: (t) => <span className="font-medium">{t}</span>,
                },
                {
                  title: 'Base Cost',
                  dataIndex: 'baseCost',
                  key: 'baseCost',
                  render: (v) => `$${v?.toFixed(2)}`,
                },
                {
                  title: 'Free Shipping Threshold',
                  dataIndex: 'freeShippingThreshold',
                  key: 'freeShippingThreshold',
                  render: (v) =>
                    v ? (
                      <span className="text-green-600">Over ${v.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    ),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  width: '100px',
                  render: (_, record) => (
                    <div className="flex">
                      <Button
                        type="text"
                        icon={<Edit />}
                        onClick={() => handleRateEdit(record)}
                      />
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 />}
                        onClick={() => setRateToDelete(record)}
                      />
                    </div>
                  ),
                },
              ]}
            />
            {!zone.rates?.length && (
              <div className="py-8 text-center text-gray-500">
                No shipping rates configured for this zone yet.
              </div>
            )}
          </Box>
        </div>
      </div>

      {/* Modals */}
      <ShippingRateModal
        open={isRateModalOpen}
        onCancel={() => setIsRateModalOpen(false)}
        initialValues={editingRate}
        zoneId={zone.id}
      />

      <Modal
        title="Delete Rate"
        open={!!rateToDelete}
        onOk={confirmDeleteRate}
        onCancel={() => setRateToDelete(null)}
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleteRate.isPending }}
      >
        <p>
          Are you sure you want to delete the rate <b>{rateToDelete?.rateName}</b>?
        </p>
      </Modal>
    </div>
  );
}
