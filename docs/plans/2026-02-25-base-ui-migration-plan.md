# Base UI Component Migration & Icon System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all UI components from Radix UI to Base UI primitives and replace lucide-react with hugeicons.

**Architecture:** Port minikyu's Base UI component implementations to the template. Components use `@base-ui/react` primitives wrapped with CVA variants and Tailwind classes. Icons use `@hugeicons/core-free-icons` + `@hugeicons/react` via a centralized Icon wrapper.

**Tech Stack:** Base UI (React), Hugeicons, CVA, Tailwind CSS v4, TypeScript

**Reference project:** `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu` — source of all component ports

---

### Task 1: CSS Foundation — shadcn/tailwind.css and Scrollbar Variables

**Files:**
- Modify: `src/App.css`
- Modify: `src/theme-variables.css`

**Step 1: Add shadcn/tailwind.css import to App.css**

Add `@import "shadcn/tailwind.css";` after the tw-animate-css import in `src/App.css`. This provides custom Tailwind v4 variants (`data-open`, `data-closed`, `data-checked`, etc.) that Base UI components depend on.

The import line goes between `@import "tw-animate-css";` and `@import "./theme-variables.css";`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./theme-variables.css";
```

**Step 2: Add scrollbar variables to theme-variables.css**

Add to the `:root` block:
```css
  --scrollbar-size: 10px;
  --scrollbar-thumb: color-mix(in oklch, var(--foreground) 26%, transparent);
  --scrollbar-thumb-hover: color-mix(in oklch, var(--primary) 42%, var(--foreground) 18%);
  --scrollbar-thumb-active: color-mix(in oklch, var(--primary) 58%, var(--foreground) 12%);
```

Add to the `.dark` block:
```css
  --scrollbar-thumb: color-mix(in oklch, var(--foreground) 32%, transparent);
  --scrollbar-thumb-hover: color-mix(in oklch, var(--primary) 54%, var(--foreground) 10%);
  --scrollbar-thumb-active: color-mix(in oklch, var(--primary) 68%, var(--foreground) 6%);
```

**Step 3: Add Figtree font configuration**

Add at the top of `src/theme-variables.css`:
```css
@import "@fontsource-variable/figtree";
```

In the `@theme inline` block, change `--font-sans`:
```css
  --font-sans: "Figtree Variable", sans-serif;
```

Remove the `--font-mono: var(--font-geist-mono);` line (unused).

**Step 4: Add custom scrollbar CSS to App.css**

Add inside the `@layer base` block (after the `body` rule):
```css
  :where(*):not(.no-scrollbar) {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent;
  }
  :where(*):not(.no-scrollbar)::-webkit-scrollbar {
    width: var(--scrollbar-size);
    height: var(--scrollbar-size);
  }
  :where(*):not(.no-scrollbar)::-webkit-scrollbar-track {
    background: transparent;
  }
  :where(*):not(.no-scrollbar)::-webkit-scrollbar-thumb {
    min-height: 24px;
    border: 3px solid transparent;
    border-radius: 999px;
    background: var(--scrollbar-thumb);
    background-clip: padding-box;
  }
  :where(*):not(.no-scrollbar)::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
    background-clip: padding-box;
  }
  :where(*):not(.no-scrollbar)::-webkit-scrollbar-thumb:active {
    background: var(--scrollbar-thumb-active);
    background-clip: padding-box;
  }
  :where(*):not(.no-scrollbar)::-webkit-scrollbar-corner {
    background: transparent;
  }
```

Also update the `body` rule to use `@apply font-sans bg-background text-foreground;`.

**Step 5: Verify typecheck passes**

Run: `bun run typecheck`
Expected: PASS

**Step 6: Commit**

```
feat: Add CSS foundation for Base UI migration
```

---

### Task 2: Icon System — Wrapper Component and Icon Barrel

**Files:**
- Create: `src/components/ui/icon.tsx`
- Create: `src/lib/icons.ts`

**Step 1: Create the Icon wrapper component**

Create `src/components/ui/icon.tsx`:

```tsx
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react';

import { cn } from '@/lib/utils';

type IconProps = HugeiconsIconProps & {
  className?: string;
};

function Icon({ className, strokeWidth = 2, size = 16, ...props }: IconProps) {
  return (
    <HugeiconsIcon
      className={cn(className)}
      strokeWidth={strokeWidth}
      size={size}
      {...props}
    />
  );
}

export { Icon, type IconProps };
```

**Step 2: Create the icon barrel file**

Create `src/lib/icons.ts` with all icons used across the template. This maps lucide-react names to hugeicons equivalents:

```tsx
// Navigation / Arrows
export { ArrowDown01Icon } from '@hugeicons/core-free-icons'; // ChevronDown
export { ArrowUp01Icon } from '@hugeicons/core-free-icons'; // ChevronUp
export { ArrowLeft01Icon } from '@hugeicons/core-free-icons'; // ChevronLeft
export { ArrowRight01Icon } from '@hugeicons/core-free-icons'; // ChevronRight

// Actions
export { Cancel01Icon } from '@hugeicons/core-free-icons'; // X / XIcon
export { Search01Icon } from '@hugeicons/core-free-icons'; // Search / SearchIcon
export { Tick01Icon } from '@hugeicons/core-free-icons'; // Check / CheckIcon
export { Loading03Icon } from '@hugeicons/core-free-icons'; // Loader2

// Layout
export { SidebarLeft01Icon } from '@hugeicons/core-free-icons'; // PanelLeft
export { SidebarLeftClose01Icon } from '@hugeicons/core-free-icons'; // PanelLeftClose
export { DragDropVerticalIcon } from '@hugeicons/core-free-icons'; // GripVertical
export { MoreHorizontalIcon } from '@hugeicons/core-free-icons'; // MoreHorizontal

// Shapes
export { CircleIcon } from '@hugeicons/core-free-icons'; // Circle

// Application
export { PaintBrush01Icon } from '@hugeicons/core-free-icons'; // Palette
export { Settings01Icon } from '@hugeicons/core-free-icons'; // Settings
export { FlashIcon } from '@hugeicons/core-free-icons'; // Zap
```

NOTE: The exact hugeicons icon names may need verification against the actual package exports. During implementation, run `bun run typecheck` after creating this file to catch any invalid icon names, then fix by checking `@hugeicons/core-free-icons` exports.

**Step 3: Verify typecheck passes**

Run: `bun run typecheck`
Expected: PASS (if any icon names are wrong, fix them by searching the hugeicons package)

**Step 4: Commit**

```
feat: Add Icon wrapper component and icon barrel file
```

---

### Task 3: Batch 1 — Primitive Components (button, badge, label, separator)

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/label.tsx`
- Modify: `src/components/ui/separator.tsx`

**Step 1: Replace button.tsx**

Port minikyu's button.tsx. Key changes from template:
- Replace `@radix-ui/react-slot` `Slot`/`asChild` pattern with `@base-ui/react/button` `ButtonPrimitive`
- Button no longer uses `asChild` — uses Base UI's `render` prop instead (built into ButtonPrimitive)
- Updated CVA variants with more size options (`xs`, `sm`, `lg`, `icon-xs`, `icon-sm`, `icon-lg`)

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/button.tsx`
Replace template's `src/components/ui/button.tsx` with the minikyu version.

Ensure exports remain: `Button`, `buttonVariants`.

**Step 2: Replace badge.tsx**

Port minikyu's badge.tsx. Key changes:
- Replace `@radix-ui/react-slot` `Slot`/`asChild` with Base UI `useRender` + `mergeProps` pattern
- Now uses `useRender.ComponentProps<'span'>` instead of custom `asChild` prop

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/badge.tsx`
Replace template's `src/components/ui/badge.tsx` with the minikyu version.

Ensure exports remain: `Badge`, `badgeVariants`.

**Step 3: Replace label.tsx**

Port minikyu's label.tsx. Key change:
- Remove `@radix-ui/react-label` dependency — now a plain `<label>` with Tailwind styling
- Add biome-ignore comment for a11y lint

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/label.tsx`
Replace template's `src/components/ui/label.tsx` with the minikyu version.

Ensure exports remain: `Label`.

**Step 4: Replace separator.tsx**

Port minikyu's separator.tsx. Key change:
- Replace `@radix-ui/react-separator` with `@base-ui/react/separator`

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/separator.tsx`
Replace template's `src/components/ui/separator.tsx` with the minikyu version.

Ensure exports remain: `Separator`.

**Step 5: Verify typecheck passes**

Run: `bun run typecheck`
Expected: May have errors in consumer files that use `asChild` on Button/Badge — note them for Task 8.

**Step 6: Commit**

```
refactor: Migrate button, badge, label, separator to Base UI
```

---

### Task 4: Batch 1 continued — Toggle Components

**Files:**
- Modify: `src/components/ui/toggle.tsx`
- Modify: `src/components/ui/toggle-group.tsx`

**NOTE:** toggle.tsx and toggle-group.tsx do NOT exist in minikyu. These components should be migrated to use Base UI's `Toggle` primitive if available, or kept with minimal changes (remove Radix imports if possible).

**Step 1: Check Base UI Toggle availability**

Check if `@base-ui/react/toggle` or `@base-ui/react/toggle-group` exists by examining the package exports. If Base UI doesn't have toggle primitives, keep the existing Radix-based implementation for now (they'll be migrated in a future update when Base UI adds toggle support).

**Step 2: If Base UI has Toggle — rewrite using Base UI primitives**

If available, port using the same pattern as separator (import from `@base-ui/react/toggle`).

If NOT available, keep existing implementation but document it as "still using Radix" in a code comment.

**Step 3: Commit**

```
refactor: Update toggle components (Base UI or document Radix retention)
```

---

### Task 5: Batch 2 — Form Controls (checkbox, radio-group, select)

**Files:**
- Modify: `src/components/ui/checkbox.tsx`
- Modify: `src/components/ui/radio-group.tsx`
- Modify: `src/components/ui/select.tsx`

**Step 1: Replace checkbox.tsx**

IMPORTANT: Minikyu's checkbox re-exports from `animate-ui` primitives. For the template, create a simplified version that uses `@base-ui/react/checkbox` directly (without the animate-ui layer, since we're not doing a full animate-ui migration).

Create a new checkbox.tsx based on Base UI's Checkbox primitive with CVA variants matching minikyu's style. Use `@base-ui/react/checkbox` → `CheckboxPrimitive`. Replace the lucide `CheckIcon` with hugeicons `Tick01Icon`.

If the template already has animate-ui checkbox primitives, use minikyu's implementation directly.

**Step 2: Replace radio-group.tsx**

Port minikyu's radio-group.tsx directly. Key changes:
- Replace `@radix-ui/react-radio-group` with `@base-ui/react/radio` and `@base-ui/react/radio-group`
- Replace lucide `CircleIcon` with hugeicons `CircleIcon` + `HugeiconsIcon` wrapper

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/radio-group.tsx`

**Step 3: Replace select.tsx**

IMPORTANT: Minikyu's select.tsx still uses `@radix-ui/react-select` — NOT Base UI. This is because Base UI's Select has a different API. Port minikyu's version as-is (it already uses hugeicons but keeps Radix Select).

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/select.tsx`
Replace template's version. Update icon imports: lucide `Check`/`ChevronDown`/`ChevronUp` → hugeicons `Tick01Icon`/`ArrowDown01Icon`/`ArrowUp01Icon`.

**Step 4: Verify typecheck passes**

Run: `bun run typecheck`

**Step 5: Commit**

```
refactor: Migrate checkbox, radio-group, select to Base UI/hugeicons
```

---

### Task 6: Batch 3 — Overlay Components (dialog, sheet, alert-dialog)

**Files:**
- Modify: `src/components/ui/dialog.tsx`
- Modify: `src/components/ui/sheet.tsx`
- Modify: `src/components/ui/alert-dialog.tsx`

**Step 1: Replace dialog.tsx**

Port minikyu's dialog.tsx. Major changes:
- Replace `@radix-ui/react-dialog` with `@base-ui/react/dialog`
- API mapping: `Dialog.Overlay` → `Dialog.Backdrop`, `Dialog.Content` → `Dialog.Popup`
- Replace lucide `X` → hugeicons `Cancel01Icon`
- Close button uses `render={<Button variant="ghost" size="icon-sm" />}` pattern
- Uses `data-open`/`data-closed` variants instead of `data-[state=open]`/`data-[state=closed]`

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/dialog.tsx`

Ensure all these are exported: `Dialog`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`.

**Step 2: Replace sheet.tsx**

Port minikyu's sheet.tsx. Same pattern as dialog — uses `@base-ui/react/dialog` (sheets are dialogs in Base UI).
- Replace lucide `X` → hugeicons `Cancel01Icon`
- Close button uses `render={<Button>}` pattern

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/sheet.tsx`

Ensure all these are exported: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`.

**Step 3: Replace alert-dialog.tsx**

Port minikyu's alert-dialog.tsx.
- Replace `@radix-ui/react-alert-dialog` with `@base-ui/react/alert-dialog`
- `AlertDialogCancel` uses `render={<Button>}` pattern (replaces `asChild`)
- New: `AlertDialogMedia` sub-component for icon/image display

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/alert-dialog.tsx`

Ensure all these are exported: `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`, `AlertDialogTitle`, `AlertDialogTrigger`.

**Step 4: Verify typecheck passes**

Run: `bun run typecheck`

**Step 5: Commit**

```
refactor: Migrate dialog, sheet, alert-dialog to Base UI
```

---

### Task 7: Batch 3 continued — Tooltip and Popover

**Files:**
- Modify: `src/components/ui/tooltip.tsx`
- Modify: `src/components/ui/popover.tsx`

**Step 1: Replace tooltip.tsx**

Minikyu's tooltip re-exports from animate-ui. Check if the template has animate-ui tooltip primitives. If yes, port minikyu's version. If not, create a simplified version using `@base-ui/react/tooltip` directly.

The key exports should be: `Tooltip`, `TooltipTrigger`, `TooltipPanel` (NOTE: minikyu renamed `TooltipContent` to `TooltipPanel`).

For backward compatibility, also export `TooltipContent` as alias for `TooltipPanel` if the template's consumers use that name. Check existing consumer usage first.

**Step 2: Replace popover.tsx**

Port minikyu's popover.tsx. Key changes:
- Replace `@radix-ui/react-popover` with `@base-ui/react/popover`
- Uses `Popover.Positioner` wrapper around `Popover.Popup`
- New sub-components: `PopoverHeader`, `PopoverTitle`, `PopoverDescription`

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/popover.tsx`

Ensure exports: `Popover`, `PopoverContent`, `PopoverPanel`, `PopoverDescription`, `PopoverHeader`, `PopoverTitle`, `PopoverTrigger`.

**Step 3: Verify typecheck passes**

Run: `bun run typecheck`

**Step 4: Commit**

```
refactor: Migrate tooltip and popover to Base UI
```

---

### Task 8: Batch 4 — Navigation (breadcrumb, scroll-area)

**Files:**
- Modify: `src/components/ui/breadcrumb.tsx`
- Modify: `src/components/ui/scroll-area.tsx`

**Step 1: Replace breadcrumb.tsx**

Port minikyu's breadcrumb.tsx. Key changes:
- Replace lucide `ChevronRight`/`MoreHorizontal` → hugeicons `ArrowRight01Icon`/`MoreHorizontalIcon`
- NOTE: `BreadcrumbLink` still uses `@radix-ui/react-slot` for `asChild` pattern (same as minikyu)

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/breadcrumb.tsx`

**Step 2: Replace scroll-area.tsx**

Port minikyu's scroll-area.tsx. Key change:
- Replace `@radix-ui/react-scroll-area` with `@base-ui/react/scroll-area`
- Uses `forwardRef` for ref forwarding
- Scrollbar uses `ScrollAreaPrimitive.Scrollbar` + `ScrollAreaPrimitive.Thumb`

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/scroll-area.tsx`

Ensure exports: `ScrollArea`, `ScrollBar`.

**Step 3: Verify typecheck passes**

Run: `bun run typecheck`

**Step 4: Commit**

```
refactor: Migrate breadcrumb and scroll-area to Base UI/hugeicons
```

---

### Task 9: Batch 5 — Composite Components (button-group, item, avatar)

**Files:**
- Modify: `src/components/ui/button-group.tsx`
- Modify: `src/components/ui/item.tsx`
- Modify: `src/components/ui/avatar.tsx`

**Step 1: Replace button-group.tsx**

Port minikyu's button-group.tsx. Key changes:
- `ButtonGroupText` still uses `@radix-ui/react-slot` for `asChild` (same as minikyu)
- `ButtonGroupSeparator` uses the new `Separator` component
- New: uses `fieldset` as the root element

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/button-group.tsx`

**Step 2: Replace item.tsx**

Port minikyu's item.tsx. Key changes:
- Replace `@radix-ui/react-slot` `asChild` with Base UI `useRender` + `mergeProps` pattern
- New sub-components: `ItemHeader`, `ItemFooter`
- Uses CVA variants for `variant` and `size`

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/item.tsx`

**Step 3: Replace avatar.tsx**

Port minikyu's avatar.tsx. Key changes:
- Replace `@radix-ui/react-avatar` with `@base-ui/react/avatar`
- New sub-components: `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`
- Supports `size` prop: `'default' | 'sm' | 'lg'`

Read minikyu's version: `/Users/niskan516/Sync/Workspace/dev/desktop/minikyu/src/components/ui/avatar.tsx`

**Step 4: Verify typecheck passes**

Run: `bun run typecheck`

**Step 5: Commit**

```
refactor: Migrate button-group, item, avatar to Base UI
```

---

### Task 10: Icon Migration — UI Components

**Files:**
- Modify: `src/components/ui/spinner.tsx` — Loader2 → Loading03Icon
- Modify: `src/components/ui/command.tsx` — Search → Search01Icon
- Modify: `src/components/ui/calendar.tsx` — ChevronDown/Left/Right → ArrowDown01/Left01/Right01Icon
- Modify: `src/components/ui/date-picker.tsx` — ChevronDown → ArrowDown01Icon
- Modify: `src/components/ui/native-select.tsx` — ChevronDown → ArrowDown01Icon
- Modify: `src/components/ui/resizable.tsx` — GripVertical → DragDropVerticalIcon
- Modify: `src/components/ui/tag-input.tsx` — X → Cancel01Icon

**Step 1: For each file above, replace lucide imports with hugeicons**

Pattern:
```diff
- import { SomeLucideIcon } from 'lucide-react';
+ import { SomeHugeIcon } from '@/lib/icons';
+ import { Icon } from '@/components/ui/icon';
```

And in JSX:
```diff
- <SomeLucideIcon className="size-4" />
+ <Icon icon={SomeHugeIcon} className="size-4" />
```

NOTE: For components already migrated in earlier tasks (checkbox uses Tick01Icon, radio uses CircleIcon, select uses arrow icons, dialog/sheet use Cancel01Icon, breadcrumb uses ArrowRight01Icon/MoreHorizontalIcon), these are already done. This task covers the REMAINING icon-using UI components.

**Step 2: Verify typecheck passes**

Run: `bun run typecheck`

**Step 3: Commit**

```
refactor: Replace lucide-react icons with hugeicons in UI components
```

---

### Task 11: Icon Migration — Non-UI Components

**Files:**
- Modify: `src/components/preferences/PreferencesDialog.tsx` — Palette, Settings, Zap
- Modify: `src/components/layout/CommandSearchButton.tsx` — Search
- Modify: `src/components/layout/LinuxTitleBar.tsx` — PanelLeft, PanelLeftClose
- Modify: `src/components/layout/WindowTitleBar.tsx` — PanelLeft, PanelLeftClose

**Step 1: For each file, replace lucide imports with hugeicons**

Same pattern as Task 10. Use icons from `@/lib/icons` barrel.

**Step 2: Check for remaining lucide-react imports**

Run: `grep -r "lucide-react" src/` — should find ZERO results (except possibly in animate-ui).

If animate-ui files still reference lucide-react, update those too.

**Step 3: Verify typecheck passes**

Run: `bun run typecheck`

**Step 4: Commit**

```
refactor: Replace lucide-react icons in application components
```

---

### Task 12: Consumer Updates — asChild → render Migration

**Files:**
- Modify: `src/components/preferences/PreferencesDialog.tsx`
- Modify: `src/components/layout/LeftSideBar.tsx`
- Modify: `src/pages/ComponentsPage.tsx`
- Modify: Any other file using `asChild` on migrated components

**Step 1: Find all remaining asChild usage**

Run: `grep -rn "asChild" src/` and review each hit.

For components that now use Base UI's `render` prop instead of `asChild`:
```diff
- <Button asChild><Link to="/">Home</Link></Button>
+ <Button render={<Link to="/" />}>Home</Button>
```

For components that still support `asChild` (breadcrumb, button-group): leave as-is.

**Step 2: Update each consumer file**

**Step 3: Verify typecheck passes**

Run: `bun run typecheck`
Expected: PASS — all consumer code updated

**Step 4: Commit**

```
refactor: Update consumer components for Base UI API changes
```

---

### Task 13: Dependency Cleanup

**Files:**
- Modify: `package.json`

**Step 1: Remove Radix UI packages**

Remove from `dependencies` in `package.json`:
- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-popover`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@radix-ui/react-tooltip`

Keep `@radix-ui/react-slot` — still used by breadcrumb and button-group.

**Step 2: Remove lucide-react**

Remove `lucide-react` from `dependencies`.

**Step 3: Reinstall dependencies**

Run: `bun install`
Expected: lockfile updates, no errors

**Step 4: Full verification**

Run: `bun run typecheck && bun run lint && bun run test`
Expected: ALL PASS

**Step 5: Commit**

```
chore: Remove Radix UI packages and lucide-react
```

---

### Task 14: New Components from Minikyu (collapsible, progress)

**Files:**
- Modify or Create: `src/components/ui/collapsible.tsx`
- Modify or Create: `src/components/ui/progress.tsx`

**Step 1: Check if animate-ui primitives exist in template**

Minikyu's collapsible and progress re-export from animate-ui. Check if the template has the corresponding animate-ui primitives:
- `src/components/animate-ui/primitives/base/collapsible.tsx`
- `src/components/animate-ui/primitives/base/progress.tsx`
- `src/components/animate-ui/components/base/progress.tsx`

If they exist, port minikyu's re-export pattern. If not, create simplified versions using `@base-ui/react` directly (without animate-ui motion animations).

**Step 2: Port or create collapsible.tsx**

If animate-ui exists: Copy minikyu's `src/components/ui/collapsible.tsx` and the referenced animate-ui primitive.

If not: Create a simplified collapsible using `@base-ui-components/react/collapsible`:
```tsx
import { Collapsible as CollapsiblePrimitive } from '@base-ui-components/react/collapsible';
// Wrap with appropriate styling
```

**Step 3: Port or create progress.tsx**

Same pattern as collapsible.

**Step 4: Verify typecheck passes**

Run: `bun run typecheck`

**Step 5: Commit**

```
feat: Add collapsible and progress components from minikyu
```

---

### Task 15: Final Verification and Cleanup

**Files:**
- Various (fixes from verification)

**Step 1: Full check suite**

Run: `bun run typecheck`
Run: `bun run lint`
Run: `bun run test`

Fix any issues found.

**Step 2: Verify no remaining Radix imports (except react-slot)**

Run: `grep -r "@radix-ui/react-" src/ --include="*.tsx" --include="*.ts" | grep -v "react-slot"`
Expected: ZERO results (or only in animate-ui if those weren't migrated)

**Step 3: Verify no remaining lucide-react imports**

Run: `grep -r "lucide-react" src/ --include="*.tsx" --include="*.ts"`
Expected: ZERO results

**Step 4: Commit any remaining fixes**

```
chore: Fix remaining issues from Base UI migration
```

**Step 5: Run all checks one final time**

Run: `bun run check:all`
Expected: PASS

---

## Icon Mapping Reference

| Lucide Icon | Hugeicons Icon | Used In |
|-------------|---------------|---------|
| ChevronDown / ChevronDownIcon | ArrowDown01Icon | calendar, date-picker, select, native-select |
| ChevronUp / ChevronUpIcon | ArrowUp01Icon | select |
| ChevronLeft / ChevronLeftIcon | ArrowLeft01Icon | calendar |
| ChevronRight | ArrowRight01Icon | breadcrumb, calendar |
| X / XIcon | Cancel01Icon | dialog, sheet, tag-input |
| Search / SearchIcon | Search01Icon | command, CommandSearchButton |
| Check / CheckIcon | Tick01Icon | checkbox, select |
| Circle / CircleIcon | CircleIcon | radio-group |
| Loader2 / Loader2Icon | Loading03Icon | spinner |
| GripVertical / GripVerticalIcon | DragDropVerticalIcon | resizable |
| MoreHorizontal | MoreHorizontalIcon | breadcrumb |
| PanelLeft | SidebarLeft01Icon | WindowTitleBar, LinuxTitleBar |
| PanelLeftClose | SidebarLeftClose01Icon | WindowTitleBar, LinuxTitleBar |
| Palette | PaintBrush01Icon | PreferencesDialog |
| Settings | Settings01Icon | PreferencesDialog |
| Zap | FlashIcon | PreferencesDialog |

NOTE: Icon names may need adjustment during implementation. Verify each against `@hugeicons/core-free-icons` package exports.
