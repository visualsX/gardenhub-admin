'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import PaymentMethodForm from '@/components/pages/configurations/payment-methods/PaymentMethodForm';
import { usePaymentMethod, useUpdatePaymentMethod } from '@/hooks/usePaymentMethods';

export default function EditPaymentMethodPage() {
    const { id } = useParams();
    const { data, isLoading: initialsLoading } = usePaymentMethod(id);
    const { mutate, isPending: isUpdating } = useUpdatePaymentMethod();

    const handleSubmit = (values) => {
        mutate({ ...values, id: +id });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Payment Method</h1>
                <p className="mt-1 text-sm text-gray-600">Update payment method details and configuration</p>
            </div>

            <PaymentMethodForm
                initialValues={data}
                initialsLoading={initialsLoading}
                onSubmit={handleSubmit}
                isLoading={isUpdating}
                mode="edit"
            />
        </div>
    );
}
