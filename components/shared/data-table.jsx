import { Table } from 'antd';
import CursorPagination from '@/components/shared/cursor-pagination';

// ============================================
//  REUSABLE DATA TABLE COMPONENT
// ============================================
export default function DataTable({
  rowKey = 'id',
  columns,
  data,
  loading = false,
  pagination = false,
  className = '',
  rowClassName,
  onRow,
  scroll,
  cursorPaginationProps,
  cursorPaginationWrapperClassName = 'flex items-center justify-end border-t border-gray-100 px-6 py-4',
  minHeight = 200,
  ...props
}) {
  return (
    <main className="table-wrapper">
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        className={`custom-data-table ${className}`}
        rowClassName={rowClassName}
        onRow={onRow}
        scroll={scroll}
        style={minHeight ? { minHeight, ...props.style } : props.style}
        {...props}
      />
      {cursorPaginationProps ? (
        <div className={cursorPaginationWrapperClassName}>
          <CursorPagination {...cursorPaginationProps} />
        </div>
      ) : null}
    </main>
  );
}
