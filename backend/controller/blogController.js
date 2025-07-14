import Blog from '../models/blogModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    // Apply filters if provided
    const filter = { published: true };
    
    // Apply category filter if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, published } = req.body;
    
    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    } else if (req.body.image) {
      // If image is provided as a URL
      imageUrl = req.body.image;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      image: imageUrl,
      category,
      tags: tags ? JSON.parse(tags) : [],
      author: req.user.id,
      published: published === 'false' ? false : true
    });

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    const { title, excerpt, content, category, tags, published } = req.body;
    
    // Handle image upload if there's a new image
    let imageUrl = blog.image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    } else if (req.body.image && req.body.image !== blog.image) {
      imageUrl = req.body.image;
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        excerpt,
        content,
        image: imageUrl,
        category,
        tags: tags ? JSON.parse(tags) : blog.tags,
        published: published === 'false' ? false : true,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user is the author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

// Get blogs by author
export const getBlogsByAuthor = async (req, res) => {
  try {
    // Make sure we have a user in the request
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};
