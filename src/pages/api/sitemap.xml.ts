import { GuildBase } from "types"
import fetcher from "utils/fetcher"

export default async function handler(_, res) {
  const baseUrl = {
    development: "http://localhost:3000",
    production: "https://guild.xyz",
  }[process.env.NODE_ENV]

  const guilds = await fetcher(`/v2/guilds?sort=members`).catch((_) => [])

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${guilds
        .map(
          (guild: GuildBase) => `
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

  res.setHeader("Content-Type", "text/xml")
  res.write(sitemap)
  res.end()
}
