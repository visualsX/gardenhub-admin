'use client';

import DeleteIcon from '@/public/shared/trash.svg';
import EditIcon from '@/public/shared/edit.svg';

// ============================================
// 7. ACTION BUTTONS COMPONENT
// ============================================
export default function TableActionButtons({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-x-3 ${className}`}>
      {showDelete && (
        <button onClick={onDelete} className="transition-colors">
          <DeleteIcon />
        </button>
      )}
      {showEdit && (
        <button onClick={onEdit} className="transition-colors">
          <EditIcon />
        </button>
      )}
    </div>
  );
}
