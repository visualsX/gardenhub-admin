import React from 'react';
import ReviewManagementClient from '@/components/pages/reviews/ReviewManagementClient';

export const metadata = {
  title: 'Review Management | Gardenhub Admin',
  description: 'Moderate and manage product reviews',
};

export default function ReviewPage() {
  return <ReviewManagementClient />;
}
