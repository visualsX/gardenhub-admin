'use client';

import Arrow from '@/public/shared/arrow-left.svg';

// ============================================
// 6. PAGINATION COMPONENT
// ============================================
export default function Pagination({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
  onPrevious,
  onNext,
  className = '',
}) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Arrow />
        Previous
      </button>
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                currentPage === page ? 'bg-green-700 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <Arrow size={18} className="rotate-180" />
      </button>
    </div>
  );
}
