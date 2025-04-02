const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const noteController = require('../controllers/noteController');

// Validation middleware
const validateNote = [
  check('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  check('content')
    .optional()
    .trim()
];

// Routes
router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.post('/create', validateNote, noteController.createNote);
router.put('/:id', validateNote, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;