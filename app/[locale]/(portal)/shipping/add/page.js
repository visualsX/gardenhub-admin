'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import ShippingZoneForm from '@/components/pages/shipping/ShippingZoneForm';
import { useCreateShippingZone } from '@/hooks/useShipping';
import GoBack from '@/components/ui/go-back';

export default function AddShippingZonePage() {
    const router = useRouter();
    const createZone = useCreateShippingZone();

    const handleCreate = async (values) => {
        createZone.mutate(values);
    };

    return (
        <div className="min-h-screen space-y-6">

            <GoBack
                title="Shipping Zones"
                href="/shipping"
                desc={"Define a new shipping zone and its countries"}
            />

            <ShippingZoneForm
                mode="create"
                onSubmit={handleCreate}
                isLoading={createZone.isPending}
            />
        </div>
    );
}
