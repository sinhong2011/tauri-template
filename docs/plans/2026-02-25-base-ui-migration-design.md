# Phase 2: Base UI Component Migration & Icon System

**Date:** 2026-02-25
**Status:** Approved
**Approach:** Port from minikyu (Approach A)

## Overview

Full migration of the template's UI component library from Radix UI primitives to Base UI, and from lucide-react icons to hugeicons. This is Phase 2 of the minikyu backport — Phase 1 (infra, config, Rust, deps) is complete.

## Scope

- Add CSS foundation: `shadcn/tailwind.css` import (custom Tailwind v4 variants for Base UI states), scrollbar variables, Figtree font
- Migrate 20 Radix-dependent components → Base UI primitives
- Replace lucide-react icons → hugeicons across 19 files
- Port 3 useful new components from minikyu (collapsible, progress, field update)
- Remove all `@radix-ui/react-*` packages and `lucide-react` from dependencies

## 0. CSS Foundation

### shadcn/tailwind.css Integration

Import `shadcn/tailwind.css` in `App.css`. This file provides custom Tailwind v4 variants that Base UI components depend on:
- `data-open` / `data-closed` — dialog/sheet/collapsible states
- `data-checked` / `data-unchecked` — checkbox/radio states
- `data-selected`, `data-disabled`, `data-active` — item/tab states
- `data-horizontal` / `data-vertical` — separator/toggle-group orientation
- `no-scrollbar` utility
- Accordion keyframes

Without this, all Base UI state-driven styling (animations, visibility) breaks.

### Scrollbar Variables

Add `--scrollbar-size`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`, `--scrollbar-thumb-active` to both `:root` and `.dark` in `theme-variables.css`. Port the custom scrollbar CSS from minikyu's `global.css`.

### Figtree Font

Configure `@fontsource-variable/figtree` import and set `--font-sans: "Figtree Variable", sans-serif` in the `@theme inline` block. Package already installed in Phase 1.

## 1. Icon System

### Icon Wrapper Component

Create `src/components/ui/icon.tsx` — a centralized `<Icon>` wrapper around `<HugeiconsIcon>` that standardizes default size, stroke-width, and className merging.

### Icon Barrel File

Create `src/lib/icons.ts` — re-exports all used hugeicons icons in one place. Single file to update when icons change.

### Migration Pattern

```diff
- import { X, ChevronDown } from 'lucide-react';
+ import { Cancel01Icon, ArrowDown01Icon } from '@/lib/icons';
+ import { Icon } from '@/components/ui/icon';
- <X className="size-4" />
+ <Icon icon={Cancel01Icon} size={16} />
```

~24 unique lucide icons need mapping to hugeicons equivalents.

### Files Requiring Icon Updates

**UI components (13):** breadcrumb, calendar, checkbox, command, date-picker, dialog, native-select, radio-group, resizable, select, sheet, spinner, tag-input

**Non-UI components (6):** PreferencesDialog, CommandSearchButton, LinuxTitleBar, WindowTitleBar, animate-ui/sheet, animate-ui/sidebar

## 2. Base UI Component Migration

### Batch Order (dependency-driven)

| Batch | Components | Rationale |
|-------|-----------|-----------|
| 1: Primitives | button, badge, label, separator, toggle, toggle-group | Zero internal deps, used everywhere |
| 2: Form controls | checkbox, radio-group, select | Depend on label/badge |
| 3: Overlays | dialog, sheet, alert-dialog, tooltip, popover | Complex, standalone |
| 4: Navigation | breadcrumb, scroll-area | Lower priority; scroll-area may stay custom |
| 5: Composite | button-group, item, avatar | Depend on button |

### Per-Component Pattern

1. Read minikyu version of the component
2. Copy to template, strip minikyu-specific code
3. Use `@base-ui/react/ComponentName` imports
4. Replace Radix `Slot`/`asChild` with Base UI `render` prop or `useRender` hook
5. Update icon imports to `<Icon>` + `@/lib/icons`
6. Preserve export names and props for consumer compatibility

### Key API Change: asChild → render

```diff
- <Button asChild><Link to="/home">Home</Link></Button>
+ <Button render={<Link to="/home" />}>Home</Button>
```

Minikyu retains `@radix-ui/react-slot` for `asChild` in breadcrumb and button-group only. Template follows same pattern.

### Components That Stay As-Is

Pure Tailwind/React (no Radix): alert, card, empty, field, input, kbd, native-select, skeleton, sonner, textarea

External library components (icon updates only): command (cmdk), calendar/date-picker (react-day-picker), resizable (react-resizable-panels)

### New Components from Minikyu

- `collapsible.tsx` — expandable content sections
- `progress.tsx` — progress bars

## 3. Consumer Updates & Cleanup

### Consumer File Updates

- Update all `asChild` usages → `render` prop across consumer files
- Update icon imports in non-UI components
- Update animate-ui components that reference Radix (sheet, sidebar)

### Dependency Cleanup

Remove from `package.json`:
- All `@radix-ui/react-*` packages (keep `react-slot` only if breadcrumb/button-group still need it)
- `lucide-react`

Run `bun install` to update lockfile.

### Testing Strategy

1. `bun run typecheck` — no TS errors from changed APIs
2. `bun run lint` — biome checks pass
3. `bun run test` — vitest passes
4. `cargo check` — Rust compiles (unaffected)
5. Manual: `bun run tauri:dev` — app launches, components render

## Out of Scope

- Sidebar component rewrite (minikyu-specific logic)
- animate-ui deep migration (keep existing, update imports only)
- New features or component variants not already in template
- Minikyu-specific components: database UI, reader settings, Chinese conversion, image lightbox
