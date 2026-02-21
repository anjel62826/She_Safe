const Blog = require('../models/Blog');
const { formatUserResponse } = require('../utils/helpers');
const DBAdapter = require('../db/dbAdapter');

exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, destination, tags, safetyRating, safetyReview, startDate, endDate } = req.body;
    const userId = req.userId;

    // Use description if content is not provided
    const blogContent = content || description;

    if (!title || !blogContent || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description/content, destination'
      });
    }

    let blog;
    if (DBAdapter.isMockMode()) {
      blog = await DBAdapter.createBlog({
        author: userId,
        title,
        content: blogContent,
        destination,
        description: blogContent,
        tags: tags || [],
        safetyRating: safetyRating || 5,
        safetyReview: safetyReview || 'Safe destination',
        travelDates: { startDate, endDate }
      });
    } else {
      blog = await Blog.create({
        author: userId,
        title,
        content: blogContent,
        destination,
        tags: tags || [],
        safetyRating: safetyRating || 5,
        safetyReview: safetyReview || 'Safe destination',
        travelDates: {
          startDate,
          endDate
        }
      });
      await blog.populate('author', 'firstName lastName profilePicture isVerified');
    }

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    let blog;
    if (DBAdapter.isMockMode()) {
      blog = await DBAdapter.findBlog({ _id: blogId });
      if (blog) {
        blog.viewCount = (blog.viewCount || 0) + 1;
        await DBAdapter.updateBlog({ _id: blogId }, { viewCount: blog.viewCount });
      }
    } else {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        { $inc: { viewCount: 1 } },
        { new: true }
      ).populate('author', 'firstName lastName profilePicture isVerified');
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { destination, tag, page = 1, limit = 10 } = req.query;

    let query = { isApproved: true, visibility: 'public' };

    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    if (tag) {
      query.tags = tag;
    }

    if (DBAdapter.isMockMode()) {
      const all = await DBAdapter.findBlogs(query || {});
      const total = all.length;
      const start = (page - 1) * limit;
      const paged = all.slice(start, start + Number(limit));
      return res.status(200).json({
        success: true,
        count: paged.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        blogs: paged
      });
    }

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName profilePicture isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId;
    if (DBAdapter.isMockMode()) {
      const b = await DBAdapter.findBlog({ _id: blogId });
      if (!b) return res.status(404).json({ success: false, message: 'Blog not found' });
      b.likes = b.likes || [];
      const likeIndex = b.likes.findIndex(like => like.userId === userId);
      if (likeIndex > -1) b.likes.splice(likeIndex, 1);
      else b.likes.push({ userId });
      await DBAdapter.updateBlog({ _id: blogId }, { likes: b.likes });
      return res.status(200).json({
        success: true,
        message: likeIndex > -1 ? 'Like removed' : 'Blog liked',
        likeCount: b.likes.length
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const likeIndex = blog.likes.findIndex(like => like.userId.toString() === userId);

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push({ userId });
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Like removed' : 'Blog liked',
      likeCount: blog.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking blog',
      error: error.message
    });
  }
};

exports.commentBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text'
      });
    }

    if (DBAdapter.isMockMode()) {
      const b = await DBAdapter.findBlog({ _id: blogId });
      if (!b) return res.status(404).json({ success: false, message: 'Blog not found' });
      b.comments = b.comments || [];
      b.comments.push({ commenterId: userId, text, createdAt: new Date() });
      await DBAdapter.updateBlog({ _id: blogId }, { comments: b.comments });
      return res.status(200).json({ success: true, message: 'Comment added successfully', blog: b });
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: {
          comments: {
            commenterId: userId,
            text
          }
        }
      },
      { new: true }
    ).populate('author', 'firstName lastName profilePicture');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

exports.bookmarkBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.userId;
    if (DBAdapter.isMockMode()) {
      const b = await DBAdapter.findBlog({ _id: blogId });
      if (!b) return res.status(404).json({ success: false, message: 'Blog not found' });
      b.bookmarks = b.bookmarks || [];
      const idx = b.bookmarks.findIndex(bb => bb.userId === userId);
      if (idx > -1) b.bookmarks.splice(idx, 1);
      else b.bookmarks.push({ userId });
      await DBAdapter.updateBlog({ _id: blogId }, { bookmarks: b.bookmarks });
      return res.status(200).json({
        success: true,
        message: idx > -1 ? 'Bookmark removed' : 'Blog bookmarked',
        bookmarkCount: b.bookmarks.length
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const bookmarkIndex = blog.bookmarks.findIndex(b => b.userId.toString() === userId);

    if (bookmarkIndex > -1) {
      blog.bookmarks.splice(bookmarkIndex, 1);
    } else {
      blog.bookmarks.push({ userId });
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: bookmarkIndex > -1 ? 'Bookmark removed' : 'Blog bookmarked',
      bookmarkCount: blog.bookmarks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error bookmarking blog',
      error: error.message
    });
  }
};

exports.getPopularDestinations = async (req, res) => {
  try {
    if (DBAdapter.isMockMode()) {
      const all = await DBAdapter.findBlogs({});
      const map = {};
      for (const b of all) {
        if (!b.isApproved) continue;
        const key = b.destination || 'Unknown';
        map[key] = map[key] || { count: 0, sum: 0 };
        map[key].count += 1;
        map[key].sum += (b.safetyRating || 0);
      }
      const arr = Object.keys(map).map(k => ({ _id: k, count: map[k].count, avgRating: map[k].sum / map[k].count }));
      arr.sort((a, b) => b.count - a.count);
      return res.status(200).json({ success: true, destinations: arr.slice(0, 10) });
    }

    const destinations = await Blog.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$destination', count: { $sum: 1 }, avgRating: { $avg: '$safetyRating' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular destinations',
      error: error.message
    });
  }
};
