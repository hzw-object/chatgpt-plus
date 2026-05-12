# Research: Huolilink UI Redesign

**Date**: 2026-05-11
**Feature**: Huolilink UI Redesign for chatgpt-plus

## Technology Stack

| Aspect | Finding |
|--------|---------|
| Tailwind Config | Already `darkMode: 'class'` ✓ |
| Primary Color | Already `#8b5cf6` (violet) ✓ |
| Vue Version | Vue 3 Composition API |
| State | Pinia stores already have sidebarCollapsed, mobileOpen, isDark ✓ |

**Decision**: No technology changes needed - all infrastructure already in place.

## Styling Gap Analysis

### Current State vs Target

| Component | Current | Target (huolilink) | Action |
|-----------|---------|-------------------|--------|
| Theme System | CSS variables in common.scss | Tailwind `dark:` classes | Migrate |
| Sidebar | w-64/w-72, ml-64/ml-72 | Same structure | Verify |
| Cards | Element Plus + custom SCSS | Tailwind `.card` classes | Add utilities |
| Buttons | .btn-go, .btn-normal | Tailwind `.btn` classes | Add utilities |
| Inputs | Element Plus defaults | Tailwind `.input` classes | Add utilities |

### Key huolilink Style Patterns to Adopt

1. **Color Palette**: Slate-based (slate-50 to slate-950) with violet-600/violet-500 accent
2. **Border Strategy**: `border-slate-200` light / `dark:border-slate-800` dark
3. **Shadow System**: `shadow-card` (subtle shadow) + `shadow-card-hover` (enhanced on hover)
4. **Button System**: `.btn` base + `.btn-primary`, `.btn-secondary`, `.btn-ghost` variants
5. **Card System**: `.card` base + `.card-hover`, `.card-glass` variants

## Implementation Strategy

1. **Non-destructive**: All existing SCSS variables preserved as fallbacks
2. **Progressive**: Add Tailwind utility classes alongside existing styles
3. **Verified**: Test both light and dark mode on each modified component

## Conclusion

No unknowns remain. All technical questions resolved - ready for implementation.