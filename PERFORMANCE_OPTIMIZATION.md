# Performance Optimization Guide

This guide outlines the performance optimizations implemented in the Makini Realtors website to improve PageSpeed Insights scores.

## Key Optimizations

### 1. Image Optimizations

- **WebP Format**: Convert images to WebP format for better compression
  - Run `npm run optimize:images` in the frontend directory
  - This creates WebP versions of all JPG/PNG images

- **Proper Image Dimensions**: Use the `OptimizedImage` component for all images
  ```jsx
  import OptimizedImage from '../components/common/OptimizedImage';
  
  // Usage
  <OptimizedImage 
    src="/path/to/image.jpg" 
    alt="Description" 
    type="propertyCard" 
    position="below-fold" 
  />
  ```

- **Lazy Loading**: Images below the fold are automatically lazy loaded
  - Use `position="hero"` or `position="above-fold"` for critical images

### 2. JavaScript Optimizations

- **Code Splitting**: Routes are lazy loaded for better initial load time
  - Use the `lazyRoutes` object from `src/utils/lazyLoad.js`

- **Tree Shaking**: Unused code is removed during build
  - Ensure proper ES module imports/exports

- **Chunk Optimization**: Third-party dependencies are split into separate chunks
  - React libraries in `vendor-react` chunk
  - UI libraries in `vendor-ui` chunk

### 3. CSS Optimizations

- **CSS Purging**: Unused CSS is removed during build
  - Run `npm run build:optimized` for production builds

- **CSS Minification**: CSS is minified in production builds

### 4. Caching Strategy

- **Cache Headers**: Proper cache headers are set in `public/_headers`
  - HTML: No cache (always fresh)
  - Hashed assets: 1 year (immutable)
  - Images: 1 week
  - CSS/JS: 1 day

### 5. Render-Blocking Resources

- **Critical CSS**: Critical CSS is inlined in the HTML
- **Font Loading**: Fonts use `font-display: swap` to prevent blocking

## Implementation Details

### Image Component Usage

Replace standard `<img>` tags with the `OptimizedImage` component:

```jsx
// Before
<img src="/images/property.jpg" alt="Property" />

// After
<OptimizedImage 
  src="/images/property.jpg" 
  alt="Property" 
  type="propertyCard" 
/>
```

### Available Image Types

- `propertyCard`: 400×300
- `heroImage`: 1200×600
- `teamMember`: 300×300
- `blogThumbnail`: 600×400
- `logo`: 150×50
- `icon`: 32×32
- `testimonial`: 80×80

### Custom Dimensions

For images that don't fit the predefined types:

```jsx
<OptimizedImage 
  src="/images/custom.jpg" 
  alt="Custom" 
  customDimensions={{ width: 500, height: 300 }} 
/>
```

## Build Commands

- `npm run dev`: Development server
- `npm run build`: Standard build
- `npm run optimize:images`: Convert images to WebP
- `npm run build:optimized`: Full optimization build (images + CSS purging)
- `npm run analyze`: Analyze bundle size

## Monitoring Performance

Regularly check PageSpeed Insights to monitor performance improvements:
https://pagespeed.web.dev/