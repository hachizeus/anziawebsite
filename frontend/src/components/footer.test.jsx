import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Footer from './footer';
import axios from 'axios';
const React = require('react');

// frontend/src/components/footer.test.jsx

// Mock framer-motion to render children directly
jest.mock('framer-motion', () => {
  return {
    motion: {
      div: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
      a: React.forwardRef((props, ref) => <a ref={ref} {...props} />),
      button: React.forwardRef((props, ref) => <button ref={ref} {...props} />),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Mock lucide-react icons to simple spans
jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (target, prop) => (props) => <span data-testid={`icon-${prop}`} {...props} />,
  });
});

// Mock react-toastify
const toast = { error: jest.fn(), success: jest.fn() };
jest.mock('react-toastify', () => ({
  toast,
  ToastContainer: () => <div data-testid="toast-container" />,
}));

jest.mock('axios');

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders brand/logo and tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/Anzia Electronics /i)).toBeInTheDocument();
    expect(screen.getByText(/Your trusted partner in finding the perfect home/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-Home')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Footer />);
    expect(screen.getByTitle(/Twitter/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Facebook/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Instagram/i)).toBeInTheDocument();
    expect(screen.getByTitle(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByTitle(/GitHub/i).getAttribute('href')).toMatch(/github\.com/i);
  });

  it('renders Quick Links and Support links', () => {
    render(<Footer />);
    // Quick Links
    expect(screen.getAllByText('Home')[0].closest('a')).toHaveAttribute('href', '/');
    expect(screen.getAllByText('Properties')[0].closest('a')).toHaveAttribute('href', '/properties');
    // Support
    expect(screen.getAllByText('Customer Support')[0].closest('a')).toBeInTheDocument();
    expect(screen.getAllByText('FAQs')[0].closest('a')).toBeInTheDocument();
  });

  it('renders Contact Us info', () => {
    render(<Footer />);
    expect(screen.getByText(/123 Property Plaza/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 \(234\) 567-890/)).toBeInTheDocument();
    expect(screen.getByText(/support@Anzia Electronics \.com/i)).toBeInTheDocument();
  });

  it('renders newsletter form and validates empty email', async () => {
    render(<Footer />);
    const input = screen.getByPlaceholderText(/Your email address/i);
    const button = screen.getByRole('button', { name: /subscribe/i });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter your email');
    });
  });

  it('submits newsletter form and shows success toast', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    render(<Footer />);
    const input = screen.getByPlaceholderText(/Your email address/i);
    const button = screen.getByRole('button', { name: /subscribe/i });
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Successfully subscribed to our newsletter!');
    });
  });

  it('shows error toast on newsletter API failure', async () => {
    axios.post.mockRejectedValue(new Error('fail'));
    render(<Footer />);
    const input = screen.getByPlaceholderText(/Your email address/i);
    const button = screen.getByRole('button', { name: /subscribe/i });
    fireEvent.change(input, { target: { value: 'fail@example.com' } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to subscribe. Please try again.');
    });
  });

  it('renders bottom bar copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
  });

  it('renders Browse Our Properties link', () => {
    render(<Footer />);
    const link = screen.getByText(/Browse Our Properties/i).closest('a');
    expect(link).toHaveAttribute('href', '/properties');
  });

  it('renders mobile accordions and toggles them', () => {
    // Simulate mobile by setting window.innerWidth < 1024
    global.innerWidth = 500;
    render(<Footer />);
    const quickLinksBtn = screen.getAllByRole('button', { name: /Quick Links/i })[0];
    fireEvent.click(quickLinksBtn);
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    const supportBtn = screen.getAllByRole('button', { name: /Support/i })[0];
    fireEvent.click(supportBtn);
    expect(screen.getAllByText('FAQs')[0]).toBeInTheDocument();
  });
});

