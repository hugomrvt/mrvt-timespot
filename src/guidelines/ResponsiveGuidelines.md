# TimeSpot Responsive Design Guidelines

## Breakpoints System

### Tailwind CSS Breakpoints
- **Mobile**: `< 768px` (sm breakpoint)
- **Tablet**: `768px - 1024px` (md to lg breakpoint) 
- **Desktop**: `≥ 1024px` (lg+ breakpoint)

### Custom Hook Implementation
We use a custom `useBreakpoint()` hook that provides:
- `isMobile`: boolean for mobile devices
- `isTablet`: boolean for tablet devices  
- `isDesktop`: boolean for desktop devices
- `current`: current breakpoint name
- `width`: current window width

## Mobile-First Design Principles

### Touch Targets
- **Minimum touch target**: 44px x 44px (Apple HIG standard)
- **Preferred touch target**: 48px x 48px for better accessibility
- All buttons and interactive elements meet these requirements

### Typography Scaling
- **Mobile**: Reduced font sizes for better readability
  - Main time: 80px-120px
  - Headers: 24px-32px 
  - Body text: 14px-16px
- **Tablet**: Medium scaling
  - Main time: 120px-150px
  - Headers: 32px-40px
- **Desktop**: Full scaling (original design)
  - Main time: 190px-247px
  - Headers: 40px-80px

### Layout Adaptations

#### Mobile Layout Changes
1. **Header**: Hamburger menu navigation
2. **Time Display**: Stacked layout, smaller fonts
3. **City Info**: Vertical stacking, centered alignment
4. **Time Zone Grid**: Single column layout
5. **Search Modal**: Full-screen with larger touch targets

#### Tablet Layout Changes  
1. **Header**: Simplified horizontal layout
2. **City Info**: Hybrid layout (2-row structure)
3. **Time Zone Grid**: 2-column layout
4. **Reduced padding**: Optimized for medium screens

#### Desktop Layout
- Original 3-column grid layout
- Full feature set with hover states
- Maximum information density

## Component Responsiveness

### AppHeader → ResponsiveAppHeader
- Mobile: Hamburger menu with slide-out panel
- Tablet/Desktop: Horizontal layout with search bar

### PrimaryTimeDisplay → ResponsivePrimaryTimeDisplay  
- Mobile: Stacked info layout, smaller time display
- Tablet/Desktop: Horizontal info layout

### CityInfoSection → ResponsiveCityInfoSection
- Mobile: Vertical stacking, centered button
- Tablet: 2-row layout
- Desktop: 3-column grid

### TimeZoneGrid → ResponsiveTimeZoneGrid
- Mobile: 1 column with optimized card size
- Tablet: 2 columns  
- Desktop: 4 columns

### TimeZoneCard (Enhanced)
- Mobile: Larger touch targets, simplified content
- Hidden labels on very small screens
- Responsive text sizing

### Header (Search Modal)
- Mobile: Adjusted padding, larger touch targets
- Simplified result display
- Better truncation handling

## Accessibility Improvements

### Touch Device Detection
- Custom `useTouchDevice()` hook
- Enhanced touch feedback (scale animations)
- Optimized hover states for touch devices

### Keyboard Navigation
- Maintained keyboard accessibility across all breakpoints
- Focus management in mobile navigation
- Arrow key navigation in search results

### Screen Reader Support
- Proper ARIA labels on interactive elements
- Role attributes for custom components
- Semantic HTML structure maintained

### Visual Feedback
- Clear focus indicators (2px blue outline on mobile)
- Active states for better touch feedback
- Smooth transitions and animations

## Performance Considerations

### Image Optimization
- Responsive images with appropriate sizing
- SVG icons for crisp rendering at all sizes
- Optimized loading for mobile networks

### Bundle Optimization
- Responsive components loaded conditionally
- Tree-shaking for unused responsive features
- Minimal JavaScript execution on mobile

### Animation Performance
- CSS transforms for smooth animations
- Hardware acceleration where appropriate
- Reduced animations on low-powered devices

## Testing Guidelines

### Device Testing
- Test on real devices, not just browser dev tools
- Include older devices with slower processors
- Test with different screen densities

### Interaction Testing
- Touch interactions (tap, swipe, pinch)
- Keyboard navigation
- Voice control compatibility

### Performance Testing
- Network throttling for mobile connections
- Battery usage optimization
- Memory usage on constrained devices

## Future Enhancements

### PWA Features
- App-like experience on mobile
- Offline functionality
- Push notifications for time updates

### Advanced Responsive Features
- Container queries when widely supported
- Dynamic viewport units (dvh, dvw)
- Advanced touch gestures

### Accessibility Improvements
- High contrast mode support
- Reduced motion preferences
- Voice navigation support