# SecondhandCell Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from trusted marketplace platforms (Swappa, eBay, Gazelle) and modern e-commerce leaders (Shopify, Stripe) to create a professional, trust-building experience. The design emphasizes transparency, credibility, and ease of use for customers selling valuable devices.

**Core Principle**: Build trust through clarity, professionalism, and transparent pricing. Every element should reinforce reliability and make the selling process feel safe and straightforward.

---

## Typography System

**Primary Font**: Inter or DM Sans (via Google Fonts CDN)
- Headings: 600-700 weight
- Body: 400-500 weight
- Buttons/CTAs: 600 weight

**Type Scale**:
- Hero Headlines: text-5xl to text-7xl
- Section Headers: text-3xl to text-4xl
- Subsection Headers: text-xl to text-2xl
- Body Text: text-base to text-lg
- Small Text/Labels: text-sm
- Pricing/Numbers: text-2xl to text-4xl (bold, 700 weight)

---

## Layout & Spacing

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 (e.g., p-4, mb-8, gap-12)

**Container Strategy**:
- Full-width sections with inner max-w-7xl for main content
- Quote calculator: max-w-4xl centered
- Text content: max-w-3xl for optimal readability

**Section Padding**: py-16 md:py-24 for major sections, py-12 md:py-20 for subsections

---

## Core Components

### Homepage Layout

**Hero Section** (80vh minimum):
- Large hero image showcasing modern smartphones (iPhone and Samsung devices) in clean, professional product photography style
- Overlay with blurred background buttons for primary CTA
- Headline: "Get Cash for Your iPhone or Samsung Today"
- Subheadline emphasizing speed and trust: "Instant quotes. Fast payment. Trusted by thousands."
- Primary CTA: "Get Your Quote Now" (prominent, large button)
- Trust indicators below: Small text showing payment methods, security badges, or "Rated 4.8/5 stars"

**Value Propositions Section** (3-column grid on desktop, stacked mobile):
- Cards featuring: "Instant Quotes", "Fast Payment", "Top Dollar Prices"
- Each with icon (Heroicons), bold title, 2-3 sentence description
- Clean card design with subtle shadows or borders

**How It Works** (4-step horizontal timeline on desktop, vertical on mobile):
- Step 1: Get Quote → Step 2: Ship Device → Step 3: Inspection → Step 4: Get Paid
- Large step numbers (text-4xl), icon for each step, brief description
- Visual connecting line between steps

**Device Showcase** (2-column grid with large device images):
- Two sections: "iPhones We Buy" and "Samsung Devices We Buy"
- Product images of latest models with starting prices
- "See all models" link to catalog page

**Social Proof Section**:
- 3-column testimonial grid with customer photos, quotes, names, and star ratings
- "Trusted by 10,000+ customers" headline
- Real testimonial format: quote, customer name, device sold

**Final CTA Section**:
- Split layout: Left side with headline and supporting text, right side with quick quote form preview
- "Ready to sell? Get your quote in 30 seconds"
- Button linking to quote page

### Quote Calculator Page

**Header Section**:
- Clear headline: "Get Your Instant Quote"
- Progress indicator showing: Device Type → Model → Condition → Quote (4 steps)

**Quote Form** (centered, card-based design):
- Step-by-step interface with large touch targets
- Device Type selection: Large cards with iPhone/Samsung logos
- Model dropdown: Searchable list with device images
- Storage capacity: Button group selection (64GB, 128GB, 256GB, etc.)
- Condition assessment: Cards with images showing Excellent, Good, Fair conditions with detailed descriptions
- Visual pricing updates in real-time as selections are made
- Final quote display: Large price in bold (text-5xl) with "We'll pay you:" prefix
- Primary CTA: "Accept Quote & Continue"

**Trust Elements** (sidebar or below form):
- Payment timeline: "Get paid within 2 business days"
- Free shipping badge
- Price match guarantee
- Customer service contact info

### Device Catalog Page

**Filter Section** (left sidebar on desktop, collapsible on mobile):
- Device type filter (iPhone/Samsung)
- Model year filter
- Price range slider

**Device Grid** (3-4 columns on desktop, 2 on tablet, 1 on mobile):
- Device card: Large product image, model name, storage variants, price range
- Hover state showing "Get Quote" button
- Visual hierarchy: Image dominant, text secondary

### How It Works Page

**Step-by-Step Breakdown** (alternating left-right layout):
- Large section for each step with illustration/icon on one side, detailed text on other
- Visual flow connecting each step
- FAQ accordion at bottom addressing common concerns

**Footer** (comprehensive):
- Logo and tagline
- Navigation links: About, How It Works, Devices We Buy, Contact, FAQ
- Contact information: Email, phone, business hours
- Payment method icons
- Social media links
- Newsletter signup: "Get the latest device buyback prices"
- Copyright and legal links

---

## Images

**Hero Image**: Professional product photography showing iPhone and Samsung flagship devices arranged aesthetically on clean surface, bright lighting, shallow depth of field

**Device Images Throughout**: High-quality product shots of specific iPhone and Samsung models, consistent white/light background, angled to show device clearly

**How It Works Section**: Simple iconography or illustrations showing process (box, shipping, payment)

**Testimonial Section**: Placeholder avatar images or authentic customer photos (if available)

---

## Icon Library
Use **Heroicons** via CDN for all interface icons (checkmarks, arrows, device icons, trust badges)

---

## Accessibility
- Maintain WCAG AA contrast standards
- All form inputs with clear labels and error states
- Focus indicators on all interactive elements
- Semantic HTML throughout