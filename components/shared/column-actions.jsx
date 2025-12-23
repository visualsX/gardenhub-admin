import Trash2 from '@/public/shared/trash.svg';
import Edit2 from '@/public/shared/edit.svg';
import useUiStates from '@/store/useUiStates';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ColumnActions = ({
  edit = true,
  trash = true,
  view = false,
  id,
  route = null,
  editHandlerExtra = () => {},
  onEdit,
  path,
}) => {
  // hooks and states
  const { openDeleteModal } = useUiStates();
  //jsx
  return (
    <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
      {trash && (
        <button onClick={() => openDeleteModal(true, { id })} className="cursor-pointer">
          <Trash2 size={18} />
        </button>
      )}
      {edit &&
        (onEdit ? (
          <button onClick={onEdit} className="cursor-pointer">
            <Edit2 size={18} />
          </button>
        ) : (
          <Link href={`/${path}/edit/${id}`} className="cursor-pointer">
            <Edit2 size={18} />
          </Link>
        ))}
    </div>
  );
};

export default ColumnActions;
