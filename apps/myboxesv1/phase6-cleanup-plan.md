# Phase 6: Cleanup Plan

## Overview
This document outlines the plan for removing the original component files after all imports have been updated to use the shared components in the `/components/shared/ui/` directory. This is the final step in preparing for the NX monorepo migration.

## Prerequisites
Before beginning the cleanup process, ensure that:
1. All imports throughout the codebase have been updated to use the shared components
2. All tests are passing with the new import paths
3. The application has been thoroughly tested in development and staging environments

## Components to Remove
The following original component files should be removed:

### Button Components
- `/components/ui/button.tsx`

### Input Components
- `/components/ui/input.tsx`
- `/components/ui/textarea.tsx`
- `/components/ui/checkbox.tsx`
- `/components/ui/select.tsx`
- `/components/ui/slider.tsx`
- `/components/ui/label.tsx`

### Layout Components
- `/components/ui/card.tsx`
- `/components/ui/table.tsx`
- `/components/ui/tabs.tsx`

### Overlay Components
- `/components/ui/dialog.tsx`
- `/components/ui/popover.tsx`
- `/components/ui/tooltip.tsx`

### Display Components
- `/components/ui/badge.tsx`

## Cleanup Process

### Step 1: Verification
Before removing any files:
1. Run a search across the entire codebase to ensure no imports are still referencing the original paths
   ```bash
   grep -r "from '@/components/ui/button'" --include="*.tsx" --include="*.ts" .
   # Repeat for each component

