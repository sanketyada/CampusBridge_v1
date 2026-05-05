const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name role').sort('-createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const post = await Post.create({
      content,
      tags,
      author: req.user._id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      author: req.user._id,
      text
    });

    await post.save();
    
    // Populate the new comment's author
    const updatedPost = await Post.findById(post._id).populate('author', 'name role').populate('comments.author', 'name role');
    
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  likePost,
  addComment
};
