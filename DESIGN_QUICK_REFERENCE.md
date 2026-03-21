# SafeTech Design - Quick Reference Guide

## 🎨 Color Palette

```
Primary Blue:      #0066ff  (Main branding color)
Primary Dark:      #0052cc  (Hover state)
Primary Light:     #e6f0ff  (Background tint)
Cyan Accent:       #00d4ff  (Secondary highlight)
Success:           #10b981  (Positive actions)
Warning:           #f59e0b  (Alerts)
Danger:            #ef4444  (Errors)
White:             #ffffff  (Backgrounds)
Light Gray:        #f8fafc  (Subtle backgrounds)
Medium Gray:       #f1f5f9  (Section backgrounds)
Text Dark:         #0f172a  (Primary text)
Text Medium:       #64748b  (Secondary text)
Text Light:        #94a3b8  (Tertiary text)
Border:            #e2e8f0  (Divider lines)
```

## 🔤 Typography

```
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif

Sizes:
- Display: 4rem, 2.5rem
- Heading 1: 2rem (bold)
- Heading 2: 1.5rem (semi-bold)
- Heading 3: 1.2rem (semi-bold)
- Body: 1rem (regular)
- Small: 0.95rem, 0.9rem
- Caption: 0.85rem

Weights:
- Light: 300
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700
- Extra-bold: 800
```

## 📐 Spacing Units

```
space-1: 0.25rem (4px)
space-2: 0.5rem  (8px)
space-3: 0.75rem (12px)
space-4: 1rem    (16px) ← Base unit
space-5: 1.25rem (20px)
space-6: 1.5rem  (24px)
space-8: 2rem    (32px)
space-12: 3rem   (48px)
space-16: 4rem   (64px)
```

## 🎯 Button Styles

```css
.btn-primary     /* Blue gradient background, white text */
.btn-secondary   /* Light gray background, blue text */
.btn-danger      /* Light red background, red text */
.btn-sm          /* Small size: 9px text, reduced padding */
.btn-lg          /* Large size: 11px text, increased padding */
```

## 🎨 Gradients

```css
--gradient-primary:  linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)
--gradient-dark:     linear-gradient(135deg, #0052cc 0%, #003d99 100%)
--gradient-accent:   linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)
```

## 🛡️ Shadows

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

## 🎬 Animations

```css
Duration:  0.3s ease (standard)
           0.5s ease (slow)
           0.15s ease (fast)

@keyframes float        /* 3-6s infinite */
@keyframes fadeIn       /* 0.3s ease */
@keyframes slideUp      /* 0.3s ease */
```

## 📱 Responsive Breakpoints

```
Mobile:         < 768px
Tablet:         768px - 1024px
Desktop:        1024px - 1920px
Large Desktop:  > 1920px
```

## 🎯 Logo

```
Icon:  🛡️ (Shield emoji)
Text:  SafeTech
Style: Gradient text (primary gradient)
Size:  32px (desktop), 24px (mobile)
Link:  Clickable to home page
```

## 🔑 Key CSS Variables

```css
:root {
  /* Colors */
  --primary: #0066ff;
  --secondary: #00d4ff;
  --text-primary: #0f172a;
  --bg-primary: #ffffff;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## 📋 Component Classes

### Page Layout
```
.auth-page
.auth-container
.auth-branding
.auth-form-container
.page-header
.header-content
.header-action
```

### Forms
```
.modern-form
.form-group
.form-row
.form-icon
.checkbox-group
.form-options
```

### Cards & Lists
```
.card
.stat-card
.stat-icon
.stat-number
.laptop-card
.plan-card
```

### Tables & Data
```
.table-responsive
.payments-table
.alert
.alert-warning
.alert-success
.alert-error
```

## 🚀 Quick Copy-Paste Examples

### Button
```html
<button class="btn btn-primary btn-lg">Click Me</button>
```

### Form Group
```html
<div class="form-group">
  <label for="email">Email</label>
  <input type="email" id="email" />
  <div class="form-icon">✉️</div>
</div>
```

### Stat Card
```html
<div class="stat-card">
  <div class="stat-icon">💰</div>
  <h3>Total Paid</h3>
  <p class="stat-number">$1,200</p>
</div>
```

### Alert
```html
<div class="alert alert-warning">
  <h3>⚠️ Action Required</h3>
  <p>Your payment is overdue</p>
</div>
```

### Page Header
```html
<div class="page-header">
  <div class="header-content">
    <h1>💳 Payments</h1>
    <p>Manage your payments</p>
  </div>
  <div class="header-action">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

## 🎨 Customization Tips

### Change Primary Color
1. Edit `:root` in style.css
2. Change `--primary: #0066ff;` to your color
3. Update `--gradient-primary` accordingly
4. Test all pages

### Change Font
```css
body {
  font-family: 'Your Font', sans-serif;
}
```

### Adjust Spacing
```css
:root {
  --space-4: 1rem;    /* Change this */
  --space-8: 2rem;    /* Scales with space-4 */
}
```

### Add Dark Mode
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --text-primary: #ffffff;
  }
}
```

## 📱 Mobile Considerations

- **Touch targets**: 44px minimum (all buttons, inputs)
- **Font size**: 16px minimum on mobile (prevents zoom)
- **Spacing**: var(--space-4) for compact mobile layouts
- **Images**: Use responsive sizes
- **Tables**: Add horizontal scroll on mobile

## ⚡ Performance Tips

1. Use CSS variables for consistency
2. Minimize animation on mobile
3. Lazy load images
4. Minify CSS for production
5. Use WebP for images
6. Cache static assets
7. Compress CSS and JS

## 🔒 Security Notes

- Form inputs use proper type attributes
- HTTPS recommended
- No hardcoded secrets in CSS
- Validate all inputs server-side
- Use CSRF tokens for forms
- Sanitize user-generated content

## 🧪 Testing

### Manual Testing Checklist
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1366px)
- [ ] Test keyboard navigation
- [ ] Test form submission
- [ ] Test on different browsers
- [ ] Check color contrast
- [ ] Verify links work
- [ ] Check loading states
- [ ] Test responsive layout

### Browser DevTools
- F12 to open developer tools
- Ctrl+Shift+M for responsive mode
- Test different viewport sizes
- Check console for errors
- Monitor network performance

## 📞 Quick Support

**Issue**: Colors look wrong
**Solution**: Check :root variables, clear browser cache

**Issue**: Layout broken on mobile
**Solution**: Check media queries, verify viewport meta tag

**Issue**: Buttons not working
**Solution**: Check console for JS errors, verify click handlers

**Issue**: Fonts look blurry
**Solution**: Use system fonts or web fonts correctly

## 📚 Documentation

- `DESIGN_SYSTEM.md` - Full branding guide
- `UI_UPDATES.md` - Page-by-page details
- `RESPONSIVE_DESIGN.md` - Mobile/responsive patterns
- `DESIGN_VERIFICATION.md` - QA checklist

---

*Print this document for quick reference during development!*
