import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const { data } = req.query

      try {
        const payload = await fetch(
          `${
            process.env.API_HOST || "https://api.ethpass.xyz"
          }/api/v0/scan/?data=${data}`,
          {
            method: "GET",
            headers: new Headers({
              "content-type": "application/json",
              "x-api-key": process.env.ETHPASS_API_KEY,
            }),
          }
        )

        if (payload.status === 200) {
          let json = await payload.json()
          const { guildId, guildName, roleId, roleName } = JSON.parse(json.message)

          // Check role access
          const response = await fetch(
            `https://api.guild.xyz/v1/guild/access/${guildId}/${json.ownerAddress}`
          ).then((role) => role.json())
          const hasAccess = roleId
            ? response.find?.((role) => role.roleId === roleId)?.access
            : response.some?.(({ access }) => access)

          // Check membership
          const memberships = await fetch(
            `https://api.guild.xyz/v1/user/membership/${json.ownerAddress}`
          ).then((member) => member.json())
          if (guildId === undefined || memberships === undefined) return undefined
          const isMember = memberships.some(
            (_) => _.guildId === guildId && _.roleIds?.length
          )

          // Add guild fields
          json = { ...json, guildId, guildName, roleId, roleName }

          if (hasAccess && isMember) {
            return res.status(200).json(json)
          } else {
            throw Error("Invalid Pass")
          }
        } else {
          const json = await payload.json()
          return res.status(payload.status).send(json.message)
        }
      } catch (err) {
        return res.status(400).send(err.message)
      }

    default:
      res.setHeader("Allow", ["GET"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}
