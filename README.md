# SpeedTest - Production-Grade Internet Speed Test

## Features

✓ **Real-time Speed Testing**
- Ping measurement (latency)
- Download speed (Mbps)
- Upload speed (Mbps)
- All tests run in-browser for accuracy

✓ **Performance Optimized**
- Edge Functions for < 50ms TTFB globally
- ISR & static caching
- < 200KB client-side bundle
- Handles 10M+ monthly users

✓ **SEO Optimized**
- Dynamic meta tags
- JSON-LD structured data
- Auto-generated sitemap.xml & robots.txt
- Optimized for "speed test" keywords

✓ **Security & Abuse Prevention**
- Rate limiting (30 tests/hour per IP)
- Edge middleware for fast blocking
- No databases - fully serverless

✓ **Monitoring & Analytics**
- Web Vitals tracking (TTFB, LCP, CLS)
- Performance overlay (dev mode)
- Vercel Analytics integration
- Structured logging

✓ **Dark/Light Mode**
- Automatic theme detection
- Smooth transitions
- Accessible color contrast

---

## Quick Deploy

### Deploy to Vercel (1 click)

\`\`\`bash
vercel deploy
\`\`\`

### Set Custom Domain

\`\`\`bash
vercel domains add speedtest.example.com
\`\`\`

---

## Architecture

\`\`\`
┌─ Next.js 15 (App Router)
│  ├─ app/page.tsx (SSG homepage)
│  ├─ app/layout.tsx (SEO metadata)
│  └─ components/ (React components)
│
├─ API Routes
│  ├─ /api/ping (Edge Function)
│  ├─ /api/test-download (Node.js)
│  ├─ /api/upload (Node.js)
│  └─ /api/log (Node.js)
│
├─ Middleware (middleware.ts)
│  └─ Rate limiting & request logging
│
└─ CDN & Caching
   ├─ Vercel Global Edge Network
   ├─ Static asset caching
   └─ Optional Cloudflare integration
\`\`\`

---

## File Structure

\`\`\`
speedtest/
├── app/
│   ├── api/
│   │   ├── ping/route.ts
│   │   ├── upload/route.ts
│   │   ├── test-download/route.ts
│   │   └── log/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── speed-gauge.tsx
│   ├── speed-test-container.tsx
│   ├── test-button.tsx
│   ├── test-results.tsx
│   ├── seo-schema.tsx
│   └── performance-overlay.tsx
├── lib/
│   ├── rate-limiter.ts
│   ├── web-vitals.ts
│   ├── geolocation.ts
│   ├── monitoring.ts
│   └── test-file-generator.ts
├── middleware.ts
├── DEPLOYMENT.md
├── CLOUDFLARE_SETUP.md
└── README.md
\`\`\`

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ping` | GET | Measure latency |
| `/api/test-download?size=5242880` | GET | Download speed test |
| `/api/upload` | POST | Upload speed test |
| `/api/log` | POST | Log test results |

---

## Configuration

### Rate Limiting
- **File**: `middleware.ts`
- **Default**: 30 tests per hour per IP
- **Adjustable**: Yes

### Test Parameters
- **File**: `components/speed-test-container.tsx`
- **Download size**: 5MB (adjustable)
- **Upload size**: 2MB (adjustable)

### Branding
- **File**: `app/layout.tsx`
- Update title, description, and metadata

---

## Performance Targets

| Metric | Target |
|--------|--------|
| TTFB | < 50ms (global edge) |
| LCP | < 2.5s |
| CLS | < 0.1 |
| FCP | < 1.8s |
| Bundle Size | < 200KB |
| Monthly Users | 10M+ |

---

## Deployment Guides

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Cloudflare Setup](./CLOUDFLARE_SETUP.md)

---

## Support

- Issues: Check browser console and Vercel logs
- Help: Visit vercel.com/help

---

## Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS v4
- Vercel Edge Functions
- Vercel Analytics
- Optional: Cloudflare CDN
