const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const noteController = require('../controllers/noteController');
const { authenticateUser } = require('../middleware/authMiddleware') ;

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
router.get('/',authenticateUser, noteController.getAllNotes);
router.get('/:id',authenticateUser, noteController.getNoteById);
router.post('/',  authenticateUser, validateNote, noteController.createNote);
router.put('/:id',authenticateUser, validateNote, noteController.updateNote);
router.delete('/:id',authenticateUser, noteController.deleteNote);

module.exports = router;