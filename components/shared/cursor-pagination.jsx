import { Pagination } from 'antd';
import { useState } from 'react';

/**
 * Reusable Cursor Pagination Component
 * Handles GraphQL cursor-based pagination with page number display
 */
const CursorPagination = ({ pageInfo, totalCount, pageSize = 2, onPaginate, className = '' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorHistory, setCursorHistory] = useState([null]); // Stack to track cursors for each page

  if (!pageInfo || totalCount === 0) return null;

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page) => {
    const isGoingForward = page > currentPage;
    const isGoingBack = page < currentPage;

    if (isGoingForward && pageInfo.hasNextPage) {
      // Going to next page
      const newCursorHistory = [...cursorHistory];
      if (!newCursorHistory[page - 1]) {
        newCursorHistory[page - 1] = pageInfo.endCursor;
      }
      setCursorHistory(newCursorHistory);

      onPaginate({
        first: pageSize,
        after: pageInfo.endCursor,
        last: null,
        before: null,
      });

      setCurrentPage(page);
    } else if (isGoingBack && pageInfo.hasPreviousPage) {
      // Going to previous page
      const previousCursor = cursorHistory[page - 2] || null;

      onPaginate({
        first: pageSize,
        after: previousCursor,
        last: null,
        before: null,
      });

      setCurrentPage(page);
    } else if (page === 1) {
      // Going back to first page
      setCursorHistory([null]);

      onPaginate({
        first: pageSize,
        after: null,
        last: null,
        before: null,
      });

      setCurrentPage(1);
    }
  };

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 ${className}`}
    >
      <div className="text-sm text-gray-700">
        Showing page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span> ({totalCount} total items)
      </div>

      <Pagination
        current={currentPage}
        total={totalCount}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
        showQuickJumper={false}
        hideOnSinglePage={true}
        disabled={totalPages <= 1}
      />
    </div>
  );
};

export default CursorPagination;
