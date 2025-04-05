import { apiRequest } from "@/lib/shared/api-helpers"

export async function GET() {
  return apiRequest("/boxes")
}

export async function POST(request: Request) {
  return apiRequest("/boxes", {
    method: "POST",
    body: await request.json(),
  })
}

