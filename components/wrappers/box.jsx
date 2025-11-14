import { Skeleton } from 'antd';
import Title from '../ui/title';

export function Box({ children, loading = false, header = false, extra, title, description }) {
  return (
    <div className="border-smoke-light rounded-2xl border bg-white p-6">
      {header && (
        <div className="flex items-center justify-between">
          <Title title={title} description={description} />
          {extra}
        </div>
      )}
      <Skeleton loading={loading}>{children}</Skeleton>
    </div>
  );
}
