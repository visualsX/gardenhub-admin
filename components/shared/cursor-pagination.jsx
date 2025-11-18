'use client';

import { Button } from 'antd';
import { useEffect } from 'react';
import usePagination from '@/store/usePagination';
import { ArrowLeft, ArrowRight } from '@/lib/const/icons';
import Tx from './tx';
const CursorPagination = ({ paginationKey, pageInfo, totalCount, pageSize = 10, loading }) => {
  const pagination = usePagination((state) => state.paginations[paginationKey]);
  const init = usePagination((state) => state.init);
  const goNext = usePagination((state) => state.goNext);
  const goPrev = usePagination((state) => state.goPrev);

  useEffect(() => {
    init(paginationKey, { pageSize });
  }, [init, paginationKey, pageSize]);

  const currentPage = pagination?.page ?? 1;
  const resolvedPageSize = pagination?.pageSize ?? pageSize;
  const totalPages =
    totalCount && resolvedPageSize ? Math.max(1, Math.ceil(totalCount / resolvedPageSize)) : null;

  return (
    <div className="flex w-full items-center justify-between">
      <Button
        className="flex items-center gap-x-2"
        onClick={() => goPrev(paginationKey, pageInfo)}
        disabled={loading || !pageInfo?.hasPreviousPage || currentPage <= 1}
      >
        <ArrowLeft />
        <span>
          <Tx>Previous</Tx>
        </span>
      </Button>
      <span className="text-sm text-gray-700">
        <Tx>Page</Tx> {currentPage}
        {totalPages ? ` of ${totalPages}` : ''}
      </span>
      <Button
        className="flex items-center gap-x-2"
        onClick={() => goNext(paginationKey, pageInfo)}
        disabled={loading || !pageInfo?.hasNextPage}
      >
        <span>
          <Tx>Next</Tx>
        </span>
        <ArrowRight />
      </Button>
    </div>
  );
};

export default CursorPagination;
