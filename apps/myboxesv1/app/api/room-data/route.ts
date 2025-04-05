/**
 * API Route: /api/room-data
 *
 * Purpose: Fetches unique customer names, variety names, and grades from boxes in a specific room
 * This helps standardize data entry by showing existing values in dropdowns
 *
 * Query Parameters:
 * - roomId: The ID of the room to fetch data for
 *
 * Returns:
 * - JSON object with arrays of customers, varieties, and grades
 *
 * Error Handling:
 * - Returns 400 if roomId is missing
 * - Returns 500 if database query fails
 *
 * INTEGRATION NOTES:
 * ==================
 * This is currently using mock data for local development.
 * The integration team needs to:
 *
 * 1. Uncomment the Prisma client initialization when migrating to PostgreSQL
 * 2. Uncomment the database query code in the try block
 * 3. Update the error handling to use proper logging
 * 4. Remove the mock data return in production
 */

import { NextResponse } from "next/server"
// import { PrismaClient } from '@prisma/client';

// INTEGRATION STEP 1: Uncomment this when migrating to PostgreSQL
// const prisma = new PrismaClient();

// Mock data to use until database integration is complete
const mockData = {
  customers: ["Customer A", "Customer B", "Customer C", "Acme Corp", "Global Fruits"],
  varieties: ["Variety X", "Variety Y", "Variety Z", "Red Delicious", "Granny Smith", "Golden"],
  grades: ["Premium", "Standard", "Economy", "A", "B", "C", "Extra Fancy"],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get("roomId")

  if (!roomId) {
    return NextResponse.json({ error: "Room ID is required" }, { status: 400 })
  }

  try {
    // INTEGRATION STEP 2: Uncomment this database query code when migrating to PostgreSQL
    /*
    // Get unique customer names from boxes in this room
    const customers = await prisma.box.findMany({
      where: { roomId },
      select: { customerName: true },
      distinct: ['customerName'],
    });

    // Get unique variety names from boxes in this room
    const varieties = await prisma.box.findMany({
      where: { roomId },
      select: { varietyName: true },
      distinct: ['varietyName'],
    });

    // Get unique grades from boxes in this room
    const grades = await prisma.box.findMany({
      where: { roomId },
      select: { grade: true },
      distinct: ['grade'],
    });

    return NextResponse.json({
      customers: customers.map(c => c.customerName),
      varieties: varieties.map(v => v.varietyName),
      grades: grades.map(g => g.grade),
    });
    */

    // TEMPORARY: Return mock data until database integration is complete
    // INTEGRATION STEP 3: Remove this and use the database query above
    console.log("Using mock data for room:", roomId)
    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching room data:", error)

    // INTEGRATION STEP 4: Implement proper error logging here

    // Return mock data even in error case for development
    return NextResponse.json(
      {
        error: "Failed to fetch room data",
        customers: mockData.customers,
        varieties: mockData.varieties,
        grades: mockData.grades,
      },
      { status: 500 },
    )
  }
}

