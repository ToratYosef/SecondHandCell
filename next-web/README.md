# SecondHandCell - Next.js Buyback Service

A modern Next.js application for a mobile phone buyback service. Users can get instant quotes for used devices, ship them for free, and receive payment within 24 hours.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3001` (or the next available port).

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout with AuthProvider, Header, Footer
├── page.tsx                # Homepage with hero, metrics, features
├── globals.css             # Tailwind CSS with custom animations
├── sell/
│   └── page.tsx           # Quote generation flow (3-step form)
├── account/
│   └── page.tsx           # User dashboard for trade-in orders
├── about/
│   └── page.tsx           # About company page
├── how-it-works/
│   └── page.tsx           # Process explanation page
└── api/
    └── quotes/
        └── route.ts       # API endpoint for quote calculation

components/
├── Header.tsx             # Navigation header with auth
├── Footer.tsx             # Footer with links and contact
├── FeaturesSection.tsx    # Features/process cards
├── AuthModal.tsx          # Authentication modal
├── ChatWidget.tsx         # Support chat widget

context/
├── AuthContext.tsx        # Authentication context provider

hooks/
├── useScrollAnimation.ts  # Scroll-triggered animations

lib/
├── firebase.ts           # Firebase configuration (optional)

public/                    # Static assets
```

## ✨ Features Implemented

### 1. **Homepage** (`/`)
- Hero section with strong CTA
- Trust metrics (100K+ devices, 98% satisfaction, $400+ avg payout, 24H payment)
- Why Sell With Us section (4 feature cards)
- Popular devices section with quick offer buttons
- Testimonial-ready layout
- Footer with links and contact

### 2. **Quote Generation** (`/sell`)
**Step 1: Device Selection**
- Brand dropdown (Apple, Samsung, Google, OnePlus, Motorola)
- Dynamic model selection based on brand
- Storage capacity selection

**Step 2: Condition Assessment**
- Radio buttons for device condition (Excellent, Good, Fair, Poor)
- Clear descriptions for each condition

**Step 3: Quote Display**
- Guaranteed price calculation based on device and condition
- 30-day price lock guarantee
- Trust badges (secure, guaranteed, fast)

### 3. **API Routes** (`/api/quotes`)
- `POST /api/quotes` - Calculates quotes based on device specs
- Device pricing database
- Condition multipliers for accurate pricing
- Quote ID generation and expiration tracking

### 4. **User Dashboard** (`/account`)
- Trade-in history view
- Current order status with progress tracker
- Order details (quote, shipping tracking, payment method)
- Quick action to get another quote

### 5. **Info Pages**
- **About** (`/about`) - Mission, values, team stats
- **How It Works** (`/how-it-works`) - 3-step process with FAQ

### 6. **Global Components**
- **Header** - Navigation, logo, auth buttons, user dropdown
- **Footer** - Links, contact info, social media placeholders
- **Auth Modal** - Sign in/signup overlay
- **Chat Widget** - Support chat interface

## 🛠 Technical Architecture

### Frontend Stack
- **Framework:** Next.js 14.2.5 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4.4
- **Animations:** CSS keyframes + Intersection Observer hook
- **Icons:** FontAwesome 6.5.2

### Authentication
- Context API for state management
- Placeholder Firebase integration
- Ready for NextAuth.js integration

### Form Handling
- React hooks for form state
- Client-side validation
- Prepared for React Hook Form + Zod integration

### Rendering Strategy
- **Pages:** Static Generation (SSG) with ISR for marketing pages
- **Quote Flow:** Client-side rendering with server-side validation
- **Dashboard:** Ready for Server-Side Rendering (SSR)

## 🔧 Configuration Files

### `tailwind.config.js`
- Custom colors and animations
- Content paths configured for all component files
- Custom keyframes for fade-in-up animation

### `postcss.config.js`
- Proper PostCSS and Autoprefixer setup

### `tsconfig.json`
- Path aliases (`@/` for imports)
- Strict type checking enabled

### `next.config.js`
- Standard Next.js configuration ready for customization

## 📦 Dependencies

**Core:**
- `next@14.2.5`
- `react@18.3.1`
- `react-dom@18.3.1`

**Styling:**
- `tailwindcss@3.4.4`
- `postcss@8.4.39`
- `autoprefixer@10.4.22`

**Icons & UI:**
- `@fortawesome/react-fontawesome@0.2.2`
- `@fortawesome/fontawesome-svg-core@6.5.2`
- `@fortawesome/free-solid-svg-icons@6.5.2`

**Utilities (Optional - ready to integrate):**
- Firebase SDK for authentication
- React Hook Form for form management
- Zod for validation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t secondhandcell .
docker run -p 3000:3000 secondhandcell
```

### Standard Node.js
```bash
npm run build
npm start
```

## 🎨 Design Highlights

### Color Scheme
- **Primary:** Indigo (#4F46E5)
- **Accent:** Green (#22C55E)
- **Secondary:** Purple (#A855F7)
- **Neutral:** Gray scale

### Typography
- **Display Font:** Dancing Script (Google Fonts)
- **Body Font:** Inter (Google Fonts)

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Optimized for all device sizes

## 📝 Next Steps for Production

1. **Authentication**
   - Integrate NextAuth.js with Google OAuth
   - Implement Firebase Authentication
   - Add email/password login

2. **Database**
   - Set up PostgreSQL or MongoDB
   - Create device pricing database
   - Implement order tracking system

3. **Payments**
   - Integrate Stripe or payment processor
   - Implement Venmo/Zelle/PayPal integration

4. **Email**
   - SendGrid or Mailgun for notifications
   - Order status updates
   - Payment confirmations

5. **Analytics**
   - Google Analytics 4
   - Conversion tracking
   - User behavior analytics

6. **SEO**
   - Meta tags optimization
   - Structured data (schema.org)
   - XML sitemap generation

## 🐛 Troubleshooting

### Port Already in Use
The dev server will automatically try the next available port (3001, 3002, etc.)

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Type Errors
Ensure all TypeScript files use `.ts` or `.tsx` extensions. The project is strictly typed.

## 📞 Support

For issues or questions about implementation:
1. Check the code comments in each component
2. Review the Next.js documentation: https://nextjs.org
3. Tailwind CSS docs: https://tailwindcss.com

## 📄 License

MIT License - Feel free to use this project as a template for your own applications.

---

**Built with Next.js 14** | **Styled with Tailwind CSS** | **Type-safe with TypeScript**
