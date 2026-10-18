---
name: Hospital Salvador — Centro Médico
description: Design system for the patient portal and admin panel of Centro Médico Salvador.
colors:
  primary: "#186cb2"
  primary-dark: "#0f4f85"
  primary-soft: "rgba(24, 108, 178, 0.08)"
  neutral-text: "#1f2937"
  neutral-text-muted: "#5b6472"
  neutral-surface: "#ffffff"
  neutral-surface-alt: "#f4f7fb"
  neutral-border: "rgba(24, 108, 178, 0.12)"
  neutral-bg: "#f8fafc"
  danger: "#ef4444"
  success: "#46a35e"
  info: "#3b82f6"
typography:
  display:
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "14px"
  xl: "20px"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4.5rem"
  4xl: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.6rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "0.85rem 1.6rem"
  card:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
---

# Design System: Hospital Salvador — Centro Médico

## Overview

**Creative North Star: "Confianza cercana"**

A trustworthy, warm medical portal that puts the patient first. The aesthetic is clean and clinical without being cold: a deep medical blue on white surfaces, generous whitespace, and clear hierarchy guide the patient from arrival to appointment. The system prioritizes legibility, accessibility, and a single obvious next action on every screen.

**Key Characteristics:**
- Deep medical blue (`#186cb2`) as the single accent on white surfaces.
- System font stack (Segoe UI / Helvetica Neue) for performance and clarity.
- 4-unit spacing scale for consistent rhythm.
- Rounded corners (8–20px) for approachability.
- Subtle elevation via soft shadows; no glows or heavy effects.
- Mobile-first, responsive, with `prefers-reduced-motion` support.

## Colors

The palette is restrained: one primary hue carries all emphasis, everything else is neutral.

### Primary
- **Medical Blue** (#186cb2): CTAs, links, active states, badges, focus rings. Used on ≤15% of any screen to preserve rarity and impact.

### Neutral
- **Strong Text** (#1f2937): Headings and primary content.
- **Muted Text** (#5b6472): Body copy, descriptions, secondary info.
- **Surface** (#ffffff): Cards, panels, form backgrounds.
- **Surface Alt** (#f4f7fb): Section backgrounds, subtle differentiation.
- **Border** (rgba(24, 108, 178, 0.12)): Card borders, dividers, input outlines.

### Semantic
- **Success** (#46a35e): Confirmations, positive states.
- **Danger** (#ef4444): Errors, destructive actions.
- **Info** (#3b82f6): Informational highlights.

### Named Rules
**The One Voice Rule.** The primary blue is used on ≤15% of any given screen. Its rarity is the point — it marks the action the patient must take.

## Typography

**Display Font:** Segoe UI / Helvetica Neue (system stack)
**Body Font:** Segoe UI / Helvetica Neue (system stack)

**Character:** Clean, modern, and highly legible. System fonts ensure instant rendering and native feel across devices. No decorative or overused faces.

### Hierarchy
- **Display** (800, clamp(2.25rem, 6vw, 3.75rem), 1.05): Hero headlines only. Tight line-height for impact.
- **Headline** (700, clamp(1.75rem, 4vw, 2.5rem), 1.2): Section titles. Balanced with `text-wrap: balance`.
- **Title** (700, 1.35rem, 1.3): Card titles, subsection headers.
- **Body** (400, 1rem, 1.6): Paragraphs, descriptions. Max ~65ch per line.
- **Label** (700, 0.75rem, 1.4, 0.12em tracking, uppercase): Badges, kickers, metadata.

### Named Rules
**The System-First Rule.** Use system fonts exclusively. No external font loading. Performance and native feel over decorative typography.

## Layout

- **Container:** max-width 1200px, centered, with `clamp(1rem, 4vw, 5rem)` horizontal padding.
- **Grid:** CSS Grid with `auto-fit` / `minmax()` for responsive columns. No fixed pixel grids.
- **Spacing:** 4-unit scale (0.25rem → 6rem). Choose a step, never invent a value.
- **Rhythm:** More space above headings than below. Section padding `4.5rem` vertical.
- **Breakpoints:** 480px, 720px, 900px. Mobile-first.
- **Density:** Comfortable on desktop, tighter on mobile. Touch targets ≥ 44px.

## Elevation & Depth

Flat by default. Depth is conveyed through subtle shadows and surface color differentiation, not heavy effects.

### Shadow Vocabulary
- **sm** (`0 2px 6px rgba(15, 40, 80, 0.06)`): Resting cards, inputs.
- **md** (`0 8px 24px rgba(15, 40, 80, 0.08)`): Hovered cards, elevated panels.
- **lg** (`0 16px 40px rgba(15, 40, 80, 0.12)`): Modals, overlays.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus) or for floating elements (modals, sticky bars).

## Shapes

- **Small radius** (4px): Chips, badges, small inputs.
- **Medium radius** (8px): Buttons, form fields, small cards.
- **Large radius** (14px): Cards, panels, modals.
- **XL radius** (20px): Hero cards, feature sections.
- **Pill** (999px): Badges, tags, status indicators.

Borders are 1px solid with `rgba(24, 108, 178, 0.12)` (primary at low opacity). No heavy borders.

## Components

### Buttons
- **Shape:** 8px radius (md).
- **Primary:** Blue background (#186cb2), white text, 0.85rem 1.6rem padding, 600 weight. Hover: translateY(-2px) + shadow.
- **Secondary/Ghost:** Transparent background, blue text, blue border. Hover: light blue background.
- **Icon buttons:** 44px touch target, centered icon.

### Cards
- **Corner:** 14–20px radius.
- **Background:** White (#ffffff).
- **Shadow:** sm at rest, md on hover.
- **Border:** 1px solid rgba(24, 108, 178, 0.12).
- **Padding:** 1.5rem (xl spacing).
- **Hover:** translateY(-4px to -6px) + shadow lift.

### Inputs / Fields
- **Style:** Outlined (Angular Material outline appearance), 8px radius, white background.
- **Focus:** Blue border + 2px focus ring (outline-offset 2px).
- **Error:** Red text (#ef4444) below field.
- **Disabled:** Reduced opacity, no interaction.

### Navigation
- **Style:** Sticky header, white background with backdrop-blur (blur 12px, saturate 180%).
- **Typography:** 0.9rem, 500 weight, primary color on active.
- **Default/Hover/Active:** Muted text → blue on hover → bold blue + underline on active.
- **Mobile:** Hamburger menu, slide-in drawer, full-width links.
- **CTA:** "Agendar cita" as filled primary button in nav.

### Badges
- **Style:** Pill shape, blue text on light blue background, uppercase, 0.75rem, 700 weight, 0.12em tracking.
- **Usage:** Section labels, status indicators, trust signals.

## Do's and Don'ts

### Do:
- **Do** use the primary blue only for actionable elements (CTAs, links, active states). Its rarity is the point.
- **Do** use system fonts exclusively. No external font loading.
- **Do** use `clamp()` for fluid typography. No fixed pixel font sizes for headings.
- **Do** respect `prefers-reduced-motion`. Disable animations, keep essential feedback.
- **Do** provide `alt` text on every image and `aria-label` on icon-only buttons.
- **Do** use `loading="lazy"` on below-fold images.
- **Do** use the 4-unit spacing scale. Never invent spacing values.
- **Do** ensure touch targets are ≥ 44px on mobile.
- **Do** test contrast against real backgrounds (including images and gradients).

### Don't:
- **Don't** use pure black (#000) on pure white (#fff). Use #1f2937 on #ffffff.
- **Don't** use overused fonts (Inter, Roboto, Fraunces, Plus Jakarta Sans, Space Grotesk, Geist).
- **Don't** use glows, heavy drop shadows, bevels, or emboss.
- **Don't** use generic stock 3D illustrations or floating shapes.
- **Don't** use pill buttons everywhere — reserve for badges/tags.
- **Don't** use gradient-blob heroes or glassmorphism.
- **Don't** truncate the identifying field of a list row.
- **Don't** use `transform: scale()` for responsive reflow — use fluid type and grid.
- **Don't** leave entrance motion on without a reduced-motion variant.
- **Don't** invent statistics, testimonials, or logos. Use placeholders for missing data.
