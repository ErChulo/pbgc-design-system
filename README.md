# PBGC Design System

This project is a front-end design system and component workbench for the Pension Benefit Guaranty Corporation (PBGC). It brings together design tokens, reusable UI primitives, accessibility-focused patterns, and a lightweight preview environment for exploring and validating PBGC-styled components in a browser.

The codebase is built with React, Vite, and Tailwind CSS and is intended to support the creation of accessible, standards-aligned user interfaces consistent with federal design guidance.

## Purpose

- Define PBGC visual design tokens and branding rules
- Provide reusable atomic and composite UI components
- Showcase component behavior in a local Storybook-style workbench
- Support accessible, Section 508 / WCAG-aligned front-end development
- Serve as a practical foundation for future PBGC digital products and interfaces

## Installation for further development

1. Make sure you have Node.js 18 or newer installed.
2. Open a terminal in the project root.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the local development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in the terminal (typically Vite's default localhost address) to view and iterate on the design system.

## Useful development commands

```bash
npm run build
npm run preview
```

- `npm run build` creates a production bundle for deployment or testing.
- `npm run preview` serves the production build locally for review.
