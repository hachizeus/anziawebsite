// Mock API middleware for blog endpoints during development
import { v4 as uuidv4 } from 'uuid';

// Sample blog data
const mockBlogs = [
  {
    _id: '1',
    title: 'Understanding the Kenyan Real Estate Market',
    excerpt: 'A comprehensive guide to investing in Kenyan real estate in 2023.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
    category: 'Investment',
    tags: ['Kenya', 'Investment', 'Guide'],
    author: { _id: 'user1', name: 'John Doe' },
    published: true,
    createdAt: new Date('2023-06-15').toISOString(),
    updatedAt: new Date('2023-06-15').toISOString()
  },
  {
    _id: '2',
    title: 'Top 5 Neighborhoods in Nairobi for Families',
    excerpt: 'Discover the best family-friendly neighborhoods in Nairobi with great schools and amenities.',
    content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3',
    category: 'Tips',
    tags: ['Nairobi', 'Family', 'Neighborhoods'],
    author: { _id: 'user1', name: 'John Doe' },
    published: true,
    createdAt: new Date('2023-07-22').toISOString(),
    updatedAt: new Date('2023-07-22').toISOString()
  },
  {
    _id: '3',
    title: 'How to Finance Your First product Purchase',
    excerpt: 'Learn about mortgage options and financing strategies for first-time buyers.',
    content: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3',
    category: 'Buying',
    tags: ['Finance', 'First-time Buyers', 'Mortgage'],
    author: { _id: 'user1', name: 'John Doe' },
    published: true,
    createdAt: new Date('2023-08-10').toISOString(),
    updatedAt: new Date('2023-08-10').toISOString()
  }
];

// Mock middleware for blog endpoints
export const mockBlogApi = (req, res, next) => {
  // Check if we're in development mode
  if (process.env.NODE_ENV !== 'development') {
    return next();
  }

  // Check if the mock API flag is enabled
  if (process.env.USE_MOCK_API !== 'true') {
    return next();
  }

  // Add mock user to request for protected routes
  req.user = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  };

  const path = req.path;
  const method = req.method;

  // GET /api/blogs - Get all blogs
  if (path === '/api/blogs' && method === 'GET') {
    // Check for author query parameter
    if (req.query.author === 'me') {
      return res.status(200).json({
        success: true,
        count: mockBlogs.length,
        data: mockBlogs
      });
    }
    
    // Return all published blogs
    const publishedBlogs = mockBlogs.filter(blog => blog.published);
    return res.status(200).json({
      success: true,
      count: publishedBlogs.length,
      data: publishedBlogs
    });
  }

  // GET /api/blogs/:id - Get blog by ID
  if (path.match(/^\/api\/blogs\/[a-zA-Z0-9]+$/) && method === 'GET') {
    const id = path.split('/').pop();
    const blog = mockBlogs.find(b => b._id === id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: blog
    });
  }

  // POST /api/blogs - Create new blog
  if (path === '/api/blogs' && method === 'POST') {
    const newBlog = {
      _id: uuidv4(),
      title: req.body.title || 'Untitled Blog',
      excerpt: req.body.excerpt || 'No excerpt provided',
      content: req.body.content || 'No content provided',
      image: req.body.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
      category: req.body.category || 'Other',
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      author: { _id: 'user1', name: 'John Doe' },
      published: req.body.published === 'false' ? false : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockBlogs.push(newBlog);
    
    return res.status(201).json({
      success: true,
      data: newBlog
    });
  }

  // PUT /api/blogs/:id - Update blog
  if (path.match(/^\/api\/blogs\/[a-zA-Z0-9]+$/) && method === 'PUT') {
    const id = path.split('/').pop();
    const blogIndex = mockBlogs.findIndex(b => b._id === id);
    
    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    const updatedBlog = {
      ...mockBlogs[blogIndex],
      title: req.body.title || mockBlogs[blogIndex].title,
      excerpt: req.body.excerpt || mockBlogs[blogIndex].excerpt,
      content: req.body.content || mockBlogs[blogIndex].content,
      image: req.body.image || mockBlogs[blogIndex].image,
      category: req.body.category || mockBlogs[blogIndex].category,
      tags: req.body.tags ? JSON.parse(req.body.tags) : mockBlogs[blogIndex].tags,
      published: req.body.published === 'false' ? false : true,
      updatedAt: new Date().toISOString()
    };
    
    mockBlogs[blogIndex] = updatedBlog;
    
    return res.status(200).json({
      success: true,
      data: updatedBlog
    });
  }

  // DELETE /api/blogs/:id - Delete blog
  if (path.match(/^\/api\/blogs\/[a-zA-Z0-9]+$/) && method === 'DELETE') {
    const id = path.split('/').pop();
    const blogIndex = mockBlogs.findIndex(b => b._id === id);
    
    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    mockBlogs.splice(blogIndex, 1);
    
    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  }

  // If no mock endpoint matched, continue to the next middleware
  next();
};
