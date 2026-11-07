# PBGC Design System Specification (design.md)
**Current Version:** `v1.0.0` (Release Candidate)  
**Status:** Approved / Federal Standard  
**Maintainer:** PBGC Digital Experience & Front-End Engineering  
**Accessibility Level:** Section 508 / WCAG 2.1 AA & AAA Verified  
**Changelog / VCS Tag:** `git tag -a v1.0.0 -m "Initial baseline design tokens, atomic components, and Storybook integration"`

---

## 1. Version Control & Changelog Conventions

| Version | Date | Status | Authors / Reviewers | Key Changes & Milestones |
| :--- | :--- | :--- | :--- | :--- |
| **v1.0.0** | Nov 2026 | Approved | PBGC Design System Team | Baseline release: design tokens, typography scale, USWDS/Section 508 compliance, React + Tailwind + GSAP atomic components, Storybook workbench suite. |

---

## 2. Core Brand Identity & Tokens
- **Primary Brand Blue (`--pbgc-blue-700`):** `#003366` / `#035087` (Contrast > 7.2:1 against white)
- **Deep Navy (`--pbgc-blue-900`):** `#001f3f`
- **Accent Interactive Blue (`--pbgc-blue-500`):** `#0056b3`
- **Subtle Surface Tint (`--pbgc-blue-100`):** `#e6f0fa`
- **Federal Crimson (`--pbgc-red-600`):** `#ef3f43` / `#b91c1c`
- **Surface Neutral Low (`--pbgc-gray-100`):** `#f8fafc`
- **Text Main (`--pbgc-gray-900`):** `#0f172a`

### Typography Scale
- **Primary Font Family:** Public Sans, system-ui, -apple-system, sans-serif
- **Scale:** H1 (36px), H2 (28px), H3 (21.6px), Body Base (16px), Small (14px)

---

## 3. Atomic Components & Accessibility
- Touch targets: Minimum 44px × 44px
- Focus indicators: 3px solid #0056b3 outline with 2px offset
- Motion: Reduced-motion overrides for all GSAP transitions
