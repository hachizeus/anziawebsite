import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Bookmark, Loader } from '../utils/icons.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { blogPosts as fallbackPosts } from '../assets/blogdata';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`);
        
        if (response.data.success) {
          // Format the data
          const fetchedPost = response.data.data;
          setPost({
            id: fetchedPost._id,
            title: fetchedPost.title,
            excerpt: fetchedPost.excerpt,
            content: fetchedPost.content,
            date: new Date(fetchedPost.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            image: fetchedPost.image,
            category: fetchedPost.category,
            tags: fetchedPost.tags || [],
            author: fetchedPost.author?.name || 'Makini Realtors'
          });
        } else {
          // If post not found, try to find it in fallback data
          const fallbackPost = fallbackPosts.find(post => post.id.toString() === id);
          if (fallbackPost) {
            setPost(fallbackPost);
          } else {
            setError('Blog post not found');
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        // Try to find the post in fallback data
        const fallbackPost = fallbackPosts.find(post => post.id.toString() === id);
        if (fallbackPost) {
          setPost(fallbackPost);
        } else {
          setError('Failed to load blog post');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
        toast.success("Post shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Unable to share post");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    
    if (!isBookmarked) {
      toast.success(`Saved "${post.title}" to your reading list`);
    } else {
      toast.info(`Removed "${post.title}" from your reading list`);
    }
  };

  // Sanitize HTML content to ensure it doesn't break the page structure
  const sanitizeContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Remove any DOCTYPE, html, head, or body tags
    const sanitized = htmlContent
      .replace(/<!DOCTYPE[^>]*>/i, '')
      .replace(/<html[^>]*>|<\/html>/gi, '')
      .replace(/<head[^>]*>.*?<\/head>/gis, '')
      .replace(/<body[^>]*>|<\/body>/gi, '');
      
    return sanitized;
  };

  const estimatedReadTime = post ? Math.ceil((post.content?.length || post.excerpt.length) / 1000) : 3;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-20">
        <Loader className="w-10 h-10 text-blue-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading blog post...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 max-w-3xl mx-auto">
          <div className="text-red-500 text-xl mb-2">{error || 'Blog post not found'}</div>
          <p className="text-gray-500 mb-6">The blog post you're looking for might have been removed or is temporarily unavailable.</p>
          <Link to="/blog" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all articles
          </Link>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <span className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-full">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm mb-8 gap-y-2">
              <div className="flex items-center mr-6">
                <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                {post.date}
              </div>
              <div className="flex items-center mr-6">
                <Clock className="w-4 h-4 mr-2 text-primary-500" />
                {estimatedReadTime} min read
              </div>
              {post.author && (
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">By {post.author}</span>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10 rounded-2xl overflow-hidden shadow-lg"
          >
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="prose prose-lg max-w-none mb-12 dark:prose-invert"
          >
            {/* If content is HTML */}
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }} />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {post.excerpt}
              </p>
            )}
          </motion.div>
          
          {/* Tags and Actions */}
          <div className="flex flex-wrap justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {post.tags && post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Tag className="w-3 h-3 inline-block mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;


