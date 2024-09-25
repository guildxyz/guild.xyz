import { GetLeaderboardResponse } from "@guildxyz/types"
import { env } from "env"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

export const dynamic = "force-dynamic"

const convertLeaderboardToCsv = ({
  leaderboard,
}: GetLeaderboardResponse): string => {
  if (leaderboard.length === 0) return ""
  const headers = Object.keys(leaderboard[0]).join(",") + "\n"
  const rows = leaderboard.map((item) => Object.values(item).join(",")).join("\n")
  return headers + rows
}

const searchParamsSchema = z.object({
  guildId: z.coerce.number().positive(),
  pointsId: z.coerce.number().positive(),
})

export async function GET(req: NextRequest) {
  try {
    const { guildId, pointsId } = searchParamsSchema.parse(
      Object.fromEntries(req.nextUrl.searchParams)
    )
    const leaderboardRequest = new URL(
      `/v2/guilds/${guildId}/points/${pointsId}/leaderboard?forceRecalculate=true`,
      env.NEXT_PUBLIC_API
    )

    const jsonResponse = await fetch(leaderboardRequest)
    if (!jsonResponse.ok) {
      throw new Error("failed to fetch leaderboard")
    }
    const jsonData = await jsonResponse.json()
    const csvData = convertLeaderboardToCsv(jsonData)

    return new Response(csvData, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="leaderboard-${guildId}-${pointsId}.csv"`,
        "Content-Type": "text/csv",
      },
    })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
