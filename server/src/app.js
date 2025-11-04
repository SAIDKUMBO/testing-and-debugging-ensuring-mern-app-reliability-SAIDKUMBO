const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/Post');
const { authMiddleware } = require('./utils/auth');

const app = express();
app.use(bodyParser.json());

app.post('/api/posts', authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content required' });
  try {
    const slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const post = await Post.create({ title, content, author: req.user.id, category: category || null, slug });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const posts = await Post.find(filter).skip(skip).limit(Number(limit)).lean();
  return res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (err) {
    return res.status(404).json({ error: 'Not found' });
  }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await post.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = app;
