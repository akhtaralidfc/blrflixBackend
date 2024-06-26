const mongoose = require('mongoose');

const listSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    name: { type: String, required: true },
    movies: { type: Array, required: true, default: [] },
    visibility: { type: String, required: true, default: 'private' },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model('List', listSchema);

module.exports = List;
