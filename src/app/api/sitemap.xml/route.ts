import { env } from "env"
import { GuildBase } from "types"

export async function GET() {
  const baseUrl = {
    development: "http://localhost:3000",
    test: "http://localhost:3000",
    production: "https://guild.xyz",
  }[process.env.NODE_ENV]

  const guilds: GuildBase[] = await fetch(
    `${env.NEXT_PUBLIC_API.replace("v1", "v2")}/guilds?sort=members&limit=1000`
  )
    .then((res) => res.json())
    .catch((_) => [])

  console.log("guilds")

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${guilds
        .map(
          (guild) => `
        <url>
          <loc>${baseUrl}/${guild.urlName}</loc>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>
      `
        )
        .join("")}
    </urlset>
  `

  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}
