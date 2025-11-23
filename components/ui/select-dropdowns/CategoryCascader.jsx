'use client';

import { Skeleton } from 'antd';
import { FormCascader } from '@/components/ui/inputs';
import { useCategoryDropdown } from '@/hooks/useCategories';

const mapToOptions = (nodes = []) =>
  nodes.map((node) => ({
    value: node.id,
    label: node.name,
    children: node.subCategories?.length ? mapToOptions(node.subCategories) : undefined,
  }));

const CategoryCascader = ({
  name = 'category',
  label = 'Category',
  placeholder = 'Select category',
  ...formProps
}) => {
  const { data, isLoading } = useCategoryDropdown();
  const options = mapToOptions(data ?? []);

  if (isLoading) {
    return <Skeleton.Input active block />;
  }

  const filter = (inputValue, path) =>
    path.some((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <FormCascader
      name={name}
      label={label}
      placeholder={placeholder}
      options={options}
      showSearch={{ filter, onSearch: (value) => console.log(value) }}
      {...formProps}
    />
  );
};

export default CategoryCascader;
