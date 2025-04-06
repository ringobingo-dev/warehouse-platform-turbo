# Migration Guide: 3D Box Viewer to SST + OpenNext

This document outlines the steps and considerations for migrating the 3D Box Viewer application from a client-side storage model to a serverless architecture using SST (Serverless Stack) and OpenNext, with PostgreSQL for structured data and MinIO/S3 for file storage.

## Current Architecture

The current application uses:
- Next.js for the frontend
- Client-side state management with React Context
- localStorage for data persistence
- In-memory operations for all data manipulations

## Target Architecture

The target architecture will use:
- SST + OpenNext for serverless deployment
- Next.js App Router for frontend and API routes
- PostgreSQL for structured data (rooms, boxes, logs, user preferences)
- MinIO/S3 for file storage (snapshot JSON files)
- Authentication and authorization for multi-user support

## Database Schema

### PostgreSQL Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

