import { Input } from 'antd';
import Search from '@/public/shared/search.svg';

export default function InputSearch({
  className = '',
  placeholder = 'search here',
  onSearchChange = () => {},
}) {
  return (
    <Input
      className={`h-11 ${className}`}
      placeholder={placeholder}
      prefix={
        <span className="ltr:pr-3 rtl:pl-3">
          <Search />
        </span>
      }
      onChange={({ target }) => onSearchChange(target.value)}
    />
  );
}
