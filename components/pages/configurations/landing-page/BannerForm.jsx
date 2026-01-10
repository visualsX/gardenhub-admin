import { Form, Button, DatePicker, InputNumber, Select, ColorPicker } from 'antd';
import { useRouter } from 'next/navigation';
import { Box } from '@/components/wrappers/box';
import { FormDatePicker, FormInput, FormInputNumber, FormSelect, FormTextArea } from '@/components/ui/inputs';
import dayjs from 'dayjs';
import React from 'react';
import { BUTTON_STYLES, TEXT_ALIGNMENT, TEXT_POSITIONS } from '@/lib/const/styling-dropdowns';

export default function BannerForm({
  initialsLoading = false,
  initialValues,
  onSubmit,
  isLoading,
  mode = 'create',
}) {
  const [form] = Form.useForm();
  const router = useRouter();

  // Prepare initial values by flattening nested button objects from GraphQL
  const preparedInitialValues = React.useMemo(() => {
    if (!initialValues) {
      if (mode === 'create') {
        return {
          textAlignment: 'left',
          textPosition: 'center-left',
          backgroundOverlay: 'rgba(0,0,0,0.5)',
          overlayOpacity: 50,
          displayOrder: 0,
          primaryButtonStyle: 'solid',
          secondaryButtonStyle: 'outline',
          primaryButtonText: 'Shop Now',
          secondaryButtonText: 'Learn More',
        };
      }
      return {};
    }
    return {
      ...initialValues,
      primaryButtonText: initialValues.primaryButtonText || initialValues.primaryButton?.text,
      primaryButtonLink: initialValues.primaryButtonLink || initialValues.primaryButton?.link,
      primaryButtonStyle: initialValues.primaryButtonStyle || initialValues.primaryButton?.style,
      secondaryButtonText: initialValues.secondaryButtonText || initialValues.secondaryButton?.text,
      secondaryButtonLink: initialValues.secondaryButtonLink || initialValues.secondaryButton?.link,
      secondaryButtonStyle: initialValues.secondaryButtonStyle || initialValues.secondaryButton?.style,
      startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
      endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
      backgroundOverlay: initialValues.backgroundOverlay || 'rgba(0,0,0,0.5)',
    };
  }, [initialValues, mode]);

  // Update form fields when initial values are loaded
  React.useEffect(() => {
    if (Object.keys(preparedInitialValues).length > 0) {
      form.setFieldsValue(preparedInitialValues);
    }
  }, [preparedInitialValues, form]);

  const handleFinish = (values) => {
    // format dates and colors
    const { startDate, endDate, backgroundOverlay, ...rest } = values;
    
    // Support both Ant Design ColorPicker object and plain string
    const colorValue = typeof backgroundOverlay === 'object' && backgroundOverlay?.toRgbString 
      ? backgroundOverlay.toRgbString() 
      : backgroundOverlay;

    onSubmit({
      ...rest,
      backgroundOverlay: colorValue,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    });
  };

  return (
    <div className="pb-20">
      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        initialValues={preparedInitialValues}
        onFinish={handleFinish}
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <Box
              loading={initialsLoading}
              title="Banner Content"
              description="Define the text content for the banner"
              header
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormInput name="name" label="Internal Name" placeholder="e.g. Summer Sale 2024" rules={[{ required: true }]} />
                <FormInput name="heading" label="Heading" placeholder="e.g. Fresh Garden Supplies" />
                <FormInput name="subheading" label="Subheading" placeholder="e.g. Quality Plants & Tools" />
                <FormInput name="videoUrl" label="Video URL" placeholder="Link to a background video (optional)" rules={[]} />
              </div>
              <FormTextArea name="description" label="Description" placeholder="Short description for the banner" />
            </Box>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box
                loading={initialsLoading}
                title="Primary Button"
                header
              >
                <div className="space-y-4">
                  <FormInput name="primaryButtonText" label="Button Text" placeholder="e.g. Shop Now" />
                  <FormInput name="primaryButtonLink" label="Button Link" placeholder="e.g. /shop" />
                  <Form.Item name="primaryButtonStyle" label="Button Style">
                    <Select options={BUTTON_STYLES} placeholder="Select Style" />
                  </Form.Item>
                </div>
              </Box>

              <Box
                loading={initialsLoading}
                title="Secondary Button"
                header
              >
                <div className="space-y-4">
                  <FormInput name="secondaryButtonText" label="Button Text" placeholder="e.g. Learn More" />
                  <FormInput name="secondaryButtonLink" label="Button Link" placeholder="e.g. /about" />
                  <Form.Item name="secondaryButtonStyle" label="Button Style">
                    <Select options={BUTTON_STYLES} placeholder="Select Style" />
                  </Form.Item>
                </div>
              </Box>
            </div>
            
            <Box
              loading={initialsLoading}
              title="Design & Scheduling"
              header
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect className="mb-0!" name="textAlignment" label="Text Alignment" options={TEXT_ALIGNMENT} placeholder="Select Alignment" />
                <FormSelect className="mb-0!" name="textPosition" label="Text Position" options={TEXT_POSITIONS} placeholder="Select Position" />
                <div className="col-span-2 grid grid-cols-3 gap-x-4">
                  <Form.Item className='mb-0!' name="backgroundOverlay" label="Background Overlay">
                  <ColorPicker className="h-[38px]! w-full" showText format="hex" />
                  </Form.Item>
                  <FormInputNumber className="mb-0!" name="overlayOpacity" label="Overlay Opacity (0-100)" min={0} max={100}/>
                  <FormInputNumber className="mb-0!" name="displayOrder" label="Display Order" min={0}/>
                </div>
                <FormDatePicker className="mb-0!" name="startDate" label="Start Date" showTime/>
                <FormDatePicker className="mb-0!" name="endDate" label="End Date" showTime/>
              </div>
            </Box>
           </div>
          </div>
        </div>

        <div className="border-smoke fixed right-0 bottom-0 left-0 z-10 flex justify-end gap-3 border-t bg-white p-4 px-8 lg:left-64">
          <Button size="large" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="primary" size="large" htmlType="submit" loading={isLoading}>
            {mode === 'create' ? 'Create Banner' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
