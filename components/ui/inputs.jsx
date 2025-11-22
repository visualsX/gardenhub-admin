import { validate } from '@/lib/const/validations';
import {
  Form,
  Input,
  Select,
  Switch,
  Checkbox,
  Radio,
  DatePicker,
  TimePicker,
  Slider,
  InputNumber,
  Rate,
  Upload,
  Cascader,
  AutoComplete,
} from 'antd';
import DownIcon from '@/public/shared/select-down.svg';
const { TextArea, Password, Search } = Input;
const { RangePicker } = DatePicker;

// ===== FormInput Component =====
export const FormInput = ({
  name,
  label,
  placeholder,
  type = 'text',
  suffix,
  prefix,
  disabled = false,
  rules = validate(label, {
    required: true,
    type: name == 'email' && 'email',
  }),
  className,
  labelClassName = 'font-outfit font-medium text-black',
  inputClassName,
  noStyle = false,
  maxLength,
  showCount = false,
  allowClear = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Input
        placeholder={placeholder}
        type={type}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
        suffix={suffix}
        prefix={prefix}
        disabled={disabled}
        maxLength={maxLength}
        showCount={showCount}
        allowClear={allowClear}
      />
    </Form.Item>
  );
};

// ===== FormPassword Component =====
export const FormPassword = ({
  name,
  label,
  placeholder,
  disabled = false,
  rules = validate(label, { required: true, type: 'password' }),
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Password
        placeholder={placeholder}
        disabled={disabled}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormSearch Component =====
export const FormSearch = ({
  name,
  label,
  placeholder,
  disabled = false,
  onSearch,
  rules,
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  enterButton = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Search
        placeholder={placeholder}
        disabled={disabled}
        onSearch={onSearch}
        enterButton={enterButton}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormTextArea Component =====
export const FormTextArea = ({
  name,
  label,
  placeholder,
  rows = 3,
  disabled = false,
  rules = validate(label, { required: true, minLength: 12, maxLength: 200 }),
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  maxLength,
  showCount = false,
  autoSize = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <TextArea
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        showCount={showCount}
        autoSize={autoSize}
        className={`w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormInputNumber Component =====
export const FormInputNumber = ({
  name,
  label,
  placeholder,
  min,
  max,
  step = 1,
  disabled = false,
  rules = validate(label, { type: 'number', required: true }),
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  prefix,
  suffix,
  formatter,
  parser,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <InputNumber
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        formatter={formatter}
        parser={parser}
        style={{ width: '100%' }}
        size="large"
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormSelect Component =====
export const FormSelect = ({
  name,
  label,
  placeholder,
  options,
  disabled = false,
  rules = label && validate(label, { required: true }),
  className,
  labelClassName,
  inputClassName,
  onChange,
  noStyle = false,
  mode, // 'multiple' | 'tags'
  allowClear = true,
  showSearch = false,
  filterOption,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Select
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        mode={mode}
        suffixIcon={<DownIcon />}
        allowClear={allowClear}
        showSearch={showSearch}
        filterOption={filterOption}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      >
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

// ===== FormAutoComplete Component =====
export const FormAutoComplete = ({
  name,
  label,
  placeholder,
  options,
  disabled = false,
  rules = validate(label, { required: true }),
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  onSearch,
  onSelect,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <AutoComplete
        placeholder={placeholder}
        disabled={disabled}
        options={options}
        onSearch={onSearch}
        onSelect={onSelect}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Form.Item>
  );
};

// ===== FormCascader Component =====
export const FormCascader = ({
  name,
  label,
  placeholder,
  options,
  disabled = false,
  rules = label && validate(label, { required: true }),
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  onChange,
  changeOnSelect = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Cascader
        placeholder={placeholder}
        disabled={disabled}
        options={options}
        onChange={onChange}
        changeOnSelect={changeOnSelect}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormSwitch Component =====
export const FormSwitch = ({
  name,
  label,
  disabled = false,
  className,
  onChange,
  noStyle = false,
  checkedChildren,
  unCheckedChildren,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      valuePropName="checked"
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Switch
        disabled={disabled}
        onChange={onChange}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />
    </Form.Item>
  );
};

// ===== FormCheckbox Component =====
export const FormCheckbox = ({
  name,
  label,
  disabled = false,
  className,
  labelClassName,
  onChange,
  noStyle = false,
  children,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      valuePropName="checked"
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Checkbox disabled={disabled} onChange={onChange}>
        {children}
      </Checkbox>
    </Form.Item>
  );
};

// ===== FormCheckboxGroup Component =====
export const FormCheckboxGroup = ({
  name,
  label,
  options,
  disabled = false,
  className,
  onChange,
  noStyle = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Checkbox.Group options={options} disabled={disabled} onChange={onChange} />
    </Form.Item>
  );
};

// ===== FormRadioGroup Component =====
export const FormRadioGroup = ({
  name,
  label,
  options,
  disabled = false,
  className,
  labelClassName,
  onChange,
  noStyle = false,
  buttonStyle = 'outline', // 'outline' | 'solid'
  optionType = 'default', // 'default' | 'button'
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Radio.Group
        options={options}
        disabled={disabled}
        onChange={onChange}
        buttonStyle={buttonStyle}
        optionType={optionType}
      />
    </Form.Item>
  );
};

// ===== FormDatePicker Component =====
export const FormDatePicker = ({
  name,
  label,
  placeholder,
  disabled = false,
  rules = validate(label, { required: true }),
  className,
  inputClassName,
  labelClassName,
  noStyle = false,
  format = 'YYYY-MM-DD',
  showTime = false,
  picker = 'date', // 'date' | 'week' | 'month' | 'quarter' | 'year'
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <DatePicker
        placeholder={placeholder}
        disabled={disabled}
        format={format}
        showTime={showTime}
        picker={picker}
        style={{ width: '100%' }}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormRangePicker Component =====
export const FormRangePicker = ({
  name,
  label,
  placeholder = ['Start Date', 'End Date'],
  disabled = false,
  rules = validate(label, { required: true }),
  className,
  labelClassName,
  inputClassName,
  noStyle = false,
  format = 'YYYY-MM-DD',
  showTime = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <RangePicker
        placeholder={placeholder}
        disabled={disabled}
        format={format}
        showTime={showTime}
        style={{ width: '100%' }}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormTimePicker Component =====
export const FormTimePicker = ({
  name,
  label,
  placeholder,
  disabled = false,
  rules = validate(label, { required: true }),
  labelClassName,
  className,
  noStyle = false,
  format = 'HH:mm:ss',
  use12Hours = false,
  inputClassName,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <TimePicker
        placeholder={placeholder}
        disabled={disabled}
        format={format}
        use12Hours={use12Hours}
        style={{ width: '100%' }}
        className={`h-[38px]! w-full! ${inputClassName ?? ''}`}
      />
    </Form.Item>
  );
};

// ===== FormSlider Component =====
export const FormSlider = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  labelClassName,
  className,
  noStyle = false,
  marks,
  range = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Slider min={min} max={max} step={step} disabled={disabled} marks={marks} range={range} />
    </Form.Item>
  );
};

// ===== FormRate Component =====
export const FormRate = ({
  name,
  label,
  count = 5,
  disabled = false,
  allowHalf = false,
  labelClassName,
  className,
  noStyle = false,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      className={className}
      noStyle={noStyle}
      {...formItemProps}
    >
      <Rate count={count} disabled={disabled} allowHalf={allowHalf} />
    </Form.Item>
  );
};

// ===== FormUpload Component =====
export const FormUpload = ({
  name,
  label,
  disabled = false,
  rules = validate(label, { required: true }),
  labelClassName,
  className,
  noStyle = false,
  listType = 'text', // 'text' | 'picture' | 'picture-card'
  maxCount,
  accept,
  beforeUpload,
  onChange,
  children,
  ...formItemProps
}) => {
  return (
    <Form.Item
      name={name}
      label={label ? <span className={labelClassName}>{label}</span> : undefined}
      rules={rules}
      className={className}
      noStyle={noStyle}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      }}
      {...formItemProps}
    >
      <Upload
        disabled={disabled}
        listType={listType}
        maxCount={maxCount}
        accept={accept}
        beforeUpload={beforeUpload}
        onChange={onChange}
      >
        {children}
      </Upload>
    </Form.Item>
  );
};

// ===== Usage Examples =====
/*
import { 
  FormInput, 
  FormPassword,
  FormSearch,
  FormTextArea, 
  FormInputNumber,
  FormSelect, 
  FormAutoComplete,
  FormCascader,
  FormTreeSelect,
  FormSwitch,
  FormCheckbox,
  FormCheckboxGroup,
  FormRadioGroup,
  FormDatePicker,
  FormRangePicker,
  FormTimePicker,
  FormSlider,
  FormRate,
  FormUpload
} from './FormComponents';

// ===== Basic Inputs =====
<FormInput name="name" label="Name" placeholder="Enter name" />
<FormPassword name="password" label="Password" placeholder="Enter password" />
<FormSearch name="search" label="Search" placeholder="Search..." onSearch={(value) => console.log(value)} />
<FormTextArea name="description" label="Description" rows={4} showCount maxLength={500} />
<FormInputNumber name="price" label="Price" min={0} max={10000} prefix="$" />

// ===== Select Components =====
<FormSelect 
  name="category" 
  label="Category"
  options={[
    { value: '1', label: 'Category 1' },
    { value: '2', label: 'Category 2' }
  ]}
  showSearch
/>

<FormSelect 
  name="tags" 
  label="Tags"
  mode="multiple"
  options={[{ value: 'tag1', label: 'Tag 1' }]}
/>

<FormAutoComplete
  name="search"
  label="Auto Complete"
  options={[{ value: 'Option 1' }, { value: 'Option 2' }]}
/>

<FormCascader
  name="location"
  label="Location"
  options={[
    {
      value: 'country1',
      label: 'Country 1',
      children: [
        { value: 'city1', label: 'City 1' }
      ]
    }
  ]}
/>

<FormTreeSelect
  name="organization"
  label="Organization"
  treeData={[
    {
      title: 'Parent',
      value: 'parent',
      children: [
        { title: 'Child', value: 'child' }
      ]
    }
  ]}
/>

// ===== Boolean Inputs =====
<FormSwitch name="active" label="Active" checkedChildren="ON" unCheckedChildren="OFF" />
<FormCheckbox name="agree" label="Agree">I agree to terms</FormCheckbox>

<FormCheckboxGroup
  name="interests"
  label="Interests"
  options={[
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' }
  ]}
/>

<FormRadioGroup
  name="gender"
  label="Gender"
  options={[
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ]}
/>

<FormRadioGroup
  name="size"
  label="Size"
  optionType="button"
  buttonStyle="solid"
  options={[
    { label: 'Small', value: 'small' },
    { label: 'Large', value: 'large' }
  ]}
/>

// ===== Date & Time =====
<FormDatePicker name="birthDate" label="Birth Date" />
<FormDatePicker name="datetime" label="Date Time" showTime />
<FormDatePicker name="month" label="Month" picker="month" />
<FormRangePicker name="dateRange" label="Date Range" />
<FormTimePicker name="time" label="Time" />

// ===== Other Inputs =====
<FormSlider name="volume" label="Volume" min={0} max={100} />
<FormRate name="rating" label="Rating" allowHalf />
<FormUpload name="files" label="Upload Files" maxCount={5}>
  <Button>Upload</Button>
</FormUpload>
<FormUpload name="images" label="Upload Images" listType="picture-card" maxCount={3}>
  <div>Upload</div>
</FormUpload>
*/
