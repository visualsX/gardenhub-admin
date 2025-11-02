import { Table } from 'antd';

// ============================================
//  REUSABLE DATA TABLE COMPONENT
// ============================================
export default function DataTable({
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
    <>
      <Table
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
      <style jsx global>{`
        .ant-table {
          font-size: 14px;
        }
        .ant-table-thead > tr > th {
          background: #fafafa;
          color: #535862;
          font-weight: 500;
          font-size: 12px;
          border-bottom: 1px solid #e9eaeb;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e9eaeb;
        }
        .ant-table-tbody > tr:hover > td {
          background: #f9fafb;
        }
      `}</style>
    </>
  );
}
