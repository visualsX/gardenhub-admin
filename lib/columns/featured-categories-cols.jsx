import React from 'react';
import { Button, Space, Tag } from 'antd';
import  DeleteOutlined  from '@/public/shared/trash.svg';
import  EditOutlined  from '@/public/shared/edit.svg';
import  EyeOutlined  from '@/public/shared/Eye.svg';
import Image from 'next/image';
import useUiStates from '@/store/useUiStates';

export const FeaturedCategoriesCols = (onEdit) => {
    const { openDeleteModal, openDetailModal } = useUiStates();

    return [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 80,
            render: (url) => (
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-gray-200">
                    {url ? (
                        <Image
                            src={url}
                            alt="Category"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px] text-gray-400">
                            No Img
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Custom Title',
            dataIndex: 'customTitle',
            key: 'customTitle',
            render: (text, record) => (
                <div>
                    <div className="font-medium text-gray-900">{text || record.categoryName}</div>
                    <div className="text-xs text-gray-500">{record.categorySlug}</div>
                </div>
            ),
        },
        {
            title: 'Placement Area',
            dataIndex: 'placementArea',
            key: 'placementArea',
            render: (area) => (
                <Tag color="blue" className="capitalize">
                    {area?.replace(/-/g, ' ')}
                </Tag>
            ),
        },
        {
            title: 'Order',
            dataIndex: 'displayOrder',
            key: 'displayOrder',
            width: 180,
            align: 'center',
        },
        {
            // title: 'Actions',
            key: 'actions',
            width: 120,
            align: 'right',
            render: (_, record) => (
                <div className='flex items-center gap-x-2'>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(true, record);
                        }}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(true, record);
                        }}
                    />
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(record);
                            }}
                        />
                </div>
            ),
        },
    ];
};
