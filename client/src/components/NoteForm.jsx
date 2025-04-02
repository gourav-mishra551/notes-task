import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NoteForm = ({ onSubmit, initialNote, onCancel }) => {
  const [note, setNote] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialNote changes
  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    } else {
      setNote({ title: '', content: '' });
    }
  }, [initialNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!note.title.trim()) {
      toast.error('Please enter a title for your note');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(note);
      if (success) {
        toast.success(initialNote ? 'Note updated successfully!' : 'Note created successfully!');
        if (!initialNote) {
          // Only clear the form if we're creating a new note
          setNote({ title: '', content: '' });
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6" data-testid="note-form">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {initialNote ? 'Edit Note' : 'Create New Note'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter note title"
            data-testid="title-input"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={note.content}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter note content"
            data-testid="content-input"
          />
        </div>

        <div className="flex justify-end space-x-2">
          {initialNote && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isSubmitting}
            data-testid="submit-button"
          >
            {isSubmitting ? 'Saving...' : initialNote ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
