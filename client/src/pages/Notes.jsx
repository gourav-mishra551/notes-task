import React from 'react'
import { useState, useEffect } from 'react';
import NotesList from '../components/NotesList';
import NoteForm from '../components/NoteForm';
import { fetchNotes, createNote, updateNote, deleteNote } from '../services/api';
import { Toaster } from 'react-hot-toast';
const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      loadNotes();
    }, []);
  
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCreateNote = async (note) => {
      try {
        const newNote = await createNote(note);
        setNotes([...notes, newNote]);
        return true;
      } catch (error) {
        console.error('Error creating note:', error);
        return false;
      }
    };
  
    const handleUpdateNote = async (note) => {
      try {
        const updatedNote = await updateNote(note?._id, note);
        setNotes(notes.map(n => n._id === note?._id ? updatedNote : n));
        setCurrentNote(null);
        return true;
      } catch (error) {
        console.error('Error updating note:', error);
        return false;
      }
    };
  
    const handleDeleteNote = async (id) => {
      try {
        await deleteNote(id);
        setNotes(notes.filter(note => note?._id !== id));
        return true;
      } catch (error) {
        console.error('Error deleting note:', error);
        return false;
      }
    };
  
    const editNote = (note) => {
      setCurrentNote(note);
    };
  
    const cancelEdit = () => {
      setCurrentNote(null);
    };
  return (
    <div className="min-h-screen bg-gray-50">
    <Toaster position="top-right" />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">Notes App</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <NoteForm 
            onSubmit={currentNote ? handleUpdateNote : handleCreateNote}
            initialNote={currentNote}
            onCancel={cancelEdit}
          />
        </div>
        
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <NotesList 
              notes={notes} 
              onEdit={editNote} 
              onDelete={handleDeleteNote} 
            />
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Notes