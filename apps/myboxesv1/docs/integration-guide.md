# BoxControls Integration Guide

## Overview

This document provides instructions for integrating the BoxControls component into the production environment with PostgreSQL database support.

## Current State

The component is currently configured for local development with mock data. The Prisma client is disabled, and API endpoints return hardcoded mock data.

## Integration Steps

### 1. API Route Integration

In `app/api/room-data/route.ts`:

1. Uncomment the Prisma client import and initialization
2. Uncomment the database query code in the try block
3. Remove the mock data return in production
4. Implement proper error logging

```typescript
// BEFORE (development):
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// AFTER (production):
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

