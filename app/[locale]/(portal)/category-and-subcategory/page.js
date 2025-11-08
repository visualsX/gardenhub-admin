'use client';

import React, { useState } from 'react';
import Pagination from '@/components/shared/pagination';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  PlusGray,
  PlusWhite,
  MoreVertical,
} from '@/lib/const/icons';
import CreateCategoryModal from './create-category';
import { useCategories } from '@/hooks/useCategories';
import { Button, Skeleton } from 'antd';
import CreateSubCategoryModal from './create-subcategory';

export default function CategoriesManagement() {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useCategories({ page: 1, limit: 10, search: '' });

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
          <Skeleton loading={isLoading}>
            <div className="flex flex-col gap-4">
              {data?.nodes?.map((category) => (
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
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </div>

                          {/* Level 3: Sub-subcategories */}
                          {isSubExpanded(lvl2?.slug) &&
                            lvl2?.subCategories &&
                            lvl2?.subCategories?.length > 0 && (
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
                                        <MoreVertical className="h-5 w-5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
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
              ))}
            </div>
            <div className="py-6">
              <Pagination
                currentPage={currentPage}
                totalPages={100}
                onPageChange={setCurrentPage}
                onPrevious={() => setCurrentPage(Math.max(1, currentPage - 1))}
                onNext={() => setCurrentPage(Math.min(10, currentPage + 1))}
              />
            </div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}

const categoriesData = [
  {
    key: 'indoor-plants',
    name: 'Indoor Plants',
    subCategories: 3,
    products: 45,
    subCategoryList: [
      {
        key: 'low-light',
        name: 'Low Light Plants',
        products: 12,
        subSubCategoryList: [
          { key: 'snake-plants', name: 'Snake Plants', products: 4 },
          { key: 'pothos', name: 'Pothos', products: 5 },
          { key: 'zz-plants', name: 'ZZ Plants', products: 3 },
        ],
      },
      {
        key: 'air-purifying',
        name: 'Air Purifying',
        products: 18,
        subSubCategoryList: [
          { key: 'peace-lily', name: 'Peace Lily', products: 6 },
          { key: 'spider-plant', name: 'Spider Plant', products: 7 },
          { key: 'bamboo-palm', name: 'Bamboo Palm', products: 5 },
        ],
      },
      {
        key: 'pet-friendly',
        name: 'Pet-Friendly',
        products: 15,
        subSubCategoryList: [
          { key: 'boston-fern', name: 'Boston Fern', products: 5 },
          { key: 'parlor-palm', name: 'Parlor Palm', products: 6 },
          { key: 'calathea', name: 'Calathea', products: 4 },
        ],
      },
    ],
  },
  {
    key: 'outdoor-plants',
    name: 'Outdoor Plants',
    subCategories: 3,
    products: 67,
    subCategoryList: [
      {
        key: 'flowering',
        name: 'Flowering Plants',
        products: 25,
        subSubCategoryList: [
          { key: 'roses', name: 'Roses', products: 10 },
          { key: 'tulips', name: 'Tulips', products: 8 },
          { key: 'daisies', name: 'Daisies', products: 7 },
        ],
      },
      {
        key: 'shrubs',
        name: 'Shrubs & Bushes',
        products: 22,
        subSubCategoryList: [
          { key: 'boxwood', name: 'Boxwood', products: 8 },
          { key: 'hydrangea', name: 'Hydrangea', products: 9 },
          { key: 'azalea', name: 'Azalea', products: 5 },
        ],
      },
      {
        key: 'ground-cover',
        name: 'Ground Cover',
        products: 20,
        subSubCategoryList: [
          { key: 'creeping-thyme', name: 'Creeping Thyme', products: 7 },
          { key: 'sedum', name: 'Sedum', products: 8 },
          { key: 'vinca', name: 'Vinca', products: 5 },
        ],
      },
    ],
  },
  {
    key: 'succulents',
    name: 'Succulents & Cacti',
    subCategories: 3,
    products: 89,
    subCategoryList: [
      {
        key: 'desert-cacti',
        name: 'Desert Cacti',
        products: 30,
        subSubCategoryList: [
          { key: 'barrel-cactus', name: 'Barrel Cactus', products: 10 },
          { key: 'saguaro', name: 'Saguaro', products: 12 },
          { key: 'prickly-pear', name: 'Prickly Pear', products: 8 },
        ],
      },
      {
        key: 'tropical-succulents',
        name: 'Tropical Succulents',
        products: 35,
        subSubCategoryList: [
          { key: 'aloe-vera', name: 'Aloe Vera', products: 15 },
          { key: 'jade-plant', name: 'Jade Plant', products: 12 },
          { key: 'echeveria', name: 'Echeveria', products: 8 },
        ],
      },
      {
        key: 'hardy-succulents',
        name: 'Hardy Succulents',
        products: 24,
        subSubCategoryList: [
          { key: 'sempervivum', name: 'Sempervivum', products: 10 },
          { key: 'sedum-hardy', name: 'Hardy Sedum', products: 9 },
          { key: 'ice-plant', name: 'Ice Plant', products: 5 },
        ],
      },
    ],
  },
  {
    key: 'seeds',
    name: 'Seeds',
    subCategories: 3,
    products: 156,
    subCategoryList: [
      {
        key: 'vegetable-seeds',
        name: 'Vegetable Seeds',
        products: 60,
        subSubCategoryList: [
          { key: 'tomato', name: 'Tomato Seeds', products: 20 },
          { key: 'cucumber', name: 'Cucumber Seeds', products: 15 },
          { key: 'carrot', name: 'Carrot Seeds', products: 25 },
        ],
      },
      {
        key: 'flower-seeds',
        name: 'Flower Seeds',
        products: 50,
        subSubCategoryList: [
          { key: 'sunflower', name: 'Sunflower Seeds', products: 20 },
          { key: 'marigold', name: 'Marigold Seeds', products: 18 },
          { key: 'zinnia', name: 'Zinnia Seeds', products: 12 },
        ],
      },
      {
        key: 'herb-seeds',
        name: 'Herb Seeds',
        products: 46,
        subSubCategoryList: [
          { key: 'basil', name: 'Basil Seeds', products: 15 },
          { key: 'cilantro', name: 'Cilantro Seeds', products: 16 },
          { key: 'parsley', name: 'Parsley Seeds', products: 15 },
        ],
      },
    ],
  },
  {
    key: 'accessories',
    name: 'Accessories',
    subCategories: 4,
    products: 234,
    subCategoryList: [
      {
        key: 'pots-planters',
        name: 'Pots & Planters',
        products: 80,
        subSubCategoryList: [
          { key: 'ceramic-pots', name: 'Ceramic Pots', products: 30 },
          { key: 'plastic-pots', name: 'Plastic Pots', products: 25 },
          { key: 'terracotta', name: 'Terracotta', products: 25 },
        ],
      },
      {
        key: 'tools',
        name: 'Gardening Tools',
        products: 65,
        subSubCategoryList: [
          { key: 'hand-tools', name: 'Hand Tools', products: 25 },
          { key: 'pruners', name: 'Pruners & Shears', products: 20 },
          { key: 'watering-tools', name: 'Watering Tools', products: 20 },
        ],
      },
      {
        key: 'fertilizers',
        name: 'Fertilizers & Soil',
        products: 54,
        subSubCategoryList: [
          { key: 'organic-fertilizer', name: 'Organic Fertilizer', products: 20 },
          { key: 'potting-soil', name: 'Potting Soil', products: 20 },
          { key: 'compost', name: 'Compost', products: 14 },
        ],
      },
      {
        key: 'decor',
        name: 'Garden Decor',
        products: 35,
        subSubCategoryList: [
          { key: 'statues', name: 'Garden Statues', products: 12 },
          { key: 'lights', name: 'Garden Lights', products: 15 },
          { key: 'furniture', name: 'Garden Furniture', products: 8 },
        ],
      },
    ],
  },
];
