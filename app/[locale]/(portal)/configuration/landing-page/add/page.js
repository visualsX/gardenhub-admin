'use client';

import React from 'react';
import { useCreateBanner } from '@/hooks/useLandingPage';
import GoBack from '@/components/ui/go-back';
import BannerForm from '@/components/pages/configurations/landing-page/BannerForm';

export default function AddBannerPage() {
    const createBanner = useCreateBanner();

    const handleCreate = async (values) => {
        createBanner.mutate(values);
    };

    return (
        <div className="min-h-screen space-y-6">
            <GoBack
                title="Landing Page Banners"
                href="/configuration/landing-page"
                desc="Create a new hero banner for the home page"
            />

            <BannerForm mode="create" onSubmit={handleCreate} isLoading={createBanner.isPending} />
        </div>
    );
}
