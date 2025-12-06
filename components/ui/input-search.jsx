import { useState, useEffect } from 'react';
import { Input } from 'antd';
import Search from '@/public/shared/search.svg';

export default function InputSearch({
  className = '',
  placeholder = 'search here',
  onSearchChange = () => {},
  debounceMs = 500,
  defaultValue = '',
}) {
  const [value, setValue] = useState(defaultValue);

  // Debounce the search callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearchChange]);

  // Sync with external defaultValue changes
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Input
      allowClear
      className={`${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      prefix={
        <span className="ltr:pr-3 rtl:pl-3">
          <Search />
        </span>
      }
    />
  );
}
