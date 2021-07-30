import _tokens from "./tokens.json"
import { Community } from "./types"

type CommunityToken = {
  name: string
  description: string
  symbol: string
  image: string
  marketcap: number
  platforms: {
    [network: string]: string
  }
}

const tokens: Community[] = _tokens
  .filter(
    (_) =>
      Object.keys(_.platforms).length &&
      Object.keys(_.platforms).every((_) => !!_.length)
  )
  .map(
    (token: CommunityToken, i): Community => ({
      id: -(i + 1),
      urlName: `${token.symbol.toLowerCase()}_token`,
      name: token.name,
      description: token.description,
      imageUrl: token.image,
      themeColor: "#FFFFFF",
      marketcap: token.marketcap,
      chainData: Object.keys(token.platforms).map((network) => ({
        name: network,
        token: {
          address: token.platforms[network],
          name: token.name,
          symbol: token.symbol,
          decimals: 18,
        },
      })),
      communityPlatforms: [],
      levels: [],
      capacity: null,
    })
  )

export default tokens
