# SecondhandCell

## Overview

SecondhandCell is a marketplace web application for selling used iPhone and Samsung devices. The platform provides instant quotes for devices based on brand, model, storage capacity, and condition. Users can submit quotes, contact the business, and learn about the selling process through a clean, professional interface designed to build trust.

The application follows a modern full-stack architecture with a React frontend, Express backend, and PostgreSQL database (via Drizzle ORM). It emphasizes transparency, ease of use, and professional design inspired by established marketplace platforms like Swappa, eBay, and Gazelle.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and API calls
- Tailwind CSS for styling with custom design system

**UI Component Strategy:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library (New York style variant) providing pre-built components
- Custom theming with light/dark mode support via context provider
- Design system based on marketplace best practices with emphasis on trust and clarity

**State Management:**
- React Query for server state (quotes, contacts, device data)
- React Context for theme state
- Local component state for forms and UI interactions

**Key Design Principles:**
- Trust-building through professional design
- Reference-based approach drawing from established marketplaces
- Typography system using Inter/DM Sans fonts
- Consistent spacing using Tailwind's spacing primitives (4, 6, 8, 12, 16, 20, 24)
- Responsive layout with mobile-first approach

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM modules (type: "module" in package.json)
- Custom Vite middleware integration for development
- Request/response logging middleware

**API Design:**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Zod schema validation for incoming data
- Error handling with appropriate HTTP status codes

**API Endpoints:**
- `POST /api/quotes` - Create new device quote
- `GET /api/quotes` - Retrieve all quotes
- `GET /api/quotes/:id` - Retrieve specific quote
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Retrieve all contact submissions

**Data Storage Strategy:**
- Abstracted storage interface (`IStorage`) allowing multiple implementations
- Current implementation: In-memory storage (`MemStorage`) using Map data structures
- Designed to support database implementation via Drizzle ORM
- UUID generation for entity IDs

### Data Layer

**ORM & Database:**
- Drizzle ORM configured for PostgreSQL dialect
- Schema-first approach with TypeScript types derived from schema
- Drizzle-Zod integration for automatic validation schema generation
- Migration support via Drizzle Kit

**Database Schema:**
- `users` table - User authentication (username, password)
- `quotes` table - Device sale quotes (brand, model, storage, condition, price, customer info, status)
- `contacts` table - Contact form submissions (planned based on routes)

**Device Data Model:**
- Static device catalog maintained in client-side code (`device-data.ts`)
- Supports iPhone and Samsung brands
- Models include storage options, base prices, and release years
- Dynamic price calculation based on condition and storage multipliers

**Pricing Algorithm:**
- Base price per device model
- Storage multipliers: 64GB (0.85x), 128GB (1.0x), 256GB (1.15x), 512GB (1.35x), 1TB (1.6x)
- Condition multipliers: Excellent (1.0x), Good (0.85x), Fair (0.65x)
- Final price = basePrice × storageMultiplier × conditionMultiplier

### External Dependencies

**Core Infrastructure:**
- **Neon Database (@neondatabase/serverless)** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database toolkit and query builder
- **Vite** - Frontend build tool with HMR and development server

**UI & Styling:**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Comprehensive set of accessible component primitives (accordion, dialog, dropdown, select, toast, etc.)
- **shadcn/ui** - Pre-built component library built on Radix UI
- **Lucide React** - Icon library

**Form & Validation:**
- **React Hook Form (@hookform/resolvers)** - Form state management
- **Zod** - Schema validation for both frontend and backend

**Development Tools:**
- **TypeScript** - Type safety across the stack
- **ESBuild** - Fast bundler for production builds
- **tsx** - TypeScript execution for development server
- **PostCSS & Autoprefixer** - CSS processing

**Session & Authentication (Configured but not actively used):**
- **connect-pg-simple** - PostgreSQL session store for Express

**Utilities:**
- **date-fns** - Date manipulation library
- **clsx & class-variance-authority** - Conditional className utilities
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel/slider functionality

**Replit Integration:**
- Development-only plugins for error overlay, cartographer, and dev banner
- Custom error handling and runtime monitoring