import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, BookmarkIcon, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

const Blog = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    destination: '',
    description: '',
    tags: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/blogs');
      setBlogs(response.blogs || []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        title: newBlog.title,
        destination: newBlog.destination,
        description: newBlog.description,
        tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      
      const response = await apiClient.post('/blogs', blogData);
      
      if (response?.success) {
        setNewBlog({ title: '', destination: '', description: '', tags: '' });
        setShowCreateModal(false);
        fetchBlogs();
      } else {
        alert(response?.message || 'Failed to create post. Please try again.');
      }
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : (error?.message || 'Failed to create post. Please try again.');
      console.error('Failed to create blog:', error);
      alert(errorMsg);
    }
  };

  const handleLikeBlog = async (blogId) => {
    try {
      await apiClient.post(`/blogs/${blogId}/like`);
      fetchBlogs();
    } catch (error) {
      console.error('Failed to like blog:', error);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await apiClient.delete(`/blogs/${blogId}`);
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Travel Experiences</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Share and discover amazing travel stories from women travelers around the world
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Share Your Experience
          </button>
        </div>

        {/* Create Blog Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">Share Your Travel Experience</h2>
              <form onSubmit={handleCreateBlog}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., My Amazing Weekend in Paris"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <input
                    type="text"
                    value={newBlog.destination}
                    onChange={(e) => setNewBlog({ ...newBlog, destination: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Paris, France"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Story</label>
                  <textarea
                    value={newBlog.description}
                    onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell your travel story..."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., adventure, budget-friendly, cultural"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 btn btn-primary"
                  >
                    Post Experience
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blogs List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading experiences...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No experiences shared yet</p>
            <p className="text-sm text-gray-500">Be the first to share your travel story!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{blog.title}</h3>
                    <p className="text-sm text-primary font-medium">{blog.destination}</p>
                  </div>
                  {user && user._id === blog.author._id && (
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete post"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{blog.description}</p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-primary bg-opacity-10 text-primary text-xs px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-4">
                  <button
                    onClick={() => handleLikeBlog(blog._id)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition"
                  >
                    <Heart size={18} fill={blog.isLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{blog.likes?.length || 0} Likes</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition">
                    <MessageCircle size={18} />
                    <span className="text-sm">{blog.comments?.length || 0} Comments</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition">
                    <Share2 size={18} />
                    <span className="text-sm">Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition ml-auto">
                    <BookmarkIcon size={18} />
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>By <span className="font-medium">{blog.author.firstName} {blog.author.lastName}</span></p>
                  <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
