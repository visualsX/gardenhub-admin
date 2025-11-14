import { Table } from 'antd';

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
        {...props}
      />
    </main>
  );
}
