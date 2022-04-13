import got from "got"
import createMetascraper from "metascraper"
import metascraperDescription from "metascraper-description"
import metascraperImage from "metascraper-image"
import metascraperLogo from "metascraper-logo"
import metascraperTitle from "metascraper-title"

const metascraper = createMetascraper([
  metascraperLogo(),
  metascraperImage(),
  metascraperTitle(),
  metascraperDescription(),
])

const LINKS = [
  "https://www.cryptonary.com/how-guild-helps-you-organize-your-dao/",
  "https://guild.mirror.xyz/HGEontumXcZaf34MJFbdQ_gdNdMD_pNnStuempCdK-g",
  "https://www.daomasters.xyz/tools/guild",
  // "https://twitter.com/littlefortunes/status/1500516518970413067",
  "https://members.delphidigital.io/media/web3-is-a-shared-experience-reka-and-raz-co-founders-of-agora",
  // "https://twitter.com/guildxyz/status/1464208495809544195",
]

export default async function handler(_, res) {
  const data = await Promise.all(
    LINKS.map((link) =>
      got(link)
        .then(({ body: html, url }) => metascraper({ html, url }))
        .then((metadata) => ({ ...metadata, url: link }))
        .catch((_) => null)
    )
  )

  return res.json(data?.filter((linkData) => !!linkData) || [])
}
