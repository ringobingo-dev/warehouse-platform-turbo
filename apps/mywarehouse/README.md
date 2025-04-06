# myWarehouse - Agricultural Storage Management Platform

## AWS Integration Guide

This guide explains how to set up and deploy the myWarehouse application for both local development and AWS environments.

### Technology Stack

- **Frontend Framework**: Serverless Stack (SST) + OpenNext
- **State Management**: Zustand (lightweight global state) + SWR (data fetching/caching)
- **Authentication**: WorkOS (SSO, MFA, SAML, enterprise-ready)
- **3D Visualization**: React Three Fiber (Three.js wrapper)
- **Styling**: v0.dev + Tailwind CSS
- **Backend Integrations**: Python Lambdas, DynamoDB (tracking), S3 (spatial indexes), PostgreSQL (Aurora)

### Environment Setup

#### Local Development

1. Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local

