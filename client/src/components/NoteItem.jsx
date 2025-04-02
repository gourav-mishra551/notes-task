import React from 'react';

const NoteItem = ({ note, onEdit, onDelete }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log(note)

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden" data-testid="note-item">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-800">{note.title}</h3>
          <span className="text-xs text-gray-500">{formatDate(note.updatedAt || note.createdAt)}</span>
        </div>
        <p className="mt-2 text-gray-600 whitespace-pre-line">{note.content}</p>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={onEdit}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-300"
            data-testid="edit-button"
          >
            Edit
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this note?')) {
                onDelete();
              }
            }}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300"
            data-testid="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
