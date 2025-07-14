import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Plus, X, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ResponsiveCard from '../../components/ResponsiveCard';
import { responsivePadding, responsiveText } from '../../utils/responsiveUtils';

const backendurl = import.meta.env.VITE_BACKEND_URL || "https://real-estate-backend-vybd.onrender.com";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Other',
    published: true
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const fileInputRef = useRef(null);
  const contentFileInputRef = useRef(null);
  const tagInputRef = useRef(null);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendurl}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const blog = response.data.data;
        setFormData({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content || '',
          category: blog.category,
          published: blog.published
        });
        setTags(blog.tags || []);
        setImageUrl(blog.image);
        setImagePreview(blog.image);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleContentFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/html' && file.type !== 'text/plain') {
      toast.error('Please select an HTML or text file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result;
      
      // Sanitize HTML content to prevent Quirks Mode
      if (file.type === 'text/html') {
        content = content
          .replace(/<!DOCTYPE[^>]*>/i, '')
          .replace(/<html[^>]*>|<\/html>/gi, '')
          .replace(/<head[^>]*>.*?<\/head>/gis, '')
          .replace(/<body[^>]*>|<\/body>/gi, '');
      }
      
      setFormData(prev => ({
        ...prev,
        content: content
      }));
      
      toast.success('Content uploaded successfully');
    };
    
    reader.readAsText(file);
  };

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
      tagInputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!imagePreview && !imageUrl) {
      toast.error('Please upload a featured image');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('published', formData.published);
      formDataToSend.append('tags', JSON.stringify(tags));
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (imageUrl) {
        formDataToSend.append('image', imageUrl);
      }

      let response;
      if (isEditing) {
        response = await axios.put(`${backendurl}/api/blogs/${id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${backendurl}/api/blogs`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      if (response.data.success) {
        toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully`);
        navigate('/admin/blogs');
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} blog:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} blog`);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Buying', 'Selling', 'Investment', 'Tips', 'Market Updates', 'Other'];

  return (
    <div className={responsivePadding.container}>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/blogs')}
          className="flex items-center mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Blogs
        </button>
        <h2 className={`${responsiveText.heading} m-0`}>
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
      </div>

      <ResponsiveCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="mb-4">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Enter a short summary of the blog post"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
                  required
                  maxLength="200"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/200 characters
                </p>
              </div>

              {/* Content */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <button
                    type="button"
                    onClick={() => contentFileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Upload from file
                  </button>
                </div>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter the blog content or upload from a file"
                  rows="12"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
                  required
                ></textarea>
                <input
                  type="file"
                  ref={contentFileInputRef}
                  onChange={handleContentFileUpload}
                  accept=".html,.txt,text/html,text/plain"
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can write content directly or upload an HTML/text file
                </p>
              </div>
            </div>

            <div>
              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={tagInputRef}
                    placeholder="Add a tag"
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-200 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image *
                </label>
                {imagePreview ? (
                  <div className="relative mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setImageUrl('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#91BB3E]"
                  >
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Published Status */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#91BB3E] focus:ring-[#91BB3E] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#91BB3E] hover:bg-[#7a9e33] text-white rounded-lg flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Blog' : 'Publish Blog'}
                </>
              )}
            </button>
          </div>
        </form>
      </ResponsiveCard>
    </div>
  );
};

export default BlogForm;