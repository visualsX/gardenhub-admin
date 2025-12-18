'use client';

import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { Box } from '@/components/wrappers/box';
import { useAttributes } from '@/hooks/useAttribute';
import { useDeleteAttribute, useDeleteOption } from '@/hooks/useAttributeMutations';
import AttributeModal from '@/components/pages/attributes/modals/AttributeModal';
import OptionModal from '@/components/pages/attributes/modals/OptionModal';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import Edit from '@/public/shared/edit.svg';
import Trash from '@/public/shared/trash.svg';
import PlusGreen from '@/public/shared/plus-green-dark.svg';
import PlusWhite from '@/public/shared/plus-white.svg';
import ChevronRight from '@/public/shared/ChevronRight.svg';
import ChevronDown from '@/public/shared/ChevronDown.svg';

export default function AttributesManagement() {
    const { data: attributes, isLoading } = useAttributes();
    const deleteAttribute = useDeleteAttribute();
    const deleteOption = useDeleteOption();
    const { openDeleteModal, closeDeleteModal, openModal, isModalOpen, isDeleteModalOpen } = useUiStates();

    const [expandedAttributes, setExpandedAttributes] = useState([]);

    const toggleAttribute = (id) => {
        setExpandedAttributes((prev) => (prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]));
    };

    const isExpanded = (id) => expandedAttributes.includes(id);

    const handleAddAttribute = () => {
        openModal(true, { type: 'ATTRIBUTE', data: null });
    };

    const handleEditAttribute = (e, attribute) => {
        e.stopPropagation();
        openModal(true, { type: 'ATTRIBUTE', data: attribute });
    };

    const handleDeleteAttribute = (e, attribute) => {
        e.stopPropagation();
        openDeleteModal(true, { type: 'attribute', id: attribute.id });
    };

    const handleAddOption = (e, attributeId) => {
        e.stopPropagation();
        openModal(true, { type: 'OPTION', data: { attributeId } });
    };

    const handleEditOption = (option, attributeId) => {
        openModal(true, { type: 'OPTION', data: { ...option, attributeId } });
    };

    const handleDeleteOption = (option) => {
        openDeleteModal(true, { type: 'option', id: option.id });
    };

    const handleConfirmDelete = async () => {
        const { type, id } = isDeleteModalOpen.data || {};
        if (type === 'attribute') {
            await deleteAttribute.mutateAsync(id);
        } else if (type === 'option') {
            await deleteOption.mutateAsync(id);
        }
        closeDeleteModal();
    };

    if (isLoading) {
        return (
            <Box header title="Attributes Management" description="Manage product filter attributes"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusWhite />}
                        onClick={handleAddAttribute}
                    >
                        Add Attribute
                    </Button>
                }
            >
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-100" />
                    ))}
                </div>
            </Box>
        );
    }

    return (
        <Box
            header title="Attributes Management"
            description="Manage product filter attributes"
            extra={
                <Button
                    type="primary"
                    icon={<PlusWhite />}
                    onClick={handleAddAttribute}
                >
                    Add Attribute
                </Button>
            }
        >

            <div className="flex flex-col gap-4">
                {attributes?.map((attr) => (
                    <div
                        key={attr.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                        {/* Attribute Row */}
                        <div
                            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleAttribute(attr.id)}
                        >
                            <div className="flex flex-1 items-center gap-3">
                                <button className="flex h-6 w-6 items-center justify-center text-gray-600 hover:text-gray-900">
                                    {isExpanded(attr.id) ? (
                                        <ChevronDown className="h-5 w-5" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5" />
                                    )}
                                </button>
                                <span className="text-base font-medium text-gray-900">{attr.name}</span>
                            </div>

                            <div className="flex items-center gap-8">
                                <span className="text-sm text-gray-600">
                                    {attr.options?.length || 0} options
                                </span>
                                <Button
                                    size="small"
                                    icon={<PlusGreen />}
                                    onClick={(e) => handleAddOption(e, attr.id)}
                                >
                                    Add Option
                                </Button>
                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                    <Edit
                                        className="h-5 w-5"
                                        onClick={(e) => handleEditAttribute(e, attr)}
                                    />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                    <Trash
                                        className="h-5 w-5"
                                        onClick={(e) => handleDeleteAttribute(e, attr)}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Options List */}
                        {isExpanded(attr.id) && (
                            <div className="border-t border-gray-100 bg-gray-50">
                                {attr.options?.length > 0 ? (
                                    attr.options.map((option) => (
                                        <div
                                            key={option.id}
                                            className="flex items-center justify-between border-b border-gray-100 py-3 pr-4 pl-12 hover:bg-gray-100"
                                        >
                                            <div className="flex flex-1 items-center gap-3">
                                                <span className="text-sm text-gray-900">{option.value}</span>
                                                {option.description && (
                                                    <span className="text-sm text-gray-500">- {option.description}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                                    <Edit
                                                        className="h-5 w-5"
                                                        onClick={() => handleEditOption(option, attr.id)}
                                                    />
                                                </button>
                                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                                    <Trash
                                                        className="h-5 w-5"
                                                        onClick={() => handleDeleteOption(option)}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-sm text-gray-500">
                                        No options added yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isModalOpen.data?.type === 'ATTRIBUTE' && <AttributeModal />}
            {isModalOpen.data?.type === 'OPTION' && <OptionModal attributes={attributes || []} />}

            <DeleteModal
                onConfirm={handleConfirmDelete}
                loading={deleteAttribute.isPending || deleteOption.isPending}
                entityName={isDeleteModalOpen.data?.type === 'attribute' ? 'attribute' : 'option'}
            />
        </Box>
    );
}
