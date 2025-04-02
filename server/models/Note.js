const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true // Every note must belong to a user
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Virtual for note's URL (for future use if needed)
noteSchema.virtual('url').get(function () {
  return `/notes/${this._id}`;
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
