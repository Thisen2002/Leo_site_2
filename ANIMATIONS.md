# Scroll Animations Implementation

This document describes the scroll-based animation system implemented across all pages of the Leo Society website.

## Features

- **Intersection Observer API**: Uses modern browser APIs for efficient scroll detection
- **Reusable Components**: Centralized animation utilities that can be used across all pages
- **Performance Optimized**: Animations trigger only when elements enter viewport
- **Accessibility Compliant**: Respects `prefers-reduced-motion` for users who prefer minimal animations
- **Customizable**: Easy to adjust timing, delays, and animation types

## Files Structure

### Animation Utilities
- `src/utils/scrollAnimations.js` - Main animation hooks and utilities
- `src/utils/scrollAnimations.css` - CSS animation classes and transitions

### Implementation
All page components have been updated with scroll animations:
- `Homepage.jsx` - Hero, sections, activity cards, stats counters
- `About.jsx` - Hero, story section, values cards, statistics
- `Team.jsx` - Member cards with staggered animations
- `Projects.jsx` - Project cards, filter buttons
- `Gallery.jsx` - Gallery items, category filters
- `Events.jsx` - Event cards, tabs
- `Contact.jsx` - Form sections, contact info cards

## Animation Types

### Available Animations
- `fadeIn` - Simple fade in
- `fadeInUp` - Fade in with upward slide
- `slideInLeft` - Slide in from left
- `slideInRight` - Slide in from right
- `slideInUp` - Slide in from bottom
- `scaleIn` - Scale up animation
- `bounceIn` - Bouncy entrance
- `elasticIn` - Elastic entrance

### Custom Hooks

#### `useScrollAnimation(options)`
Basic scroll animation hook for single elements.
```jsx
const [ref, isVisible] = useScrollAnimation({
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  triggerOnce: true,
  delay: 0
});
```

#### `useStaggerAnimation(itemCount, staggerDelay)`
For animating multiple items with stagger effect.
```jsx
const [containerRef, visibleItems] = useStaggerAnimation(4, 150);
```

#### `useCounterAnimation(endValue, duration)`
For animated number counters.
```jsx
const [ref, count] = useCounterAnimation(150, 2000);
```

## Usage Examples

### Basic Element Animation
```jsx
import { useScrollAnimation, getAnimationClass } from '../utils/scrollAnimations';

const [ref, isVisible] = useScrollAnimation();

return (
  <div ref={ref} className={getAnimationClass('fadeInUp', isVisible)}>
    Content here
  </div>
);
```

### Staggered Cards Animation
```jsx
const [containerRef, visibleItems] = useStaggerAnimation(cards.length, 100);

return (
  <div ref={containerRef}>
    {cards.map((card, index) => (
      <div 
        key={card.id}
        className={`card ${visibleItems.has(index) ? 'animate-visible' : 'animate-hidden'}`}
      >
        {card.content}
      </div>
    ))}
  </div>
);
```

### Counter Animation
```jsx
const [ref, count] = useCounterAnimation(1500, 2000);

return (
  <div ref={ref}>
    <span>{count}+</span>
  </div>
);
```

## Performance Considerations

- Animations use CSS transforms and opacity for GPU acceleration
- Intersection Observer API minimizes performance impact
- Elements are only animated once by default (`triggerOnce: true`)
- Animations respect system preferences for reduced motion

## Browser Support

- Modern browsers supporting Intersection Observer API
- Fallback: Elements appear without animation in older browsers
- Accessibility: Respects `prefers-reduced-motion` media query

## Customization

### Animation Timing
Modify delays using CSS classes:
```jsx
className={`${getAnimationClass('fadeInUp', isVisible)} animate-delay-200`}
```

### Custom Animations
Add new animation classes to `scrollAnimations.css`:
```css
.animate-custom {
  transform: translateX(-100px) rotate(-10deg);
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-custom.animate-visible {
  transform: translateX(0) rotate(0deg);
}
```

## Testing

1. Run the development server: `npm run dev`
2. Navigate through different pages
3. Scroll to observe animations triggering
4. Check animations work smoothly across different viewport sizes
5. Test with reduced motion preferences enabled

The animation system enhances user experience while maintaining performance and accessibility standards.