<!--
  Copyright (c) 2025 Ahmed Fahmy
  Developed at UFUQ TECH
  Proprietary software. See LICENSE file in the project root for full license information.
-->

---
name: Homeverse Design System
colors:
  surface: '#1c110b'
  surface-dim: '#1c110b'
  surface-bright: '#453630'
  surface-container-lowest: '#160c07'
  surface-container-low: '#251913'
  surface-container: '#291d17'
  surface-container-high: '#352721'
  surface-container-highest: '#40322b'
  on-surface: '#f6ded4'
  on-surface-variant: '#e0c0b2'
  inverse-surface: '#f6ded4'
  inverse-on-surface: '#3c2d27'
  outline: '#a78b7f'
  outline-variant: '#584238'
  surface-tint: '#ffb695'
  primary: '#ffb695'
  on-primary: '#571f00'
  primary-container: '#ed691e'
  on-primary-container: '#4c1a00'
  inverse-primary: '#a23f00'
  secondary: '#ffb781'
  on-secondary: '#4e2500'
  secondary-container: '#b05c01'
  on-secondary-container: '#fff7f3'
  tertiary: '#99cbff'
  on-tertiary: '#003354'
  tertiary-container: '#1197eb'
  on-tertiary-container: '#002c4a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb695'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7b2f00'
  secondary-fixed: '#ffdcc4'
  secondary-fixed-dim: '#ffb781'
  on-secondary-fixed: '#2f1400'
  on-secondary-fixed-variant: '#703800'
  tertiary-fixed: '#cfe5ff'
  tertiary-fixed-dim: '#99cbff'
  on-tertiary-fixed: '#001d33'
  on-tertiary-fixed-variant: '#004a78'
  background: '#1c110b'
  on-background: '#f6ded4'
  surface-variant: '#40322b'
  primary-dark: '#c4510e'
  bg-navy-deep: '#0b0f1a'
  bg-navy-darker: '#111827'
  bg-navy-card: '#1a1f2e'
  text-light: '#e2e8f0'
  text-muted: '#94a3b8'
  text-dim: rgba(255, 255, 255, 0.4)
  success: '#22c55e'
  danger: '#ef4444'
  warning: '#f59e0b'
  info: '#3b82f6'
typography:
  h1:
    fontFamily: beVietnamPro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: beVietnamPro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: beVietnamPro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: beVietnamPro
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: beVietnamPro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  section: 80px
---

# Homeverse UI Design Guide for Figma
**Project:** Homeverse - Real Estate Marketplace  
**Version:** 1.0  
**Date:** April 2026  
**Status:** Current Implementation  

## Design System Overview
Homeverse uses a modern dark theme with a vibrant orange accent color.
- **Base Framework:** Next.js 14.2.0 + React 18 + Tailwind CSS
- **Responsive:** Mobile-first design with breakpoints
- **Language Support:** Bilingual (English/Arabic) with RTL layout support

## Color Palette
- **Primary:** Orange (#e8651a), Light (#f5923e), Dark (#c4510e)
- **Backgrounds:** Dark Navy (#0b0f1a), Darker Navy (#111827), Card Navy (#1a1f2e)
- **Text:** Light Gray (#e2e8f0), Muted (#94a3b8), Dim (rgba(255, 255, 255, 0.4))
- **Status:** Success (#22c55e), Danger (#ef4444), Warning (#f59e0b), Info (#3b82f6)

## Typography
- **Primary Font:** Poppins (Headings, UI)
- **Secondary Font:** Nunito Sans (Body)
- **Arabic Font:** Cairo

## Core Components
- **Buttons:** 14px radius, Orange gradient, 0.3s ease transitions.
- **Cards:** Card Navy background, 20px radius, subtle borders.
- **Inputs:** 20px radius, Glassmorphism effects (blur 20px-30px).
- **Badges:** Pill-shaped (full radius), uppercase, colored backgrounds.

## Layout & Patterns
- **Container:** 1280px max-width.
- **Grids:** Responsive (1 col mobile, 2 col tablet, 3-4 col desktop).
- **Hero:** 2-column grid, radial gradients, floating elements.
