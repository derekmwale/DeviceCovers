# SafeTech Design System & Branding Guide

## 🎨 Brand Identity

### Logo & Icon
- **Logo**: SafeTech with Shield Icon (🛡️)
- **Style**: Modern, minimalist with gradient overlay
- **Icon**: Shield emoji representing protection and security
- **Typography**: Sans-serif with gradient gradient text effect for prominence

### Brand Colors

#### Primary Palette
- **Primary Blue**: `#0066ff` - Main brand color representing trust and technology
- **Primary Dark**: `#0052cc` - Darker shade for hover states
- **Primary Light**: `#e6f0ff` - Light background tint
- **Secondary Cyan**: `#00d4ff` - Accent color for highlights

#### Status Colors
- **Success Green**: `#10b981` - Used for approvals and positive states
- **Warning Yellow**: `#f59e0b` - Alerts and warnings
- **Danger Red**: `#ef4444` - Errors and destructive actions
- **Accent Orange**: `#ff6b6b` - Secondary highlights

#### Neutral Palette
- **Background Primary**: `#ffffff` - Main background
- **Background Secondary**: `#f8fafc` - Subtle backgrounds
- **Background Tertiary**: `#f1f5f9` - Grayed sections
- **Text Primary**: `#0f172a` - Main text color
- **Text Secondary**: `#64748b` - Secondary text
- **Text Tertiary**: `#94a3b8` - Subtle text
- **Border**: `#e2e8f0` - Divider lines

### Gradients

#### Primary Gradient
```css
linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)
```
Used for: Headlines, CTAs, primary buttons, badges

#### Accent Gradient
```css
linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)
```
Used for: Alerts, premium features, special sections

#### Dark Gradient
```css
linear-gradient(135deg, #0052cc 0%, #003d99 100%)
```
Used for: Dark backgrounds, hover states

---

## 🔤 Typography

### Font Family
- **Primary**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Fallback**: Arial, sans-serif
- **Philosophy**: Clean, readable, modern

### Font Sizes
- **Display 1**: 4rem (clamp between 2.5rem - 4rem)
- **Display 2**: 2.5rem
- **Heading 1**: 2rem
- **Heading 2**: 1.5rem
- **Heading 3**: 1.2rem
- **Heading 4**: 1.1rem
- **Body**: 1rem
- **Body Small**: 0.95rem
- **Label**: 0.9rem
- **Caption**: 0.85rem

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700
- **Extra bold**: 800 (for CTAs and headlines)

---

## 🎯 Component Styles

### Buttons

#### Primary Button
```css
Background: var(--gradient-primary)
Color: White
Padding: 0.75rem 1.5rem
Border Radius: 8px
Box Shadow: var(--shadow-md)
Transition: all 0.3s ease
Hover: translateY(-2px), shadow-lg
```

#### Secondary Button
```css
Background: var(--bg-tertiary)
Color: var(--text-primary)
Border: 1px solid var(--border)
Padding: 0.75rem 1.5rem
Border Radius: 8px
Hover: background change, border-color change
```

#### Danger Button
```css
Background: #fee2e2
Color: #ef4444
Border: 1px solid #fecaca
Hover: intensify colors
```

#### Button Sizes
- **Small**: 0.5rem 1rem (0.9rem text)
- **Medium**: 0.75rem 1.5rem (1rem text)
- **Large**: 1.25rem 2rem (1.1rem text)

### Cards

#### Standard Card
```css
Background: var(--bg-primary)
Border: 1px solid var(--border)
Border Radius: 12px
Padding: 1.5rem - 2rem
Transition: all 0.3s ease
Hover: border-color → primary, shadow-lg, translateY(-4px)
```

#### Stat Card
- Text-aligned center
- Large number with gradient text
- Light border styling
- Hover effect with elevation

### Forms

#### Input Fields
```css
Padding: 0.75rem 1rem
Border: 1px solid var(--border)
Border Radius: 8px
Transition: all 0.3s
Focus: border-color → primary, box-shadow with primary tint
```

#### Form Groups
- Gap: 0.5rem between label and input
- Label: 600 weight, 0.95rem size
- Hint text: 0.85rem, secondary color

---

## 📐 Spacing System

Use consistent spacing with these values:
- **space-1**: 0.25rem
- **space-2**: 0.5rem
- **space-3**: 0.75rem
- **space-4**: 1rem
- **space-5**: 1.25rem
- **space-6**: 1.5rem
- **space-8**: 2rem
- **space-12**: 3rem
- **space-16**: 4rem

### Layout Spacing
- **Page padding**: space-8 (2rem)
- **Section margins**: space-16 (4rem)
- **Component gap**: space-6 (1.5rem)
- **Tight spacing**: space-3 (0.75rem)

---

## 🎬 Animations & Transitions

### Timing
- Default: `0.3s ease`
- Slow: `0.5s ease`
- Fast: `0.15s ease`

### Common Animations

#### Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
}
```
Duration: 3-6s, infinite

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Duration: 0.3s

#### Slide Up
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Duration: 0.3s for modals

#### Transforms
- Hover: `translateY(-2px)` for elevation
- Cards: `translateY(-4px to -8px)` on hover
- Buttons: `translateY(-2px)` on hover with shadow increase

---

## 🖼️ Hero Section

### Design Elements
- **Background**: Subtle gradient with animated floating shapes
- **Layout**: Two-column (content + image)
- **Content Width**: Max 1200px
- **Heading**: Large, gradient text with highlight
- **CTA Buttons**: Stacked on mobile, side-by-side on desktop
- **Image Area**: Gradient background with large emoji/icon

### Floating Shapes
```css
Top-right circle: 600px, opacity 0.05
Bottom-left circle: 500px, opacity 0.05
Animation: 6s-8s float infinite
```

---

## 📊 Grid Systems

### Plan Cards
```css
Grid Template: repeat(auto-fit, minmax(280px, 1fr))
Gap: 1.5rem - 2rem
Max Width: 1200px
```

### Laptop Cards
```css
Grid Template: repeat(auto-fill, minmax(300px, 1fr))
Gap: 1.5rem - 2rem
Max Width: 1200px
```

### Stats Grid
```css
Grid Template: repeat(auto-fit, minmax(250px, 1fr))
Gap: 1.5rem
Max Width: 1200px
```

---

## 📱 Responsive Breakpoints

### Large Desktop
```css
max-width: 1400px
grid-template-columns: normal
```

### Tablet (768px and down)
- Single column layouts
- Reduced padding: space-6 instead of space-8
- Smaller font sizes for headings
- Flexible grid to single column

### Mobile (480px and down)
- Full-width layouts
- Minimal padding: space-4
- Stack buttons vertically
- Single column everything
- Reduced hero image height

---

## 🛡️ Badges & Status Indicators

### Condition Badges
- **Excellent**: Green background, darker text
- **Good**: Blue background, darker text
- **Fair**: Yellow background, darker text

### Plan Badges
- **Most Popular**: Gradient background, white text, positioned top-center
- **Active**: Green with checkmark
- **Inactive**: Gray

---

## 💡 Design Principles

1. **Minimalism**: Clean layouts with plenty of whitespace
2. **Accessibility**: High contrast, readable fonts, clear interactive states
3. **Consistency**: Reuse components across all pages
4. **Feedback**: Visual feedback for all interactions
5. **Hierarchy**: Clear visual hierarchy with size, color, and weight
6. **Performance**: Smooth animations that enhance but don't distract
7. **Trust**: Professional, secure appearance reflecting insurance industry

---

## 🔧 Implementation Notes

### CSS Variables
All styles use CSS custom properties for easy theming:
```css
:root {
  --primary: #0066ff;
  --gradient-primary: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  /* ... more variables ... */
}
```

### Shadow System
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Viewport Meta Tag
Always include:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 📝 Usage Examples

### Creating a Feature Card
```html
<div class="card">
  <h3>Feature Title</h3>
  <p>Description text</p>
</div>
```

### Creating a Plan Card
```html
<div class="plan-card featured">
  <h3>Plan Name</h3>
  <div class="plan-price">$10<span class="plan-price-period">/month</span></div>
  <ul class="plan-features">
    <li class="plan-feature">Feature 1</li>
    <li class="plan-feature">Feature 2</li>
  </ul>
  <button class="btn btn-primary">Select Plan</button>
</div>
```

### Creating a Form
```html
<div class="form-group">
  <label for="field">Label</label>
  <input type="text" id="field" name="field" />
  <p class="form-hint">Helper text</p>
</div>
```

---

## 🎊 Brand Promise

**SafeTech** represents:
- 🛡️ **Protection** - Secure, reliable insurance
- ⚡ **Innovation** - Modern technology and approach
- 💙 **Trust** - Transparent, honest service
- 🌍 **Accessibility** - Affordable for emerging markets
- 🚀 **Efficiency** - Quick claims, simple processes
