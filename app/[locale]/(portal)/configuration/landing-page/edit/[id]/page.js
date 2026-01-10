'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useBanner, useUpdateBanner } from '@/hooks/useLandingPage';
import GoBack from '@/components/ui/go-back';
import BannerForm from '@/components/pages/configurations/landing-page/BannerForm';

export default function EditBannerPage() {
    const { id } = useParams();
    const { data: banner, isLoading: isFetching } = useBanner(id);
    const updateBanner = useUpdateBanner();

    const handleUpdate = async (values) => {
        updateBanner.mutate({ id, ...values });
    };

    return (
        <div className="min-h-screen space-y-6">
            <GoBack
                title="Edit Banner"
                href="/configuration/landing-page"
                desc="Modify hero banner details"
            />

            <BannerForm
                mode="edit"
                initialValues={banner}
                initialsLoading={isFetching}
                onSubmit={handleUpdate}
                isLoading={updateBanner.isPending}
            />
        </div>
    );
}
