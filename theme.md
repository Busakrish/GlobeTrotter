# Project Theme Guide

This document defines the visual design system used across the project — colors, typography, and component styling. Use it as the single source of truth when building UI so everything stays consistent.

---

## 🎨 Color Palette

### Primary / Brand

| Name | Hex | Usage |
|---|---|---|
| Deep Plum | `#714B67` | Primary buttons, brand accents, active states |
| Ink Navy | `#1B1B26` | Headings, body text |
| Light Gray | `#F1F1F3` | Section backgrounds, secondary buttons |
| White | `#FFFFFF` | Cards, main content surfaces |

### Accent Colors

| Name | Hex | Usage |
|---|---|---|
| Coral | `#F16E62` | Highlights, alerts, tag #1 |
| Teal / Emerald | `#2AB79B` | Underlines, success states, tag #2 |
| Golden Yellow | `#F0A63F` | Decorative accents, tag #3 |
| Sky Blue | `#3E8EDE` | Links, info states, tag #4 |

> **Rule of thumb:** Keep backgrounds neutral (white / light gray) and use no more than one or two accent colors per section — let them pop instead of competing.

---

## ✍️ Typography

- **Headlines:** Casual, hand-drawn / script-style font paired with marker-style highlight strokes or underlines in an accent color. Used sparingly — one highlight per headline.
- **Body & UI text:** Clean, modern sans-serif (e.g. system font stack: `-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) for readability and a professional feel.
- The contrast between a playful headline and businesslike body copy is core to the look — don't apply the script font to paragraphs or UI labels.

---

## 🧩 Components

**Buttons**
- Primary: solid Deep Plum (`#714B67`) fill, white text, ~6px rounded corners
- Secondary: Light Gray (`#F1F1F3`) fill, Ink Navy text, same corner radius

**Cards**
- White background
- Thin colored top border (rotate through accent colors to differentiate categories/tiers)
- Soft drop shadow (`0 2px 8px rgba(0,0,0,0.06)`)

**Category / list labels**
- Bold, uppercase, colored headers (rotate through accents) above plain gray link text — keeps dense lists scannable

---

## 🌈 Overall Feel

Friendly and approachable (hand-lettering, doodle-style underlines) layered on top of a clean, structured SaaS look (grids, cards, generous white space). The goal: feel human and welcoming at a glance, but stay sharp and professional in the details.

---

## Quick Reference (CSS variables)

```css
:root {
  --color-primary: #714B67;
  --color-text: #1B1B26;
  --color-bg: #F1F1F3;
  --color-surface: #FFFFFF;

  --color-accent-coral: #F16E62;
  --color-accent-teal: #2AB79B;
  --color-accent-yellow: #F0A63F;
  --color-accent-blue: #3E8EDE;

  --radius-base: 6px;
  --shadow-card: 0 2px 8px rgba(0,0,0,0.06);
}
```
