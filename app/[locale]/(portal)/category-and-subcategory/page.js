'use client';

import React, { useState } from 'react';
import ChevronRight from '@/public/shared/ChevronRight.svg';
import ChevronDown from '@/public/shared/ChevronDown.svg';
import Trash from '@/public/shared/trash.svg';
import Eye from '@/public/shared/Eye.svg';
import MoreVertical from '@/public/shared/MoreVertical.svg';
import CreateCategoryModal from './create-category';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Skeleton } from 'antd';
import CreateSubCategoryModal from './create-subcategory';
import CursorPagination from '@/components/shared/cursor-pagination';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import CreateSubSubCategory from './create-subSubCategory';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';

export default function CategoriesManagement() {
  const { isDeleteModalOpen, openDeleteModal } = useUiStates();

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState([]);

  const { data, isLoading, isFetching, pageState } = useCategories({
    paginationKey: PAGINATION_KEYS.CATEGORIES,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
  });

  const toggleCategory = (key) => {
    setExpandedCategories((prev) => (prev.includes(key) ? [] : [key]));
  };

  const toggleSubCategory = (key, event) => {
    event.stopPropagation();
    setExpandedSubCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isExpanded = (key) => expandedCategories.includes(key);
  const isSubExpanded = (key) => expandedSubCategories.includes(key);
  const pageInfo = data?.pageInfo ?? {};
  const deleteCategory = useDeleteCategory();

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories & Sub-Categories</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and organise products categories</p>
          </div>
          <CreateCategoryModal />
        </div>

        {/* Categories List with 3-level nesting */}
        <div className="border-smoke rounded-xl border bg-white px-6 py-8">
          <div className="flex flex-col gap-4">
            <Skeleton loading={isLoading}>
              {!isLoading && (!data?.nodes || data?.nodes?.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                  <p className="text-lg font-medium text-gray-700">No categories found</p>
                  <p className="mt-1 text-sm">Get started by creating your first category.</p>
                </div>
              ) : (
                data?.nodes?.map((category) => (
                  <div
                    key={category.slug}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    {/* Level 1: Main Category Row */}
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex flex-1 items-center gap-3">
                        <button
                          onClick={() => toggleCategory(category.slug)}
                          className="flex h-6 w-6 items-center justify-center text-gray-600 hover:text-gray-900"
                        >
                          {isExpanded(category.slug) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                        <span className="text-base font-medium text-gray-900">{category.name}</span>
                      </div>

                      <div className="flex items-center gap-8">
                        <span className="text-sm text-gray-600">
                          {category?.subCategories?.length} subcategories
                        </span>
                        <span className="text-sm text-gray-600">{category.products} products</span>
                        <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                          <Trash
                            className="h-5 w-5"
                            onClick={() => openDeleteModal(true, category)}
                          />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Level 2: Subcategories */}
                    {isExpanded(category.slug) && (
                      <div className="border-t border-gray-100 bg-gray-50">
                        {category?.subCategories?.map((lvl2) => (
                          <div key={lvl2.slug}>
                            {/* Subcategory Row */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 pr-4 pl-12 hover:bg-gray-100">
                              <div className="flex flex-1 items-center gap-3">
                                <button
                                  onClick={(e) => toggleSubCategory(lvl2.slug, e)}
                                  className="flex h-5 w-5 items-center justify-center text-gray-600 hover:text-gray-900"
                                >
                                  {isSubExpanded(lvl2.slug) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                                <span className="text-sm text-gray-900">{lvl2.name}</span>
                              </div>
                              <div className="flex items-center gap-8">
                                <span className="text-sm text-gray-600">
                                  {lvl2.products} products
                                </span>
                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                  <Eye className="h-5 w-5" />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                  <Trash
                                    className="h-5 w-5"
                                    onClick={() => openDeleteModal(true, lvl2)}
                                  />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            {/* Level 3: Sub-subcategories */}
                            {isSubExpanded(lvl2?.slug) &&
                              lvl2?.subCategories &&
                              lvl2?.subCategories?.length >= 0 && (
                                <div className="bg-gray-100">
                                  {lvl2?.subCategories?.map((lvl3) => (
                                    <div
                                      key={lvl3.slug}
                                      className="flex items-center justify-between border-b border-gray-200 py-2 pr-4 pl-24 last:border-b-0 hover:bg-gray-200"
                                    >
                                      <span className="text-sm text-gray-900">{lvl3.name}</span>
                                      <div className="flex items-center gap-8">
                                        <span className="text-sm text-gray-600">
                                          {lvl3.products} products
                                        </span>
                                        <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                          <Eye className="h-5 w-5" />
                                        </button>
                                        <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                          <Trash
                                            className="h-5 w-5"
                                            onClick={() => openDeleteModal(true, lvl3)}
                                          />
                                        </button>
                                        <button className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-900">
                                          <MoreVertical className="h-5 w-5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="py-3 pl-[90px]">
                                    <CreateSubSubCategory parentId={lvl2?.id} />
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}

                        {/* Add Subcategory Button */}
                        <div className="py-3 pl-12">
                          <CreateSubCategoryModal parentId={category?.id} />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </Skeleton>
          </div>
          <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-4">
            <CursorPagination
              paginationKey={PAGINATION_KEYS.CATEGORIES}
              pageInfo={pageInfo}
              totalCount={data?.totalCount ?? 0}
              pageSize={pageState.pageSize}
              loading={isLoading || isFetching}
            />
          </div>
          <DeleteModal
            loading={deleteCategory?.isPending}
            onConfirm={() => {
              deleteCategory.mutate(isDeleteModalOpen?.data?.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
