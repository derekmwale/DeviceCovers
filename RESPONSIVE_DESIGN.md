# SafeTech Responsive Design Guide

## 📱 Breakpoints

### Mobile-First Approach
SafeTech uses a mobile-first responsive design strategy for optimal performance and UX.

```css
/* Mobile (default) - 320px to 767px */
/* Tablet - 768px to 1023px */
/* Desktop - 1024px to 1199px */
/* Large Desktop - 1200px+ */
```

---

## 📐 Device Sizes

### Mobile Phones
```
Small Mobile: 320px - 480px (iPhone SE, older devices)
Standard Mobile: 480px - 768px (iPhone 12, Android phones)
```

**Layout Changes:**
- Single column layouts
- Full-width forms
- Stacked buttons
- Hidden branding sections (auth pages)
- Collapsed navigation
- Bottom navigation bars
- Simplified tables (horizontal scroll)

### Tablets
```
iPad Mini: 768px
iPad Standard: 1024px
```

**Layout Changes:**
- Two-column where appropriate
- Flexible grids (1-2 columns)
- Sidebar may collapse to tabs
- Show branding on auth pages
- Optimized touch targets (44px minimum)

### Desktop
```
Laptops: 1200px - 1920px
Large Displays: 1920px+
```

**Layout Changes:**
- Full feature set enabled
- 2+ column layouts
- Expanded sidebars
- All content visible
- Hover states active

---

## 🎯 Key Responsive Elements

### Navigation Bar
```
Mobile (< 768px):
- Hamburger menu or stacked layout
- Logo takes full width
- Single line nav items

Desktop (>= 768px):
- Full horizontal navigation
- Logo on left
- Menu items spaced across
```

### Auth Pages (Login/Register)
```
Mobile (< 1024px):
- Single column layout
- Branding section HIDDEN
- Form takes full width
- Buttons stack vertically

Desktop (>= 1024px):
- Split-screen layout (50/50)
- Branding section VISIBLE on left
- Form on right
- Side-by-side buttons
```

### Dashboard
```
Mobile (< 768px):
- Single column
- Sidebar becomes horizontal tabs or collapse
- Content full-width

Tablet (768px - 1023px):
- Flexible 1-2 column grid
- Sidebar visible but narrower
- Content adapts

Desktop (>= 1024px):
- Sidebar fixed left (250px)
- Content right (flexible)
- Full feature set
```

### Stat Cards Grid
```
Mobile: 1 column
Tablet: 2 columns (grid-template-columns: repeat(2, 1fr))
Desktop: 3-4 columns (grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)))
```

### Tables
```
Mobile (< 768px):
- Horizontal scroll (table-responsive)
- Reduced column count
- Card view alternative

Desktop (>= 768px):
- Full table view
- All columns visible
```

### Forms
```
Mobile:
- Single column
- Full-width inputs
- Stacked labels above inputs
- Buttons stack vertically

Desktop:
- Multi-column (2-3 columns)
- Side-by-side form groups
- Inline labels option
- Horizontal button layouts
```

---

## 🛠️ CSS Media Query Reference

### Tablet Breakpoint
```css
@media (max-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr;  /* Stack columns */
  }
  
  .auth-branding {
    padding: var(--space-8);  /* Reduce padding */
  }
}
```

### Mobile Breakpoint
```css
@media (max-width: 768px) {
  .auth-container {
    border-radius: 16px;  /* Smaller radius */
  }
  
  .auth-branding {
    display: none;  /* Hide branding section */
  }
  
  .page-header {
    flex-direction: column;  /* Stack header */
  }
  
  .stats-grid {
    grid-template-columns: 1fr;  /* Single column */
  }
}
```

### Small Mobile Breakpoint
```css
@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.8rem;  /* Reduce heading */
  }
  
  .cta-buttons {
    flex-direction: column;  /* Stack buttons */
  }
  
  .btn {
    width: 100%;  /* Full width buttons */
  }
}
```

---

## 📊 Container Max-Widths

```css
.navbar-container: max-width: 1400px
.container: max-width: 1200px
.page-content: Full width, background color
.auth-container: max-width: 1200px
.payments-page-container: max-width: 1200px
.laptops-container: max-width: 1200px
```

---

## 🔤 Font Scaling

### Responsive Font Sizes
```css
/* Using clamp() for fluid typography */
h1 {
  font-size: clamp(1.5rem, 5vw, 4rem);  /* Between 1.5rem and 4rem */
}

h2 {
  font-size: clamp(1.2rem, 4vw, 2.5rem);
}

/* Or using media queries */
@media (max-width: 768px) {
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  body { font-size: 0.95rem; }
}
```

---

## 🎨 Responsive Images

### Hero Image
```
Mobile: height: 200px
Tablet: height: 300px
Desktop: height: 500px
```

### Logo
```
Mobile: 24px × 24px
Desktop: 32px × 32px
```

---

## ✅ Touch Target Sizes

**Minimum recommended sizes for touch devices:**
```
Buttons: 44px × 44px (Apple iOS recommendation)
Links: 44px × 44px minimum
Form inputs: 40px - 50px height
Checkboxes: 18px × 18px (minimum, consider 24px for better touch)
```

**SafeTech Implementation:**
```css
.btn {
  padding: 0.75rem 1.5rem;  /* ~48px height */
  min-height: 44px;
}

button[type="checkbox"] {
  width: 18px;
  height: 18px;
  /* Wrapped in larger clickable area */
}
```

---

## 🖼️ Viewport Meta Tag

All SafeTech pages include:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

This ensures:
- Proper scaling on mobile devices
- Initial zoom level of 100%
- Full viewport width usage
- No horizontal scroll on mobile

---

## 📋 Testing Responsive Design

### Tools
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Firefox Responsive Design Mode
- BrowserStack for real device testing
- Safari DevTools on Mac

### Test Cases
1. ✅ Mobile portrait (375px × 667px - iPhone 8)
2. ✅ Mobile landscape (667px × 375px)
3. ✅ Tablet portrait (768px × 1024px - iPad)
4. ✅ Tablet landscape (1024px × 768px)
5. ✅ Desktop (1920px × 1080px)
6. ✅ Large Desktop (2560px × 1440px)

### Common Issues to Check
- [ ] Text doesn't overflow containers
- [ ] Buttons are clickable (44px+ touch targets)
- [ ] Images scale properly
- [ ] Navigation is accessible
- [ ] Forms are usable on mobile
- [ ] No horizontal scroll on mobile
- [ ] Touch elements have proper spacing

---

## 🚀 Best Practices

### Mobile-First Development
```css
/* Start with mobile styles */
.card {
  grid-template-columns: 1fr;  /* Mobile: 1 column */
}

/* Then add desktop styles */
@media (min-width: 1024px) {
  .card {
    grid-template-columns: repeat(3, 1fr);  /* Desktop: 3 columns */
  }
}
```

### Flexible Units
```css
/* Use rem instead of px for better scalability */
padding: 1.5rem;    /* Good - scales with font size */
padding: 24px;      /* Okay - fixed size */

/* Use percentages for widths */
width: 100%;        /* Full width */
width: 90%;         /* With margin */

/* Use clamp() for fluid sizing */
font-size: clamp(1rem, 2.5vw, 2rem);
```

### Flexible Grids
```css
/* Auto-fit columns to screen size */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

/* This creates 1 column on mobile, 2-3 on tablet, 3-4 on desktop */
```

---

## 📞 Support

For responsive design issues or improvements, refer to your browser's DevTools and test across multiple screen sizes. Always test real devices when possible!
