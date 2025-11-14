import Trash2 from '@/public/shared/trash.svg';
import Edit2 from '@/public/shared/edit.svg';
import useUiStates from '@/store/useUiStates';

const ColumnActions = ({
  edit = true,
  trash = true,
  view = false,
  record,
  route = null,
  editHandlerExtra = () => {},
  path,
}) => {
  // hooks and states
  const { openDeleteModal } = useUiStates();

  //jsx
  return (
    <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
      <button onClick={() => openDeleteModal(true, record)} className="cursor-pointer">
        <Trash2 size={18} />
      </button>
      <button className="cursor-pointer">
        <Edit2 size={18} />
      </button>
    </div>
  );
};

export default ColumnActions;
