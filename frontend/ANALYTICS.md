# Google Analytics Integration

This document explains how Google Analytics is integrated into the Makini Realtors website.

## Configuration

Google Analytics is configured using the Google Analytics 4 (GA4) property with Measurement ID: `G-CTKG6N5Q2J`.

## Environment Variables

The Google Analytics Measurement ID is stored in the `.env` file:

```
VITE_GA_MEASUREMENT_ID=G-CTKG6N5Q2J
```

## Implementation

The Google Analytics integration is implemented in the following files:

1. `src/components/GoogleAnalytics.jsx` - Main component that loads the Google Analytics script
2. `src/App.jsx` - Integration of the GoogleAnalytics component
3. `src/utils/analytics.js` - Utility functions for tracking events

## Tracking Events

To track custom events throughout the application, use the utility functions in `src/utils/analytics.js`:

```javascript
import { trackEvent } from '../utils/analytics';

// Track a simple event
trackEvent('button_click', { 'button_name': 'submit' });

// Track property engagement
import { trackPropertyEngagement } from '../utils/analytics';
trackPropertyEngagement('property123', 'Luxury Villa', 'view');
```

## Tracked Events

The following events are currently being tracked:

1. Page views (automatic)
2. "Become Agent" button clicks

## Adding New Events

To add new event tracking:

1. Import the tracking functions from `src/utils/analytics.js`
2. Call the appropriate function when the event occurs
3. Provide meaningful event names and parameters

## Viewing Analytics Data

To view the analytics data:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with the account associated with Makini Realtors
3. Navigate to the "Reports" section

## Troubleshooting

If events are not being tracked:

1. Check that the Google Analytics script is loading properly
2. Verify that the correct Measurement ID is being used
3. Check for any console errors related to Google Analytics
4. Ensure that ad blockers are not preventing the Google Analytics script from loading