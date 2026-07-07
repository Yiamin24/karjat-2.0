# Karjat Blooms — Next.js Landing Page

Standalone luxury real estate landing page for **Karjat Blooms** by Rudram Realty.  
Zero Wix dependencies. Runs fully locally.

## Stack

- **Next.js 15** (App Router)
- **React 18**
- **Tailwind CSS 3**
- **Framer Motion**
- **TypeScript**

## Quick Start

```bash
cd karjat-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + Google Fonts
│   ├── page.tsx          # Main page — wires all sections
│   └── globals.css       # Tailwind + scroll-reveal utilities
└── components/
    ├── Navigation.tsx    # Sticky nav with scroll-aware active state
    └── sections/
        ├── HeroSection.tsx
        ├── AboutSection.tsx
        ├── LocationSection.tsx
        ├── VisionSection.tsx
        ├── InfrastructureSection.tsx
        ├── LifestyleSection.tsx
        ├── MasterplanSection.tsx
        ├── ContactSection.tsx + Footer
        ├── ContactFormModal.tsx
        └── MasterPlanModal.tsx
```

## Form Submissions

The contact form currently simulates submission with a 800ms delay and shows a thank-you state.  
To wire it to a real backend, replace the `await new Promise(...)` line in `ContactFormModal.tsx` with your API call.
