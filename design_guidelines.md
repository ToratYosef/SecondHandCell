# Design Guidelines: SecondHand(Whole)Cell

## Design Approach
**Reference-Based with Glassmorphism Focus**: Drawing inspiration from Apple's premium product presentation, combined with modern glassmorphism UI patterns. The design emphasizes trust and quality for refurbished phones through sophisticated, transparent layering and premium aesthetics.

## Core Design Principles
1. **Premium Refurbished**: Elevate refurbished phones through high-quality imagery and glass UI elements
2. **Transparency & Trust**: Glassmorphism conveys honesty and clarity in product conditions
3. **Efficiency**: Clear information hierarchy for quick product comparison and purchasing

## Typography
- **Headings**: Inter or SF Pro Display, weights 700-800 for hero/product titles, 600 for section headers
- **Body**: Inter or SF Pro Text, weight 400 for descriptions, 500 for labels/buttons
- **Pricing**: Tabular figures, weight 600-700, larger sizing to emphasize value
- **Hierarchy**: H1 (48-64px), H2 (36-48px), H3 (24-32px), Body (16-18px), Small (14px)

## Layout System
**Spacing**: Consistent 8px grid - use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32
- Page padding: px-4 md:px-8 lg:px-12
- Section spacing: py-12 md:py-16 lg:py-24
- Card padding: p-6 md:p-8
- Component gaps: gap-4, gap-6, gap-8

## Glassmorphism Implementation
**Glass Card Specifications**:
- Background: `bg-white/10` to `bg-white/20` (dark mode: `bg-black/20`)
- Backdrop blur: `backdrop-blur-xl` for primary cards, `backdrop-blur-lg` for secondary
- Border: 1px solid `border-white/20`
- Shadow: Soft, elevated shadows `shadow-2xl`
- Border radius: `rounded-2xl` for cards, `rounded-xl` for smaller elements

**Usage Contexts**:
- Product cards on listing pages
- Cart drawer/sidebar
- Checkout summary panels
- Dashboard stat cards
- Modal overlays and drawers
- CTA sections overlaying hero images

## Component Library

### Navigation
- Fixed header with glass effect on scroll (`backdrop-blur-md bg-white/80`)
- Logo left, main nav center, cart/account icons right
- Mobile: Hamburger menu with slide-in glass panel

### Product Cards
- Glass container with product image, title, grade badge, price
- Hover: Subtle scale (1.02) with increased shadow
- Grid: 2 columns mobile, 3-4 columns desktop
- Badge system for condition grades (A, B, C) with color coding

### Product Detail Page
- Large image gallery (60% width) with thumbnails
- Glass sidebar (40% width) containing: title, grade, specs, variant selector, price tier table, add to cart
- Tabbed content below: Description, Specifications, Condition Details

### Variant Selector
- Segmented control style for capacity (64GB, 128GB, 256GB)
- Dropdown or button group for grade and network
- Real-time price updates as selections change

### Price Tier Table
- Glass card showing bulk pricing (1-4 units, 5-19 units, 20+ units)
- Highlight current tier based on cart quantity
- "Wholesale pricing available" badge for eligible users

### Cart Drawer
- Slide-in from right with glass backdrop and panel
- Line items with thumbnail, variant details, quantity stepper
- Glass sticky footer with subtotal and checkout button
- Empty state with suggested products

### Checkout Flow
- Multi-step indicator at top (Cart → Shipping → Payment → Confirm)
- Two-column layout: form fields left, glass order summary right (sticky)
- Form inputs with glass styling: `bg-white/5 border-white/20`

### Dashboard (Admin/Customer)
- Sidebar navigation with glass treatment
- Data tables with alternating glass row backgrounds
- Stat cards in grid showing KPIs (glass cards with icons)
- Order status badges with color coding

### Buttons & CTAs
- Primary: Solid with gradient or brand color, `rounded-full` or `rounded-lg`
- Secondary: Glass style with `bg-white/10 backdrop-blur-md border-white/30`
- When on hero images: Add `backdrop-blur-lg` background for readability
- No hover states on glass buttons over images (inherent button states handle this)

## Page-Specific Layouts

### Homepage
- **Hero**: Full-width image showcase of premium refurbished phones with centered glass card containing headline, subheadline, dual CTAs (Browse Phones, Wholesale Inquiry)
- **Featured Products**: 3-4 column grid of best deals in glass cards
- **Trust Signals**: Glass cards row showing warranties, grading process, customer reviews
- **Categories**: Image tiles for phone brands/models with glass overlay labels
- **CTA Section**: Wholesale signup with background image and glass form

### Product Listing
- Filter sidebar (glass panel) with collapsible sections: Brand, Model, Capacity, Grade, Price Range
- Product grid with sort dropdown (Price, Grade, Newest)
- Pagination with glass buttons

### Account Dashboard
- Welcome card with user info and role badge
- Order history table with status, tracking, reorder buttons
- Saved addresses in glass cards
- For wholesale users: bulk order templates

### Admin Dashboard
- Grid of stat cards (total orders, revenue, low stock alerts)
- Quick actions: Add Product, Process Orders, Generate Reports
- Recent activity feed in glass cards
- Data tables with inline edit capabilities

## Images
**Critical Image Placements**:
1. **Homepage Hero**: Large hero image (100vh or 80vh) showing multiple refurbished phones arranged aesthetically - overlay glass card with value proposition
2. **Product Cards**: High-quality product photos on clean white/gradient backgrounds
3. **Product Detail**: 4-6 images per product showing different angles, condition close-ups
4. **Trust Section**: Photos of grading/testing process, warehouse, team
5. **Category Cards**: Brand lifestyle imagery (iPhone, Samsung, Google Pixel aesthetic)

## Animations
**Minimal & Purposeful**:
- Page transitions: Smooth fade-ins
- Glass cards: Subtle hover scale (1.02) with shadow increase
- Cart drawer: Slide animation with backdrop fade
- Product image gallery: Crossfade between images
- Loading states: Skeleton screens with glass styling
- NO complex scroll animations or parallax effects

## Accessibility
- Glass elements maintain 4.5:1 contrast for text
- Focus states with visible glass borders (`ring-2 ring-offset-2`)
- ARIA labels for icon buttons
- Keyboard navigation for all interactive elements
- Form validation with clear error states in glass containers

## Responsive Behavior
- Mobile: Single column, collapsible filters, simplified glass effects
- Tablet: Two columns for products, streamlined navigation
- Desktop: Full multi-column grids, persistent sidebars, enhanced glass effects

This design creates a premium, trustworthy shopping experience that differentiates refurbished phones as high-quality products while maintaining efficiency for both retail and wholesale buyers.