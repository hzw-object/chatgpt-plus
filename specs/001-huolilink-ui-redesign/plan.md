# Implementation Plan: Huolilink UI Redesign

**Branch**: `001-huolilink-ui-redesign` | **Date**: 2026-05-11 | **Spec**: [link](../001-huolilink-ui-redesign/spec.md)
**Input**: Feature specification from `/specs/001-huolilink-ui-redesign/spec.md`

## Summary

Redesign the chatgpt-plus frontend to match huolilink's modern UI with Tailwind-based dark/light theming, collapsible sidebar navigation, and unified component styling. The project already has Tailwind configured with `darkMode: 'class'` and violet primary color - this plan focuses on comprehensive styling alignment across all components.

## Technical Context

**Language/Version**: JavaScript/Vue 3 (Composition API) | TypeScript support present
**Primary Dependencies**: Vue 3, Tailwind CSS, Element Plus, Vant, Pinia | **No new dependencies needed**
**Storage**: N/A (UI-only changes)
**Testing**: Manual visual testing + ESLint validation | **No new testing infrastructure**
**Target Platform**: Web (desktop + mobile responsive)
**Project Type**: Single-page web application (Vue.js frontend)
**Performance Goals**: Theme toggle < 100ms, sidebar animation < 300ms
**Constraints**: Must preserve all existing component logic; backend API unchanged
**Scale/Scope**: ~30 Vue view components, ~10 layout/common components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Not applicable - this is a frontend UI redesign with no constitutional constraints defined.

## Project Structure

### Documentation (this feature)

```text
specs/001-huolilink-ui-redesign/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # N/A (no data model changes)
├── quickstart.md        # N/A (no API contracts)
└── contracts/           # N/A
```

### Source Code (repository root)

```text
web/src/
├── assets/css/
│   ├── common.scss      # Theme variables + global styles (MODIFY)
│   ├── index.scss       # Index page styles (MODIFY)
│   └── home.scss        # Home page styles (MODIFY)
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue       # Main layout shell (MODIFY)
│   │   ├── AppSidebar.vue      # Sidebar nav (MODIFY)
│   │   ├── AppHeader.vue       # Header with user dropdown (MODIFY)
│   │   └── AuthLayout.vue      # Auth pages layout (MODIFY)
│   └── common/                 # Shared components (MODIFY as needed)
├── views/                      # Page components (MODIFY)
│   ├── ChatPlus.vue, Index.vue, Home.vue, etc.
├── stores/                     # Pinia stores (MINIMAL - state already correct)
├── styles/main.css             # Tailwind entry (MODIFY)
└── tailwind.config.js          # Already configured (VERIFY)
```

**Structure Decision**: Single `web/` frontend project - no structural changes, only style modifications across existing files.

## Phase 0: Research

### Technology Stack Confirmation

- **Tailwind dark mode**: Already configured with `darkMode: 'class'` in tailwind.config.js ✓
- **Primary color**: Already violet-based (`#8b5cf6`) matching huolilink ✓
- **CSS strategy**: Already using SCSS with CSS variables for theming - will transition to Tailwind utilities

### Styling Approach Research

| Aspect | Current (chatgpt-plus) | Target (huolilink) | Gap |
|--------|------------------------|-------------------|-----|
| Theme toggle | CSS variables + class toggle | Tailwind `dark:` classes | Partial |
| Sidebar collapse | 72px/256px with ml-64/ml-72 | Same structure | Aligned |
| Card styling | Element Plus + custom SCSS | Tailwind rounded-xl + borders | Needs update |
| Button styling | Custom SCSS btn-go, btn-normal | Tailwind `.btn` classes | Needs update |
| Input styling | Element Plus defaults | Tailwind `.input` classes | Needs update |
| Color palette | Mixed (slate/gray/violet) | Slate-based with violet accent | Needs consolidation |

### Files to Modify

1. `web/src/assets/css/common.scss` - Theme variables → Tailwind map equivalent
2. `web/src/styles/main.css` - Tailwind directives + custom utilities
3. `web/src/components/layout/AppLayout.vue` - Verify structure matches huolilink
4. `web/src/components/layout/AppSidebar.vue` - Match huolilink styling
5. `web/src/components/layout/AppHeader.vue` - Match huolilink styling
6. `web/tailwind.config.js` - May need extended colors/utility additions

### Unknowns Resolved

- No NEEDS CLARIFICATION items - spec was clear on requirements

## Phase 1: Design

### Color System Implementation

**Light Mode Palette:**
```css
/* Backgrounds */
bg-slate-50      /* Main background */
bg-white         /* Cards */
bg-slate-100      /* Subtle sections */

/* Text */
text-slate-900   /* Primary text */
text-slate-600   /* Secondary text */
text-slate-400   /* Muted/placeholder */

/* Borders */
border-slate-200 /* Card borders */
border-slate-300 /* Input borders */

/* Accents */
text-violet-600  /* Primary accent (light mode) */
```

**Dark Mode Palette:**
```css
/* Backgrounds */
dark:bg-slate-950   /* Main background */
dark:bg-slate-900   /* Cards */
dark:bg-slate-800   /* Subtle sections */

/* Text */
dark:text-slate-50   /* Primary text */
dark:text-slate-400  /* Secondary text */

/* Borders */
dark:border-slate-800 /* Card borders */
dark:border-slate-700 /* Input borders */

/* Accents */
dark:text-violet-400   /* Primary accent (dark mode) */
dark:text-amber-400     /* Highlights */
```

### Component Styling Standards

**Buttons (`.btn-*`):**
```html
<!-- Primary button -->
<button class="btn btn-primary btn-md">
<!-- Sizes: btn-sm (px-3 py-1.5), btn-md (px-4 py-2), btn-lg (px-5 py-2.5) -->
```

**Cards (`.card`):**
```html
<div class="card card-hover p-4">
```

**Inputs (`.input`):**
```html
<input class="input" placeholder="Enter text">
```

## Complexity Tracking

> N/A - No complexity violations

## Phase 2: Implementation Tasks

### Task Groups (to be detailed in /speckit.tasks)

1. **Global Styles** - Update common.scss, main.css, tailwind.config.js
2. **Layout Components** - AppLayout, AppSidebar, AppHeader styling
3. **View Components** - Update card/button/input styling across views
4. **Theme Verification** - Test light/dark mode on all pages