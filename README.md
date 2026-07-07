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
