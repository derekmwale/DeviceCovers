# 🎨 SafeTech Premium Design - Quick Visual Reference

## Color Palette at a Glance

### Primary Colors
```
████ Deep Navy (#001a4d) - Main brand color, trust & luxury
████ Navy Dark (#000d2e) - Darker states
████ Navy Light (#e6ebf5) - Light backgrounds
```

### Accent Colors
```
████ Electric Blue (#0099ff) - CTAs, energy, modern
████ Blue Dark (#0077cc) - Hover states
████ Blue Light (#cce5ff) - Backgrounds
```

### Premium Gold
```
████ Gold (#d4af37) - Premium touch, pricing highlights
████ Gold Dark (#b89f2f) - Hover states
████ Gold Light (#f0e6d2) - Light backgrounds
```

### Status Colors
```
████ Success Green (#10b981) - Positive actions
████ Warning Amber (#f59e0b) - Alerts
████ Danger Red (#dc2626) - Errors
```

---

## Typography System

### Font Families
- **Body Text**: Segoe UI, -apple-system, BlinkMacSystemFont
- **Display**: Georgia (for premium elements)

### Font Sizes
```
XS      0.75rem   (Microtext, labels)
SM      0.875rem  (Captions, small text)
Base    1rem      (Body paragraphs)
LG      1.125rem  (Descriptions)
XL      1.25rem   (Subheadings)
2XL     1.5rem    (Section titles)
3XL     1.875rem  (Feature titles)
4XL     2.25rem   (Page headers)
5XL     3rem      (Hero titles)
```

### Font Weights
```
Light       300
Normal      400
Medium      500
Semibold    600
Bold        700
Extrabold   800
```

---

## Component Styles

### Buttons

#### Primary Button
```
Background:  Linear gradient (Navy → Electric Blue)
Color:       White
Padding:     0.75rem 1.5rem (normal) | 1rem 2rem (large)
Border:      None
Border-radius: 1rem
Shadow:      0 10px 15px rgba(0,0,0,0.1)
Hover:       Lift (-2px), Enhanced shadow + glow
```

#### Secondary Button
```
Background:  Light background (#f3f4f6)
Color:       Primary (#001a4d)
Border:      2px solid #001a4d
Hover:       Background changes to light blue
```

#### Outline Button
```
Background:  Transparent
Color:       Primary (#001a4d)
Border:      2px solid #001a4d
Hover:       Background becomes primary, color white
```

#### Accent Button
```
Background:  Gold gradient
Color:       Navy (#001a4d)
Font:        Bold
Hover:       Lift effect, enhanced shadow
```

---

## Spacing System

```
Space-1:   0.25rem  (Tiny)
Space-2:   0.5rem   (Extra small)
Space-3:   0.75rem  (Small)
Space-4:   1rem     (Base)
Space-5:   1.25rem  (Medium)
Space-6:   1.5rem   (Comfortable)
Space-8:   2rem     (Large)
Space-10:  2.5rem   (Larger)
Space-12:  3rem     (Extra large)
Space-16:  4rem     (Huge)
Space-20:  5rem     (Massive)
Space-24:  6rem     (Enormous)
```

---

## Shadow System

```
Shadow-sm:  0 1px 2px rgba(15,23,42,0.05)
Shadow-md:  0 4px 12px rgba(15,23,42,0.1)
Shadow-lg:  0 10px 25px rgba(15,23,42,0.12)
Shadow-xl:  0 20px 40px rgba(15,23,42,0.15)
Shadow-2xl: 0 30px 60px rgba(15,23,42,0.2)
Shadow-glow: 0 0 30px rgba(0,153,255,0.2)
```

---

## Border Radius

```
None:   0
SM:     0.375rem
Normal: 0.5rem
MD:     0.75rem
LG:     1rem
XL:     1.5rem
2XL:    2rem
Full:   9999px
```

---

## Animations & Transitions

### Durations
```
Fast:    150ms (Quick interactions)
Base:    250ms (Standard transitions)
Slow:    350ms (Smooth animations)
```

### Animation Types
```
Float:    Continuous 20s gentle movement
Pulse:    3s breathing effect
Slide:    Smooth in/out transitions
Fade:     Opacity changes
Lift:     translateY(-2px to -8px)
Scale:    1 → 1.05 scale
```

---

## Responsive Breakpoints

```
Small Mobile    < 480px   (Mobile phones)
Mobile          480-768px (Phones & small tablets)
Tablet          768-1024px (Tablets & small laptops)
Desktop         1024-1920px (Desktops)
Large Desktop   1920px+   (Wide monitors)
```

### Layout Changes
```
< 480px:   Single column, stacked
480-768px: Single column, optimized
768-1024px: Two columns where applicable
1024px+:   Full multi-column layouts
```

---

## Dark Mode Support

When `prefers-color-scheme: dark`:
```css
--bg-primary:     #1a1a2e
--bg-secondary:   #16213e
--bg-tertiary:    #0f3460
--text-primary:   #eaeaea
--text-secondary: #b0b0b0
--border:         #2a3f5f
```

---

## Feature Cards Style

```
Background:      White (#fff)
Padding:         2rem
Border-radius:   1rem
Border:          1px solid #e5e7eb
Left Border:     4px solid (Gold gradient)
Box-shadow:      0 4px 12px rgba(15,23,42,0.1)
Hover Effect:    
  - Lift: -8px
  - Enhanced shadow
  - Border color → Gold
  - Smooth transition
```

---

## Plan Cards Style

```
Background:      White
Padding:         2rem
Border:          2px solid #e5e7eb
Border-radius:   1rem

Featured Plan:
  - Border color: Gold
  - Glow shadow: 0 0 30px rgba(212,175,55,0.2)
  - Scale: 1.05 (desktop only)

Hover:
  - Border → Gold
  - Shadow enhanced
```

---

## Dashboard Cards

```
Background:      White
Padding:         2rem
Border:          1px solid #e5e7eb
Border-radius:   1rem
Box-shadow:      0 4px 12px rgba(15,23,42,0.1)

Header:
  - Title font-size: 1.125rem, bold
  - Badge: Small label with colored background

Hover:
  - Lift: -4px
  - Shadow enhanced
  - Smooth transition
```

---

## Forms

### Input Fields
```
Background:      White
Padding:         0.75rem 1rem
Border:          2px solid #e5e7eb
Border-radius:   0.75rem
Font:            Inherit
Transition:      250ms ease-in-out

Focus State:
  - Border color: Electric Blue (#0099ff)
  - Box-shadow: 0 0 0 3px #cce5ff
  - Background: White
```

### Labels
```
Font-weight:  Semibold (600)
Color:        Text primary (#0f172a)
Margin-bottom: 0.5rem
Font-size:    0.875rem
```

---

## Tables

```
Header:
  - Background: Navy → Electric Blue gradient
  - Color: White
  - Font-weight: Bold
  - Padding: 1rem

Rows:
  - Padding: 1rem
  - Border-bottom: 1px solid #e5e7eb
  
Hover:
  - Background: Light gray (#f3f4f6)
```

---

## Alerts

### Success Alert
```
Background: #d1fae5 (Light green)
Border:     1px solid #10b981
Border-left: 4px solid #10b981
Color:      #059669 (Dark green)
```

### Danger Alert
```
Background: #fee2e2 (Light red)
Border:     1px solid #dc2626
Border-left: 4px solid #dc2626
Color:      #b91c1c (Dark red)
```

### Warning Alert
```
Background: #fef3c7 (Light amber)
Border:     1px solid #f59e0b
Border-left: 4px solid #f59e0b
Color:      #d97706 (Dark amber)
```

### Info Alert
```
Background: #cce5ff (Light blue)
Border:     1px solid #0099ff
Border-left: 4px solid #0099ff
Color:      #0077cc (Dark blue)
```

---

## Hero Section

```
Background:  Navy → Electric Blue gradient
Height:      Full viewport or 600px+
Overlay:     Animated radial gradient shapes
Content:
  - Grid: 1fr 1fr (desktop) | 1fr (mobile)
  - Gap: 4rem
  - Align: center
  
Typography:
  - H1: 3rem (desktop), 2rem (mobile)
  - P: 1.125rem
  - Links: Smooth transitions

Icon/Image:
  - Font-size: 15rem (desktop), 5-8rem (mobile)
  - Animation: Pulse effect (3s)
  - Drop-shadow: Blue glow
```

---

## Navigation Bar

```
Background:      White with 95% opacity
Border-bottom:   2px solid #e5e7eb
Padding:         1rem 0
Position:        Sticky top
Backdrop-filter: blur(20px)
Box-shadow:      0 4px 12px rgba(15,23,42,0.1)

Logo:
  - Font-size: 1.75rem
  - Font-weight: Extrabold
  - Gradient text: Navy → Electric Blue
  - Letter-spacing: -0.5px
  - Hover: scale(1.05)

Nav Links:
  - Font-weight: Medium
  - Color: Text primary
  - Underline animation: width 0→100% on hover
```

---

## Footer

```
Background:      Dark navy (#0f172a)
Color:           White
Padding:         4rem 1.5rem

Sections:
  - Grid: auto-fit, minmax(250px, 1fr)
  - Gap: 2rem

Section Title:
  - Font-size: 1.125rem
  - Font-weight: Bold
  - Gradient text: Gold

Links:
  - Color: rgba(255,255,255,0.7)
  - Hover: Gold color
  - Transition: 250ms

Bottom:
  - Border-top: 1px solid rgba(255,255,255,0.1)
  - Padding-top: 2rem
  - Text-align: center
  - Font-size: 0.875rem
  - Color: rgba(255,255,255,0.7)
```

---

## Mobile Optimizations

### Touch Targets
```
Minimum size: 44px × 44px
Padding around: 8px minimum
Spacing between: 8px minimum
```

### Typography Scaling
```
Tablets (768px):     90-100% of desktop
Mobile (480px):      80-85% of desktop
Small mobile (320px): 70-80% of desktop
```

### Layout Stacking
```
Desktop (1000px+):   Multi-column
Tablet (600px+):     2-column
Mobile (<600px):     1-column stacked
```

---

## Accessibility Features

- ✅ High contrast ratios (WCAG AA)
- ✅ Focus states visible (2px border/outline)
- ✅ Reduced motion support
- ✅ Dark mode support
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation

---

## Performance Tips

1. **Lazy load** images
2. **Use gradients** instead of images where possible
3. **CSS transforms** for animations (GPU accelerated)
4. **Minimize shadows** on low-end devices
5. **Debounce** scroll/resize handlers
6. **Preload** critical fonts

---

## Production Checklist

- [ ] All pages use `premium.css`
- [ ] Mobile responsiveness tested
- [ ] Dark mode verified
- [ ] Animations at 60fps
- [ ] No console errors
- [ ] Accessibility tested
- [ ] Performance benchmarked
- [ ] Cross-browser tested

---

**SafeTech Premium Design Quick Reference v1.0**
