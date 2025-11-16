# SecondHand(Whole)Cell Design Guidelines

## Design Approach

**Hybrid Strategy**: Shopify-inspired marketing pages with Material Design system for portals
- Marketing pages: Clean e-commerce aesthetics with trust-building elements
- Buyer/Admin portals: Data-dense productivity interface optimized for efficiency
- Unified professional identity balancing conversion and operational excellence

## Typography System

**Font Stack**:
- Primary: Inter (Google Fonts) - weights 400, 500, 600, 700
- Monospace: JetBrains Mono for SKUs, order numbers, technical data

**Hierarchy**:
- Hero headlines: text-5xl lg:text-6xl font-bold tracking-tight
- Section headers: text-3xl lg:text-4xl font-semibold
- Subsection headers: text-xl lg:text-2xl font-semibold
- Body text: text-base leading-relaxed
- Small text: text-sm
- Micro labels: text-xs uppercase tracking-wide font-medium
- Data tables: text-sm font-mono for numbers

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 (mobile), p-6 or p-8 (desktop)
- Section vertical spacing: py-16 lg:py-24
- Card spacing: p-6
- Form field gaps: space-y-4
- Grid gaps: gap-6 lg:gap-8

**Container Strategy**:
- Marketing pages: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Portal layouts: Full-width with sidebar navigation
- Content areas: max-w-6xl for forms, max-w-prose for text-heavy content
- Tables: Full-width within container, horizontal scroll on mobile

## Component Architecture

### Navigation
**Public Header**:
- Sticky top navigation with logo left, nav links center, "Login" + "Apply Now" (primary button) right
- Mobile: Hamburger menu with slide-out drawer
- Include trust indicator: "Trusted by 2,000+ wholesale buyers"

**Buyer Portal Sidebar**:
- Fixed left sidebar (240px desktop, collapsible mobile)
- Hierarchical navigation with icons (Heroicons)
- Active state: border-l-4 with background treatment
- User profile dropdown at bottom

**Admin Portal Sidebar**:
- Similar structure with admin-specific sections
- Role badge visible in header

### Cards & Product Display

**Product Cards** (Catalog):
- Aspect ratio 4:3 image area
- Device brand logo badge top-right
- Title, category, condition grade badge
- For logged-in buyers: Tiered pricing table preview
- Hover elevation: shadow-md to shadow-xl transition

**Feature Cards** (Marketing):
- Icon container (64px circle) with Heroicons
- Heading + 2-3 sentence description
- Minimal borders, generous padding

**Data Cards** (Portal):
- Compact with clear labels and values
- Status badges with pill styling
- Action buttons aligned right

### Forms & Inputs

**All Form Inputs**:
- Height: h-10 for text inputs, h-20 for textareas
- Border radius: rounded-lg
- Focus states: ring-2 ring-offset-2
- Label positioning: floating labels for complex forms, top labels for simple forms
- Required indicators: asterisk in label
- Inline validation errors below fields

**Multi-step Forms**:
- Progress indicator with step numbers
- "Back" and "Continue" buttons bottom-right
- Save draft functionality for quote/order forms

### Tables

**Data Tables**:
- Sticky header row
- Alternating row backgrounds for readability
- Sortable columns with arrow indicators
- Filters/search always above table
- Pagination below
- Mobile: Card-based responsive view, not horizontal scroll for complex tables

**Pricing Tier Tables**:
- Quantity ranges in bold
- Unit price emphasized
- "You save" indicators for higher quantities

### Buttons & CTAs

**Primary Button**: Solid fill, rounded-lg, px-6 py-3, font-medium
**Secondary Button**: Border variant with transparent background
**Tertiary/Ghost**: Text-only with hover underline
**Icon Buttons**: Square 40px for common actions

**Sizes**:
- Small: px-3 py-1.5 text-sm
- Default: px-4 py-2 text-base
- Large: px-6 py-3 text-lg

### Status & Badges

**Order Status**: Pill-shaped badges with icons
- pending_payment, processing, shipped, completed, cancelled

**Company Status**: Small pill badges
- pending_review, approved, rejected, suspended

**Condition Grades**: Letter grade badges (A/B/C/D) with distinct visual weights
- Grade A: Most prominent treatment
- Grade D: Subdued treatment

### Modals & Overlays

**Modals**: max-w-lg to max-w-4xl depending on content
- Close X top-right
- Title, content area, footer with actions
- Backdrop blur

**Drawers**: Slide from right for order details, product quick views
- Fixed width 480px desktop
- Full-width mobile

**Tooltips**: Small, positioned smartly with arrow pointer

### Icons

**Icon Library**: Heroicons (via CDN)
- Outline variant for navigation and secondary actions
- Solid variant for badges and emphasis
- Size: 20px (default), 16px (small), 24px (large)

## Page-Specific Guidelines

### Home Page

**Hero Section** (90vh):
- Large background image: Modern warehouse with organized device inventory, professional lighting
- Centered content with headline, subheading, dual CTAs
- Blurred button backgrounds for CTAs over image
- Scroll indicator at bottom

**Multi-column Sections**:
- How It Works: 4-column grid (responsive to 2-col, 1-col)
- Key Benefits: 3-column grid
- Featured Categories: 4-column grid with category images
- Testimonials: 3-column cards with customer company logos

### Catalog Pages

**Filter Sidebar**: 280px fixed left, collapsible mobile
- Accordion sections for each filter type
- Checkbox groups with counts
- "Clear all" link at top

**Product Grid**: 3-column on desktop, 2-col tablet, 1-col mobile
- Consistent card heights with equal image aspect ratios

**Device Detail Page**:
- 2-column layout: Large image gallery left (60%), details right (40%)
- Sticky "Add to Cart" section on scroll
- Variant selector with visual swatches
- Tiered pricing table prominent

### Buyer Portal Dashboard

**Stats Grid**: 4-column cards at top
- Icon, large number, label, trend indicator

**Recent Orders Table**: Below stats with "View All" link

**Quick Actions**: Card with button list for common tasks

### Admin Portal

**Dense Information Design**: Prioritize data visibility
- Wider tables with more columns visible
- Compact vertical spacing
- Powerful filtering and bulk actions toolbar

## Images

**Hero Image**: Professional warehouse interior with organized shelving systems, pallets of boxed devices, clean industrial aesthetic (place as full-width background with gradient overlay)

**Category Images**: Clean product photography on white backgrounds for Smartphones, Tablets, Laptops, Wearables sections

**About Page**: Team working in modern office/warehouse environment, device testing stations, quality control imagery

**Testimonial Section**: Company logos of fictional wholesale businesses

**Feature Sections**: Icon-based, no images needed

**Product Catalog**: Individual device photos, multiple angles in detail pages, lifestyle shots showing devices in refurbishment process

## Accessibility

- Keyboard navigation throughout
- ARIA labels on all interactive elements
- Focus indicators: ring-2 treatment
- Minimum touch target size: 44px
- Form error announcements
- Skip navigation links

## Responsive Breakpoints

- Mobile: base (< 640px)
- Tablet: sm (640px+), md (768px+)
- Desktop: lg (1024px+), xl (1280px+)

**Mobile-first approach**: Stack columns, collapse sidebars, simplify tables to cards