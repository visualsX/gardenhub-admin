'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import ShippingZoneForm from '@/components/pages/shipping/ShippingZoneForm';
import { useUpdateShippingZone, useShippingZone } from '@/hooks/useShipping';
import GoBack from '@/components/ui/go-back';

export default function EditShippingZonePage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useShippingZone(+id);
  const updateZone = useUpdateShippingZone();

  const handleUpdate = async (values) => {
    updateZone.mutate({ id: +id, ...values });
  };

  return (
    <div className="min-h-screen space-y-6">
      <GoBack
        title="Edit Shipping Zone"
        href="/shipping"
        desc={'Manage zone details and shipping rates'}
      />

      <ShippingZoneForm
        mode="edit"
        initialsLoading={isLoading}
        initialValues={data}
        onSubmit={handleUpdate}
        isLoading={updateZone.isPending}
      />
    </div>
  );
}
