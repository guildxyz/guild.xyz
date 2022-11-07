import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const {
        chainId,
        image,
        guildName,
        guildRoleName,
        guildRoleId,
        platform,
        signature,
        signatureMessage,
        barcode,
      } = req.body

      try {
        // Customize Pass
        let pass
        if (platform === "apple") {
          pass = {
            labelColor: "rgb(78,70,220)",
            backgroundColor: "rgb(39,39,41)",
            foregroundColor: "rgb(255,255,255)",
            description: `${guildName} Pass`,
            primaryFields: [
              {
                key: "primary1",
                label: "Guild",
                value: guildName,
                textAlignment: "PKTextAlignmentNatural",
              },
            ],
            secondaryFields: [
              {
                key: "secondary1",
                label: "Role",
                value: guildRoleName,
                textAlignment: "PKTextAlignmentLeft",
              },
              {
                key: "secondary2",
                label: "ID",
                value: guildRoleId,
                textAlignment: "PKTextAlignmentLeft",
              },
            ],
            auxiliaryFields: [],
            headerFields: [],
            backFields: [],
          }
        } else {
          pass = {
            messages: [],
          }
        }

        // Request to create pass
        const payload = await fetch("https://api.ethpass.xyz/api/v0/passes", {
          method: "POST",
          body: JSON.stringify({
            chain: {
              name: "evm",
              network: chainId,
            },
            image,
            pass,
            platform,
            signature,
            signatureMessage,
            barcode,
          }),
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": process.env.ETHPASS_API_KEY,
          }),
        })
        if (payload.status === 200) {
          const json = await payload.json()
          return res.status(200).json(json)
        } else {
          const json = await payload.json()
          return res.status(payload.status).send(json.message)
        }
      } catch (error) {
        return res.status(400).send(error.message)
      }

    default:
      res.setHeader("Allow", ["POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}
