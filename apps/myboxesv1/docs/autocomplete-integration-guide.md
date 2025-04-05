# AutocompleteInput Integration Guide

## Overview

This document provides instructions for integrating the AutocompleteInput component with the PostgreSQL database to enable real-time search suggestions for Customer Name and Variety Name fields.

## Component Features

The AutocompleteInput component provides:

1. Typeahead functionality that shows suggestions as the user types
2. Keyboard navigation (arrow up/down, enter to select, escape to close)
3. Loading state indicator
4. Support for custom styling and placeholder text
5. Accessibility features

## Current State

The component is currently configured for local development with client-side filtering of a static array of suggestions. For production, it needs to be connected to API endpoints that query the database.

## Integration Steps

### 1. Create API Endpoints

Create API endpoints for searching customers, varieties, and grades:

\`\`\`typescript
// app/api/search-customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  
  try {
    // Search for customers that match the query
    const customers = await prisma.customer.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive' // Case-insensitive search
        }
      },
      select: {
        name: true
      },
      take: 10 // Limit results
    });
    
    return NextResponse.json({
      results: customers.map(c => c.name)
    });
  } catch (error) {
    console.error('Error searching customers:', error);
    return NextResponse.json(
      { error: 'Failed to search customers' },
      { status: 500 }
    );
  }
}
\`\`\`

Similarly, create an endpoint for searching varieties:

\`\`\`typescript
// app/api/search-varieties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  
  try {
    // Search for varieties that match the query
    const varieties = await prisma.variety.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive' // Case-insensitive search
        }
      },
      select: {
        name: true
      },
      take: 10 // Limit results
    });
    
    return NextResponse.json({
      results: varieties.map(v => v.name)
    });
  } catch (error) {
    console.error('Error searching varieties:', error);
    return NextResponse.json(
      { error: 'Failed to search varieties' },
      { status: 500 }
    );
  }
}
\`\`\`

Create similar endpoints for grades if needed.

### 2. Update the AutocompleteInput Component

Update the `fetchSuggestions` function in the AutocompleteInput component to use the appropriate API endpoint based on the field type:

\`\`\`typescript
// Example of how to modify the component to support different endpoints
const fetchSuggestions = async (query: string, endpoint: string) => {
  setIsLoading(true)
  
  try {
    // Call the API endpoint to search
    const response = await fetch(`/api/${endpoint}?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    
    const data = await response.json();
    setFilteredSuggestions(data.results);
  } catch (error) {
    console.error(`Error fetching ${endpoint} suggestions:`, error);
    
    // Fallback to client-side filtering if API fails
    const filtered = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  } finally {
    setIsLoading(false);
  }
}
\`\`\`

Then in the BoxControls component, pass the appropriate endpoint:

\`\`\`typescript
<AutocompleteInput
  value={customerName}
  onChange={setCustomerName}
  onSelect={setCustomerName}
  suggestions={customerSuggestions}
  placeholder="Type to search customers"
  endpoint="search-customers"
  required
/>

<AutocompleteInput
  value={varietyName}
  onChange={setVarietyName}
  onSelect={setVarietyName}
  suggestions={varietySuggestions}
  placeholder="Type to search varieties"
  endpoint="search-varieties"
  required
/>
\`\`\`

### 3. Add Debouncing for Performance

To prevent too many API calls as the user types, add debouncing:

\`\`\`typescript
// Add this to the AutocompleteInput component
import { useDebounce } from '@/hooks/use-debounce';

// Inside the component:
const debouncedValue = useDebounce(inputValue, 300);

// Add this effect:
useEffect(() => {
  if (debouncedValue.trim()) {
    fetchSuggestions(debouncedValue);
  } else {
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  }
}, [debouncedValue]);

// And create the hook:
// hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

### 4. Testing

After integration:

1. Test that the autocomplete functionality works correctly for both Customer Name and Variety Name:
   - Type in each field and verify suggestions appear
   - Verify that selecting a suggestion sets the value correctly
   - Test with various query lengths and special characters

2. Test keyboard navigation:
   - Arrow up/down to navigate through suggestions
   - Enter to select a suggestion
   - Escape to close the suggestions dropdown

3. Test validation:
   - Verify that both fields are properly marked as required
   - Attempt to submit the form with empty fields and verify validation errors

## Troubleshooting

### Autocomplete Not Working

If the autocomplete functionality is not working:

1. Check the browser console for errors
2. Verify that the API endpoint is correctly implemented and returning data
3. Check that the debounce functionality is working correctly
4. Verify that the PostgreSQL query is correctly filtering customers or varieties

### Performance Issues

If the autocomplete is slow:

1. Check the database query performance and add appropriate indexes
2. Increase the debounce delay to reduce the number of API calls
3. Consider limiting the number of results returned

## Contact

For questions or issues during integration, contact:
- Development Team: dev@example.com
- Database Team: db@example.com

