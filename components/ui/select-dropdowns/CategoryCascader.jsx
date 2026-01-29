'use client';

import { Skeleton } from 'antd';
import { FormCascader, CascaderInput } from '@/components/ui/inputs';
import { useCategoryDropdown } from '@/hooks/useCategories';

const mapToOptions = (nodes = []) =>
  nodes.map((node) => ({
    value: node.id,
    label: node.name,
    children: node.children?.length ? mapToOptions(node.children) : undefined,
  }));

const CategoryCascader = ({
  name = 'category',
  label = 'Category',
  placeholder = 'Select category',
  categories: initialCategories,
  type = 'form', // 'form' | 'input'
  ...formProps
}) => {
  console.log('initialCategories', initialCategories);
  const { data, isLoading } = useCategoryDropdown(initialCategories);
  const options = mapToOptions(data ?? []);

  if (!initialCategories && isLoading) {
    return <Skeleton.Input active block />;
  }

  const filter = (inputValue, path) =>
    path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));

  const Component = type === 'input' ? CascaderInput : FormCascader;
  const props =
    type === 'input'
      ? {
          placeholder,
          options,
          showSearch: { filter, onSearch: (value) => console.log(value) },
          ...formProps,
        }
      : {
          name,
          label,
          placeholder,
          options,
          showSearch: { filter, onSearch: (value) => console.log(value) },
          ...formProps,
        };

  return <Component {...props} />;
};

export default CategoryCascader;
