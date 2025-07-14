import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BlogList from './BlogList';
import BlogForm from './BlogForm';

const BlogRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/create" element={<BlogForm />} />
      <Route path="/edit/:id" element={<BlogForm />} />
      <Route path="*" element={<Navigate to="/blogs" replace />} />
    </Routes>
  );
};

export default BlogRoutes;