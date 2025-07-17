# Product Requirements Document

## 1. Executive Summary

Build a modern web-based jewelry store focused on bracelets and necklaces. The store offers an admin dashboard for product management, Kakao social login for shoppers, clear product pages, and a KakaoTalk inquiry hand-off for payments. Tech stack: Next.js, Supabase (PostgreSQL, Auth, Storage), vanilla CSS. Goal: deliver a sleek, mobile-optimized shopping experience for women aged 20–40 and give the client full ownership of their own e-commerce site.

## 2. Problem Statement

Aspiring jewelry sellers lack an independent, brand-controlled store that feels as contemporary as leading platforms (e.g., Musinsa) without paying high marketplace fees or surrendering customer data. They need simple product management and frictionless customer onboarding, yet cannot invest in building full payment rails immediately.

## 3. Goals and Objectives

- Primary Goal: Launch an operational jewelry storefront with admin self-service and Kakao-based customer flows.
- Secondary Goals:
  • Create a visually “modern” UI that resonates with fashion-savvy shoppers.  
  • Allow quick scaling to full payment later.  
  • Collect shopper behavior data for future marketing.
- Success Metrics:
  • ≥1,000 monthly unique visitors three months post-launch  
  • ≥5% visitor-to-Kakao inquiry conversion  
  • Admin can list a new product in <3 minutes  
  • Page load <2 s (p75) on mobile 4G

## 4. Target Audience

### Primary Users

- Female 20–40, fashion-conscious, frequent mobile shoppers, active KakaoTalk users.

### Secondary Users

- Store owner and staff (admin dashboard).
- Jewelry suppliers checking listings.

## 5. User Stories

- As a shopper, I want to log in with Kakao so that I access the store instantly.
- As a shopper, I want to browse high-quality photos and details so that I trust the product.
- As a shopper, I want to tap a “KakaoTalk Inquiry” button so that I can ask questions and pay.
- As an admin, I want to upload photos, price, stock, and descriptions so that products show correctly.
- As an admin, I want basic analytics so that I see which items get most clicks.

## 6. Functional Requirements

### Core Features

1. Product Catalog  
   • Grid & list views showing photo, name, price.  
   • Product detail page: up to 10 images, description, materials, dimensions, price.  
   • Acceptance: Image loads <1 s on broadband; “Inquiry” button visible above fold.

2. Admin Dashboard  
   • CRUD for products (title, SKU, price, inventory, tags, images).  
   • Drag-and-drop or multi-select upload (JPEG/PNG ≤5 MB each).  
   • Role-based access (owner vs. staff).  
   • Acceptance: Save action returns success message and product appears in catalog instantly.

3. Authentication & Authorization  
   • Kakao OAuth login/sign-up for shoppers.  
   • Supabase email/password for admins.  
   • Acceptance: Kakao login completes <10 s; session persists 30 days.

4. KakaoTalk Payment Hand-off  
   • “Buy via KakaoTalk” CTA opens 1:1 chat with pre-filled product info link.  
   • Acceptance: Clicking CTA launches KakaoTalk on mobile or Kakao web chat on desktop.

### Supporting Features

- Responsive design (≥320 px width).
- Search bar with product name/keyword.
- Filter by category (bracelet, necklace) and price range.
- Wishlist (localStorage) for logged-in users.
- Basic traffic & conversion dashboard (page views, inquiry clicks).

## 7. Non-Functional Requirements

- Performance: TTI ≤2 s; image CDN via Supabase Storage & edge caching.
- Security: HTTPS, Supabase RLS, OAuth scopes limited to email/profile.
- Usability: WCAG AA color contrast; tap targets ≥44 px.
- Scalability: Support 10k daily visitors, 5k SKUs.
- Compatibility: Latest two versions of Chrome, Safari, Edge, Firefox (desktop & mobile); iOS 15+, Android 10+.

## 8. Technical Considerations

- Architecture: Next.js SSR for SEO; API routes proxy to Supabase; Component composition with React.
- Database: Supabase Postgres tables (products, users, inquiries, inventory).
- Storage: Supabase bucket for images with signed URLs.
- Auth: Supabase Auth (Kakao OAuth provider + email/password).
- Integrations: KakaoTalk JS SDK for chat link.
- Deployment: Vercel (CI/CD GitHub).
- Testing: Jest + React Testing Library; Playwright E2E.
- Styling: Vanilla CSS modules; PostCSS autoprefixer.

## 9. Success Metrics and KPIs

- Traffic: MAU, new vs. returning.
- Engagement: Avg. pages/session, wishlist adds.
- Conversion: Inquiry CTR, inquiry-to-purchase (tracked manually).
- Admin Efficiency: Avg. time to create product, error rate.
- System: Uptime ≥99.9%, API P95 latency ≤300 ms.

## 10. Timeline and Milestones

Phase 0 (Week 0–1): Requirements finalization, UI wireframes.  
Phase 1 MVP (Week 2–6):  
 • Catalog, Product page, Kakao login, Admin CRUD, KakaoTalk hand-off, responsive CSS.  
 • Internal QA & user acceptance.  
Phase 2 (Week 7–10):  
 • Search, filters, wishlist, basic analytics dashboard.  
 • Soft launch with real products.  
Phase 3 (Future):  
 • Native payment gateway, discount codes, reviews, multi-language (EN/KO).

## 11. Risks and Mitigation

- Kakao API changes → Monitor API notices; abstract OAuth/service calls.
- No on-site payment reduces conversion → Collect data; plan Phase 3 gateway.
- Image-heavy pages slow → Use CDN, lazy load below fold.
- Admin mismanages inventory → Add low-stock alerts; audit logs.
- CSS instability without framework → Set style guide, linting.

## 12. Future Considerations

- Full checkout with PG (KCP, Toss).
- SMS/Email order updates.
- AI-based product recommendation.
- iOS/Android wrapper via React Native WebView.
- Marketplace expansion (user-generated listings).
