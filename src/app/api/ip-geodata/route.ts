export const dynamic = "force-dynamic"

export type IpGeodata = { country: any }

export async function GET(request: Request) {
  return Response.json({
    country: request.headers.get("x-vercel-ip-country"),
  } satisfies IpGeodata)
}
