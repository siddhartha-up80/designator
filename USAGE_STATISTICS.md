# Usage Statistics Feature

## Overview

The Usage Statistics feature provides comprehensive analytics for users to track their activity, understand their usage patterns, and get insights to improve their productivity on the Designator platform.

## Features

### 1. Real-time Statistics Dashboard

- **Total Images Generated**: Count of all created images across all features
- **Credits Spent**: Total credits consumed with remaining balance
- **Account Age**: How long the user has been using the platform
- **Recent Activity**: Activity count in the last 30 days

### 2. Feature Usage Breakdown

- **Fashion Try-on**: Number of fashion try-on sessions
- **AI Photography**: Number of photo enhancements
- **Prompt Generation**: Number of text prompts created
- Visual progress bars showing relative usage across features

### 3. Usage Insights

- **Favorite Feature**: Most frequently used feature
- **Most Active Day**: Day of the week with highest activity
- **Average Daily Usage**: Credits consumed per day on average
- **Efficiency Score**: Images created per credit spent (as a percentage)

### 4. Monthly Usage Trends

- Visual representation of credit usage over the last 6 months
- Helps users understand their usage patterns over time

### 5. Productivity Tips

- Personalized recommendations based on usage patterns
- Tips for optimizing workflow and credit efficiency
- Suggestions for feature exploration and account upgrades

### 6. Account Overview

- Current plan status (FREE, PRO, ENTERPRISE)
- Upgrade suggestions for active users
- Credit purchase recommendations

## Technical Implementation

### Backend APIs

1. **`/api/statistics`** - Main statistics endpoint

   - Aggregates data from `CreditTransaction` and `GalleryImage` tables
   - Calculates efficiency scores and usage patterns
   - Returns comprehensive statistics object

2. **`/api/insights`** (Optional) - Advanced insights endpoint
   - Provides hourly activity patterns
   - Calculates activity streaks
   - Generates personalized recommendations

### Frontend Components

1. **`UsageStatistics`** - Main comprehensive statistics component
2. **`QuickStats`** - Compact statistics for settings page
3. **`useStatistics`** - React hook for fetching statistics data

### Database Schema Usage

The feature leverages existing database tables:

- **`User`**: Account information (plan, credits, creation date)
- **`CreditTransaction`**: All credit usage and purchases
- **`GalleryImage`**: Generated images by type
- **`Payment`**: Credit purchase history

### Key Metrics Calculated

1. **Efficiency Score**: `(Total Images Generated / Total Credits Spent) * 100`
2. **Activity Streak**: Consecutive days with platform usage
3. **Feature Preference**: Most used feature based on transaction types
4. **Peak Usage Time**: Hour of day with highest activity

## Pages and Navigation

### Settings Page (`/settings`)

- Shows compact "Quick Stats" in the sidebar
- Includes "View Detailed Analytics" link to full statistics page

### Statistics Page (`/statistics`)

- Dedicated page for comprehensive analytics
- Accessible via sidebar navigation
- Full-featured dashboard with all metrics and insights

### Sidebar Integration

- Added "Statistics" menu item with BarChart3 icon
- Positioned between "Fashion Try On" and "Credits"

## User Experience Features

### Loading States

- Skeleton loading animations for all statistic cards
- Progressive loading of different data sections
- Graceful error handling with retry options

### Responsive Design

- Mobile-optimized layouts with stacked cards
- Responsive grid systems for different screen sizes
- Touch-friendly interaction elements

### Visual Feedback

- Color-coded efficiency scores (green: >80%, orange: >60%, red: <60%)
- Progress bars for feature usage comparison
- Gradient cards for visual hierarchy

### Personalization

- Dynamic recommendations based on usage patterns
- Contextual tips for improving efficiency
- Plan-specific messaging and upgrade prompts

## Popular SaaS Features Included

1. **Usage Analytics Dashboard** - Like Notion, Slack analytics
2. **Efficiency Metrics** - Similar to GitHub insights
3. **Activity Streaks** - Like Duolingo, GitHub contributions
4. **Feature Usage Breakdown** - Like Google Analytics segments
5. **Productivity Tips** - Similar to Grammarly insights
6. **Monthly Trends** - Like Spotify Wrapped, GitHub year in review
7. **Personalized Recommendations** - Like Netflix, Amazon suggestions
8. **Plan Upgrade Prompts** - Standard freemium SaaS pattern

## Future Enhancements

1. **Export Analytics**: PDF/CSV export of statistics
2. **Team Analytics**: For enterprise users with team metrics
3. **Goal Setting**: Allow users to set monthly usage goals
4. **Comparison Views**: Compare with previous periods
5. **Advanced Filtering**: Filter statistics by date ranges
6. **Achievement System**: Unlock badges for milestones
7. **API Access**: Allow users to access their statistics via API

## Benefits for Users

1. **Transparency**: Clear visibility into platform usage
2. **Optimization**: Insights to improve workflow efficiency
3. **Motivation**: Progress tracking and achievement recognition
4. **Planning**: Understanding usage patterns for better planning
5. **Value Recognition**: See the value received from credits spent
