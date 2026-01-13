'use client';

import React from 'react';
import { Button, Divider, Form, message } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import Edit from '@/public/shared/edit.svg';
import { Box } from '@/components/wrappers/box';
import { useBanner, useUpdateBannerImages } from '@/hooks/useLandingPage';
import LabelAndValue from '@/components/ui/label-value';
import GoBack from '@/components/ui/go-back';
import SingleImageUploader from '@/components/ui/singleUpload';

export default function BannerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [updatingType, setUpdatingType] = React.useState(null);
  const [refreshCounter, setRefreshCounter] = React.useState(0);
  const { data: banner, isLoading } = useBanner(id);
  const updateImages = useUpdateBannerImages();

  const handleImageUpdate = (type) => {
    const fileList = form.getFieldValue(type === 'desktop' ? 'desktopImage' : 'mobileImage');
    if (fileList && fileList[0]?.originFileObj) {
      const formData = new FormData();
      formData.append('BannerId', id);
      if (type === 'desktop') {
        formData.append('ImageFile', fileList[0].originFileObj);
      } else {
        formData.append('MobileImageFile', fileList[0].originFileObj);
      }

      setUpdatingType(type);
      updateImages.mutate(
        { id, formData },
        {
          onSuccess: () => {
            form.resetFields([type === 'desktop' ? 'desktopImage' : 'mobileImage']);
            setRefreshCounter((prev) => prev + 1);
          },
          onSettled: () => setUpdatingType(null),
        }
      );
    } else {
      message.warning('Please select an image first');
    }
  };

  if (isLoading)
    return <div className="p-12 text-center text-gray-500">Loading banner details...</div>;
  if (!banner) return <div className="p-12 text-center text-red-500">Banner not found</div>;

  return (
    <div className="min-h-screen space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <GoBack
          title={banner.name || 'Banner Details'}
          href="/configuration/landing-page"
          desc={`ID: #${banner.id}`}
        />
        <Button
          icon={<Edit className="h-4 w-4" />}
          type="primary"
          onClick={() => router.push(`/configuration/landing-page/edit/${banner.id}`)}
        >
          Edit Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Box title="Banner Content" header>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelAndValue label="Internal Name" value={banner.name} />
              <LabelAndValue label="Heading" value={banner.heading} />
              <LabelAndValue label="Subheading" value={banner.subheading} />
              <LabelAndValue
                label="Video URL"
                value={banner.videoUrl || 'N/A'}
                isLink={!!banner.videoUrl}
              />
            </div>
            <Divider className="my-4" />
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-gray-900">{banner.description || 'No description provided'}</p>
            </div>
          </Box>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Box title="Primary Button" header>
              <div className="space-y-4">
                <LabelAndValue
                  label="Text"
                  value={banner.primaryButtonText || banner.primaryButton?.text || 'N/A'}
                />
                <LabelAndValue
                  label="Link"
                  value={banner.primaryButtonLink || banner.primaryButton?.link || 'N/A'}
                />
                <LabelAndValue
                  label="Style"
                  value={banner.primaryButtonStyle || banner.primaryButton?.style || 'N/A'}
                />
              </div>
            </Box>

            <Box title="Secondary Button" header>
              <div className="space-y-4">
                <LabelAndValue
                  label="Text"
                  value={banner.secondaryButtonText || banner.secondaryButton?.text || 'N/A'}
                />
                <LabelAndValue
                  label="Link"
                  value={banner.secondaryButtonLink || banner.secondaryButton?.link || 'N/A'}
                />
                <LabelAndValue
                  label="Style"
                  value={banner.secondaryButtonStyle || banner.secondaryButton?.style || 'N/A'}
                />
              </div>
            </Box>
          </div>

          <Box title="Design & Scheduling" header>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelAndValue label="Text Alignment" value={banner.textAlignment || 'N/A'} />
              <LabelAndValue label="Text Position" value={banner.textPosition || 'N/A'} />
              <LabelAndValue label="Background Overlay" value={banner.backgroundOverlay || 'N/A'} />
              <LabelAndValue label="Overlay Opacity" value={`${banner.overlayOpacity || 0}%`} />
              <LabelAndValue label="Display Order" value={banner.displayOrder || 0} />
              <div>
                <LabelAndValue
                  label="Active Period"
                  value={
                    banner.startDate || banner.endDate
                      ? `${banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'Always'} - ${banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Forever'}`
                      : 'Always Active'
                  }
                />
              </div>
            </div>
          </Box>
        </div>

        <div className="space-y-6">
          <Form form={form} layout="vertical">
            <Box title="Desktop Image" header description="Upload or update desktop banner image">
              <SingleImageUploader
                name="desktopImage"
                label=""
                editPage={true}
                existingImage={
                  banner.imageUrl ? { imageUrl: `${banner.imageUrl}?v=${refreshCounter}` } : null
                }
              />
              <Button
                type="primary"
                block
                className="mt-2"
                loading={updateImages.isPending && updatingType === 'desktop'}
                onClick={() => handleImageUpdate('desktop')}
              >
                Update Desktop Image
              </Button>
            </Box>

            <Box
              title="Mobile Image"
              header
              className="mt-6"
              description="Upload or update mobile banner image"
            >
              <SingleImageUploader
                name="mobileImage"
                label=""
                editPage={true}
                existingImage={
                  banner.mobileImageUrl
                    ? { imageUrl: `${banner.mobileImageUrl}?v=${refreshCounter}` }
                    : null
                }
              />
              <Button
                type="primary"
                block
                className="mt-2"
                loading={updateImages.isPending && updatingType === 'mobile'}
                onClick={() => handleImageUpdate('mobile')}
              >
                Update Mobile Image
              </Button>
            </Box>
          </Form>
        </div>
      </div>
    </div>
  );
}
