# Dr. Di Clinic

Ultra-modern aesthetic clinic website built with React, TypeScript, Three.js, and WebGL shaders.

## Features

- **WebGL Shader Background** — Animated starfield with shooting stars and nebula glow
- **Three.js 3D Procedure Sphere** — Interactive 3D sphere with draggable labels for all clinic procedures
- **GSAP Scroll Animations** — Smooth scroll-triggered animations on every section
- **Pinned Scroll Section** — "Why Us" section with pinned scroll and fade transitions
- **Dark Luxury Design** — Black background, white typography, indigo accents
- **Responsive** — Fully responsive for mobile, tablet, and desktop

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Three.js (3D sphere with CSS3D labels)
- GSAP + ScrollTrigger
- WebGL shaders (starfield background)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Запазване на часове (Cal.com)

Системата за часове ползва вграден **Cal.com** popup, който се отваря от всеки бутон
„Запази час". Реалната наличност и потвържденията се управляват от акаунта на клиниката.

Настройка:

1. Създайте безплатен акаунт в [cal.com](https://cal.com) и направете event type
   (напр. „Консултация", с работно време и продължителност).
2. Вземете линка във формат `username/event-slug` (напр. `di-care/konsultacia`).
3. Задайте променливата на средата **`VITE_CAL_LINK`**:
   - локално: копирайте `.env.example` в `.env.local` и сложете вашия линк;
   - на Vercel: **Settings → Environment Variables → `VITE_CAL_LINK`**, след което redeploy.
4. (По избор) Включете имейл/SMS напомняния и синхрон с Google Calendar от настройките на Cal.com.

Темата на календара (тъмно + златно) се задава в `src/lib/booking.ts`. До задаване на
реален линк бутоните ползват placeholder, така че са видимо активни.

## Project Structure

```
src/
  components/
    Header.tsx          # Fixed navigation header
    ShaderBackground.tsx # WebGL starfield background
    ProcedureSphere.tsx  # Three.js 3D sphere
  sections/
    Hero.tsx            # Hero section with text animation
    ProcedureSection.tsx # 3D sphere section
    Services.tsx        # Services grid with images
    WhyUs.tsx           # Pinned scroll slides
    Equipment.tsx       # Equipment cards
    Contact.tsx         # Contact info
    Footer.tsx          # Footer
  App.tsx              # Main app component
  index.css            # Global styles
public/
  images/              # Original clinic images
```

## Original Images

All images sourced from the original [drdiclinic.com](https://drdiclinic.com) website.

## License

All rights reserved — Dr. Di Clinic.
