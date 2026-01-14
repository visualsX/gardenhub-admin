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
            <div key={idx} className={`p-4 rounded-lg ${note.type === 'Internal' ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{note.type}</span>
                <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-800">{note.message}</p>
              <div className="mt-2 text-[10px] text-gray-400">
                Created by: {note.createdBy}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 italic">
            No notes recorded for this order
          </div>
        )}
      </div>
    </Box>
  );
};

export default NotesTab;
