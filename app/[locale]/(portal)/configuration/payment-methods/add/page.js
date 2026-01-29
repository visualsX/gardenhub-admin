'use client';

import React from 'react';
import PaymentMethodForm from '@/components/pages/configurations/payment-methods/PaymentMethodForm';
import { useCreatePaymentMethod } from '@/hooks/usePaymentMethods';

export default function AddPaymentMethodPage() {
  const { mutate, isPending } = useCreatePaymentMethod();

  const handleSubmit = (values) => {
    mutate(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Payment Method</h1>
        <p className="mt-1 text-sm text-gray-600">Create a new payment method for the storefront</p>
      </div>

      <PaymentMethodForm onSubmit={handleSubmit} isLoading={isPending} mode="create" />
    </div>
  );
}
