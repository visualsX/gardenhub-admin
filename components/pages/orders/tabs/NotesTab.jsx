import React from 'react';
import { Box } from '@/components/wrappers/box';

const NotesTab = ({ order, isLoading }) => {
  return (
    <Box
      loading={isLoading}
      header
      title="Order Notes"
      description="Internal communication and audit log"
    >
      <div className="space-y-4">
        {order?.notes?.length > 0 ? (
          order.notes.map((note, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-4 ${note.type === 'Internal' ? 'border border-amber-100 bg-amber-50' : 'border border-gray-100 bg-gray-50'}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  {note.type}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-800">{note.message}</p>
              <div className="mt-2 text-[10px] text-gray-400">Created by: {note.createdBy}</div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-400 italic">
            No notes recorded for this order
          </div>
        )}
      </div>
    </Box>
  );
};

export default NotesTab;
