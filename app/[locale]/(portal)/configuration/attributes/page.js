'use client';

import AttributesManagement from '@/components/pages/attributes/AttributesManagement';

export default function AttributesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product filter attributes and their options
          </p>
        </div>
      </div>

      <AttributesManagement />
    </div>
  );
}
