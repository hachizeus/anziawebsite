import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ResponsiveTable from '../../components/ResponsiveTable';
import ResponsiveCard from '../../components/ResponsiveCard';
import { responsivePadding, responsiveText } from '../../utils/responsiveUtils';

const backendurl = import.meta.env.VITE_BACKEND_URL || "https://real-estate-backend-vybd.onrender.com";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendurl}/api/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setBlogs(response.data.data);
        setFilteredBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchText.toLowerCase()) || 
                           blog.excerpt.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = categoryFilter ? blog.category === categoryFilter : true;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredBlogs(filtered);
  }, [searchText, categoryFilter, blogs]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${backendurl}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Blog deleted successfully');
        fetchBlogs();
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };



  const categories = ['Buying', 'Selling', 'Investment', 'Tips', 'Market Updates', 'Other'];

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Buying': return 'bg-blue-100 text-blue-800';
      case 'Selling': return 'bg-green-100 text-green-800';
      case 'Investment': return 'bg-yellow-100 text-yellow-800';
      case 'Tips': return 'bg-purple-100 text-purple-800';
      case 'Market Updates': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (blog) => (
        <div>
          <div className="font-medium text-gray-900">{blog.title}</div>
          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
            {blog.excerpt.substring(0, 60)}...
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (blog) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(blog.category)}`}>
          {blog.category}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'published',
      render: (blog) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          blog.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          <span className={`h-2 w-2 rounded-full mr-1.5 ${
            blog.published ? 'bg-green-500' : 'bg-gray-500'
          }`}></span>
          {blog.published ? 'Published' : 'Draft'}
        </span>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (blog) => (
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (blog) => (
        <div className="flex space-x-2">
          <Link 
            to={`/blogs/edit/${blog._id}`}
            className="bg-gray-200 text-gray-700 p-1.5 rounded hover:bg-gray-300"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setShowDeleteConfirm(blog._id)}
            className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className={responsivePadding.container}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={responsiveText.heading}>Blog Management</h2>
        <Link to="/blogs/create" className="bg-[#91BB3E] hover:bg-[#7a9e33] text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create New Blog
        </Link>
      </div>

      <ResponsiveCard>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative md:w-64">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="md:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#91BB3E] focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <ResponsiveTable
          columns={columns}
          data={filteredBlogs}
          isLoading={loading}
          emptyMessage="No blog posts found"
        />
      </ResponsiveCard>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;