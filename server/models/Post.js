const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content cannot be empty'],
    maxlength: 1000
  },
  tags: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
