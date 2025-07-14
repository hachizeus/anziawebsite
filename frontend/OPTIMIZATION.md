# Frontend Optimization Guide

This document explains the optimization tools and techniques used in the frontend project to improve performance.

## CSS Optimization

### PurgeCSS

We use `@fullhuman/postcss-purgecss` to remove unused CSS from the final bundle. This significantly reduces the CSS file size by eliminating styles that aren't used in the project.

Configuration is in `postcss.config.js`. PurgeCSS scans your HTML and JavaScript files to identify which CSS classes are actually used.

### CSSnano

CSSnano is a CSS optimizer that minifies CSS by:
- Removing comments and whitespace
- Optimizing color values
- Reducing duplicate rules
- Minifying font values

## Image Optimization

### Sharp

The `sharp` library is used to optimize images:

1. **Convert to WebP**: Images are converted to the WebP format which provides better compression than JPEG and PNG while maintaining quality.

2. **Responsive Images**: The script creates multiple sizes of each image for responsive loading.

Run the image optimization script:

```bash
npm run optimize:images
```

### Vite Image Optimization

During the build process, `vite-plugin-image-optimizer` automatically optimizes images with the following settings:

- PNG/JPEG/JPG: 80% quality
- WebP: 80% quality with level 6 compression effort
- SVG: Optimized with SVGO

## Build Optimization

The Vite build configuration includes:

1. **Code Splitting**: JavaScript is split into chunks to improve loading performance:
   - `vendor-react`: React-related dependencies
   - `vendor-ui`: UI libraries (@emotion, framer-motion, @chakra-ui)
   - `vendor`: Other dependencies

2. **Asset Organization**: Assets are organized into directories:
   - `assets/images/`: Image files
   - `assets/css/`: CSS files
   - `assets/js/`: JavaScript files

3. **Terser Minification**: JavaScript is minified with Terser, removing console logs and debugger statements in production.

## Running Optimized Builds

To create an optimized production build:

```bash
npm run build:optimized
```

This command:
1. Runs the image optimization script
2. Builds the project with all optimizations enabled

## Performance Testing

After implementing these optimizations, you should see improvements in:
- Smaller bundle sizes
- Faster page load times
- Better Lighthouse scores

Use tools like Lighthouse, WebPageTest, or Chrome DevTools to measure the performance improvements.