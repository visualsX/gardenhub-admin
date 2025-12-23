'use client';

import React from 'react';
import { Form, Button } from 'antd';
import { useAddonTypes } from '@/hooks/useAddons';
import Trash2 from '@/public/shared/trash-red.svg';
import PlusGray from '@/public/shared/Plus-gray.svg';

import {
  FormInput,
  FormInputNumber,
  FormSwitch,
  FormTextArea,
  FormSelect,
} from '@/components/ui/inputs';
import { Box } from '@/components/wrappers/box';
import InputWrapper from '@/components/wrappers/input-wrapper';

const AddonForm = () => {
  const { data: addonTypes, isLoading: typesLoading } = useAddonTypes();
  const form = Form.useFormInstance();

  const handleDefaultChange = (checked, currentIndex) => {
    if (checked) {
      setTimeout(() => {
        const options = form.getFieldValue('options') || [];
        options.forEach((_, index) => {
          if (index !== currentIndex) {
            form.setFieldValue(['options', index, 'isDefault'], false);
          }
        });
      }, 0);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <FormInput
          name="name"
          label="Addon Name"
          placeholder="e.g. Gift Wrapping"
          rules={[{ required: true, message: 'Please enter name' }]}
        />
        <FormSelect
          name="addonTypeId"
          label="Addon Type"
          placeholder="Select Type"
          options={addonTypes?.map((t) => ({ label: t.name, value: t.id })) || []}
          loading={typesLoading}
          rules={[{ required: true, message: 'Please select a type' }]}
        />
        <FormTextArea name="description" label="Description" rows={3} rules={null} />
        <div className="mt-5">
          <InputWrapper title="Visible to Customers" desc="Show this addon on the store">
            <FormSwitch
              name="isActive"
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
          </InputWrapper>
        </div>
      </div>

      <Box
        header
        title="Addon Options"
        description={'List of options available for this addon'}
        className="mt-4"
      >
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-4">
              {fields.map((field) => {
                const { key, ...restField } = field;
                return (
                  <Box header title={'Option ' + (key + 1)} key={key} classRest="relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 />}
                        onClick={() => remove(restField.name)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        {...restField}
                        label="Option Name"
                        name={[restField.name, 'name']}
                        rules={[{ required: true, message: 'Required' }]}
                        placeholder="Option Name"
                        className="mb-2!"
                      />
                      <FormInputNumber
                        {...restField}
                        label="Sort Order"
                        name={[restField.name, 'displayOrder']}
                        min={0}
                        rules={null}
                        className="mb-0!"
                      />
                      {/* <FormInput
                      {...restField}
                      label="Image URL"
                      name={[restField.name, 'imageUrl']}
                      placeholder="https://..."
                      rules={null}
                      className="mb-2!"
                    /> */}
                      <FormInputNumber
                        {...restField}
                        label="Default Price"
                        name={[restField.name, 'defaultPrice']}
                        min={0}
                        suffix="AED"
                        rules={null}
                        className="mb-2!"
                        style={{ width: '100%' }}
                      />
                      <FormInputNumber
                        {...restField}
                        label="Sale Price"
                        name={[restField.name, 'salePrice']}
                        min={0}
                        suffix="AED"
                        rules={null}
                        className="mb-2!"
                        style={{ width: '100%' }}
                      />
                      <InputWrapper title={'Is Default'} desc="Set this option as default">
                        <FormSwitch
                          {...restField}
                          name={[restField.name, 'isDefault']}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                          onChange={(checked) => handleDefaultChange(checked, restField.name)}
                        />
                      </InputWrapper>
                      <InputWrapper
                        title="Visible option to Customers"
                        desc="Show this option on the store"
                      >
                        <FormSwitch
                          {...restField}
                          name={[restField.name, 'isActive']}
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                        />
                      </InputWrapper>
                    </div>

                    <FormTextArea
                      {...restField}
                      label="Description"
                      name={[restField.name, 'description']}
                      rows={2}
                      rules={null}
                      className="mb-0!"
                    />
                  </Box>
                );
              })}
              <Button type="dashed" onClick={() => add()} block icon={<PlusGray />}>
                Add Option
              </Button>
            </div>
          )}
        </Form.List>
      </Box>
    </>
  );
};

export default AddonForm;
