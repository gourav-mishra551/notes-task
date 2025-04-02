import React from 'react';
import NoteItem from './NoteItem';

const NotesList = ({ notes, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No notes yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Notes</h2>
      <div className="space-y-4">
        {notes.map(note => (
          <NoteItem 
            key={note._id} 
            note={note} 
            onEdit={() => onEdit(note)} 
            onDelete={() => onDelete(note._id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default NotesList;