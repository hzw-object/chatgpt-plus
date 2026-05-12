# Huolilink UI Redesign for ChatGPT Plus

**Feature Branch**: `001-huolilink-ui-redesign`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "我需要根据 huolilink的UI进行本项目的修改"

## User Scenarios & Testing

### User Story 1 - Consistent Dark/Light Theming (Priority: P1)

As a user, I want a consistent and modern dark/light theme across all pages so that the interface is visually cohesive and easy on the eyes.

**Why this priority**: Theme consistency is fundamental to user experience - it affects every page and interaction.

**Independent Test**: Can be tested by toggling dark/light mode and verifying all pages update consistently.

**Acceptance Scenarios**:

1. **Given** user is on any page, **When** they toggle dark/light mode, **Then** the entire application updates immediately with consistent colors
2. **Given** user returns to the app after closing, **When** they previously selected dark mode, **Then** dark mode persists
3. **Given** user prefers system color scheme, **When** they first visit the app, **Then** the app matches their system preference

---

### User Story 2 - Modern Sidebar Navigation (Priority: P1)

As a user, I want a collapsible sidebar with clear visual hierarchy so that I can navigate efficiently on both desktop and mobile.

**Why this priority**: Navigation is a core daily-use feature that impacts task completion efficiency.

**Independent Test**: Can be tested by interacting with sidebar on desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** user is on desktop, **When** they click collapse button, **Then** sidebar collapses to icon-only mode (72px) and main content area expands
2. **Given** user is on mobile, **When** they tap the menu icon, **Then** sidebar slides in from left with overlay
3. **Given** user is on a nested route, **When** the parent nav item has children, **Then** the parent group expands automatically

---

### User Story 3 - Unified Component Styling (Priority: P2)

As a user, I want consistently styled cards, buttons, and inputs so that the interface feels professional and polished.

**Why this priority**: Component consistency reduces cognitive load and makes the interface feel trustworthy.

**Independent Test**: Can be tested by visually inspecting all interactive elements across different pages.

**Acceptance Scenarios**:

1. **Given** user views any card component, **When** it displays on both light and dark mode, **Then** it has consistent border, shadow, and background styling
2. **Given** user hovers over buttons, **When** they interact, **Then** subtle scale and color transitions occur
3. **Given** user fills in form inputs, **When** focus states change, **Then** consistent ring/focus styling appears

---

### User Story 4 - Modern Color Palette (Priority: P2)

As a user, I want a clean, modern color palette with proper contrast so that content is readable and the interface feels contemporary.

**Why this priority**: Modern aesthetics signal a well-maintained product and improve user satisfaction.

**Independent Test**: Can be tested by comparing before/after screenshots and verifying WCAG contrast ratios.

**Acceptance Scenarios**:

1. **Given** user is on light mode, **When** they view text and backgrounds, **Then** colors follow slate palette (slate-50 to slate-900) with proper contrast
2. **Given** user is on dark mode, **When** they view text and backgrounds, **Then** colors follow slate-950 palette with amber accent highlights
3. **Given** user views interactive elements, **When** they identify buttons and links, **Then** violet accent color is used consistently

---

### Edge Cases

- What happens when sidebar is collapsed on very small desktop screens (1024px)?
- How does the interface handle extremely long menu item labels?
- What if user has custom menu items with custom SVG icons?

## Requirements

### Functional Requirements

- **FR-001**: System MUST use Tailwind `dark:` class strategy for theme switching (class on `<html>`)
- **FR-002**: System MUST support light mode with slate color palette (slate-50 background, slate-900 text)
- **FR-003**: System MUST support dark mode with slate-950 background, slate-50 text, and amber accents
- **FR-004**: Users MUST be able to toggle between light and dark mode with instant visual feedback
- **FR-005**: System MUST persist theme preference in localStorage
- **FR-006**: System MUST default to system preference on first visit if no localStorage value exists
- **FR-007**: Sidebar MUST collapse to 72px width showing only icons
- **FR-008**: Sidebar MUST expand to 256px (w-64) showing icons and labels
- **FR-009**: Sidebar MUST support mobile with slide-in drawer and backdrop overlay
- **FR-010**: System MUST use violet-600 as primary accent color for light mode
- **FR-011**: System MUST use violet-500 as primary accent color for dark mode
- **FR-012**: Cards MUST have consistent rounded-xl styling with border-slate-200/dark:border-slate-800
- **FR-013**: Buttons MUST have consistent rounded-lg styling with proper hover/active states
- **FR-014**: Input fields MUST have consistent rounded-lg styling with focus ring
- **FR-015**: Scrollbar styling MUST be consistent across light and dark modes

### Key Entities

- **Theme**: Stores current theme state (light/dark), persisted to localStorage
- **Sidebar**: Manages collapsed state, mobile open state, active route tracking
- **Navigation Items**: Defines menu structure with icons, paths, and hierarchy

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can toggle theme and see changes within 100ms
- **SC-002**: Sidebar collapse/expand animation completes within 300ms
- **SC-003**: Mobile sidebar drawer opens/closes within 300ms
- **SC-004**: All pages maintain visual consistency within 5% color variance across components
- **SC-005**: Theme preference persists across browser sessions
- **SC-006**: No flash of wrong theme on initial page load

## Assumptions

- Users have stable internet connectivity for font loading
- Mobile-first responsive breakpoints at lg: (1024px) and md: (768px)
- Existing Vue Router structure will be preserved
- Backend API responses remain unchanged
- Component logic (not just styling) will be preserved from existing implementation
- Existing SCSS color variables will be replaced with Tailwind classes where appropriate
- Element Plus and Vant component libraries will continue to be used but with Tailwind utility overrides for consistent styling