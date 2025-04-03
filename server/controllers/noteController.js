const Note = require('../models/Note');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all notes for the logged-in user
exports.getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from token
    const notes = await Note.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// Get a single note by ID (Only if it belongs to the user)
exports.getNoteById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const note = await Note.findOne({ _id: req.params.id, userId });

    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found or unauthorized' 
      });
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    next(error);
  }
};

// Create a new note (Automatically assigns the user ID)
exports.createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. User not found." });
    }

    const userId = req.user.id; 
    const newNote = await Note.create({ ...req.body, userId }); 

    res.status(201).json(newNote);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// Update a note (Only if it belongs to the user)
exports.updateNote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const userId = req.user.id;
    const noteId = req.params.id;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId }, // Ensure only the owner can update
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// Delete a note (Only if it belongs to the user)
exports.deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found or unauthorized' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid note ID format' 
      });
    }
    next(error);
  }
};
