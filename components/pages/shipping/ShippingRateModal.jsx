'use client';

import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, InputNumber } from 'antd';
import { useCreateShippingRate, useUpdateShippingRate, useShippingRate } from '@/hooks/useShipping';

export default function ShippingRateModal({ open, onCancel, initialValues, zoneId }) {
    const [form] = Form.useForm();
    const createRate = useCreateShippingRate();
    const updateRate = useUpdateShippingRate();
    const isEdit = !!initialValues;
    const rateId = initialValues?.id;

    // Fetch fresh data if editing
    const { data: rateData, isLoading: isLoadingRate } = useShippingRate(rateId);

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (isEdit) {
                // Determine source: fetched data > passed initial values
                const sourceData = rateData || initialValues;
                if(sourceData) {
                    form.setFieldsValue(sourceData);
                }
            }
        }
    }, [open, initialValues, rateData, form, isEdit]);

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            shippingZoneId: zoneId
        };
        try {
            if (isEdit) {
                await updateRate.mutateAsync({ id: initialValues.id, data: payload });
            } else {
                await createRate.mutateAsync(payload);
            }
            onCancel();
        } catch (e) {
            // Error handling usually in hook
        }
    };

    return (
        <Modal
            title={isEdit ? "Edit Shipping Rate" : "Add Shipping Rate"}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={createRate.isPending || updateRate.isPending}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="rateName" label="Rate Name" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Standard Shipping" />
                </Form.Item>
                <Form.Item name="baseCost" label="Base Cost ($)" rules={[{ required: true }]}>
                    <InputNumber min={0} className="w-full" precision={2} />
                </Form.Item>
                 <Form.Item name="freeShippingThreshold" label="Free Shipping Threshold ($)">
                    <InputNumber min={0} className="w-full" precision={2} placeholder="Optional" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
