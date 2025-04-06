# Project Styling System Documentation

## Overview
This document outlines the styling system used in the warehouse-platform-turbo project. The application uses a combination of Tailwind CSS, shadcn/ui components, and custom styling solutions to create a consistent and maintainable design system.

## Core Technologies

### 1. Tailwind CSS
- **Version**: Latest
- **Configuration**: Customized through `tailwind.config.js`
- **Features**:
  - Utility-first approach
  - Custom color palette
  - Responsive design utilities
  - Dark mode support

### 2. shadcn/ui
- **Integration**: Custom components built on top of Radix UI primitives
- **Features**:
  - Accessible components
  - Theme-aware styling
  - Consistent design patterns

## Styling Architecture

### 1. Global Styles (`globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light mode variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other variables */
  }

  .dark {
    /* Dark mode variables */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other variables */
  }
}
```

### 2. Theme Configuration
The application uses CSS variables for theming, allowing for:
- Light/dark mode switching
- Consistent color usage
- Easy theme customization

### 3. Component Styling
Components follow a consistent pattern:
- Base styles from Tailwind
- Custom styles through CSS modules
- Theme-aware styling using CSS variables

## Directory Structure

```
apps/
  ├── myboxesv1/
  │   ├── app/
  │   │   ├── globals.css        # Global styles
  │   │   └── styles/            # Additional styles
  │   ├── components/
  │   │   ├── ui/               # shadcn/ui components
  │   │   └── shared/           # Shared components
  │   └── tailwind.config.js    # Tailwind configuration
```

## Best Practices

### 1. Utility Classes
- Use Tailwind utility classes for common styles
- Follow the mobile-first approach
- Use responsive prefixes (sm:, md:, lg:, xl:)

### 2. Component Styling
- Use CSS modules for component-specific styles
- Follow BEM naming convention when needed
- Keep styles scoped to components

### 3. Theme Usage
- Use CSS variables for theme colors
- Implement dark mode using the `.dark` class
- Maintain consistent spacing and sizing

## Common Patterns

### 1. Layout Components
```tsx
<div className="flex min-h-screen flex-col">
  <header className="sticky top-0 z-50 w-full border-b">
    {/* Header content */}
  </header>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

### 2. Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid items */}
</div>
```

### 3. Theme-Aware Components
```tsx
<div className="bg-background text-foreground">
  {/* Theme-aware content */}
</div>
```

## Customization Guide

### 1. Adding New Colors
1. Add color variables to `globals.css`
2. Update `tailwind.config.js`
3. Use new colors in components

### 2. Creating New Components
1. Use existing shadcn/ui components as base
2. Extend with custom styles
3. Follow component documentation

### 3. Implementing Dark Mode
1. Use the `.dark` class for dark mode styles
2. Use theme variables for colors
3. Test both light and dark modes

## Troubleshooting

### Common Issues
1. **Style Conflicts**
   - Use more specific selectors
   - Check CSS specificity
   - Use `!important` sparingly

2. **Theme Issues**
   - Verify CSS variables
   - Check dark mode implementation
   - Ensure proper class application

3. **Responsive Design**
   - Verify breakpoints
   - Check mobile-first approach
   - Test on different devices

## Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Styling Guide](https://nextjs.org/docs/basic-features/built-in-css-support) 