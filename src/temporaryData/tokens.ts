import _tokens from "./tokens.json"

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

const tokens = _tokens
  .filter(
    (_) =>
      Object.keys(_.platforms).length &&
      Object.keys(_.platforms).every((_) => !!_.length)
  )
  .map((token: CommunityToken, i) => ({
    id: -(i + 1),
    urlName: token.name.toLowerCase().split(" ").join("_"),
    name: token.name,
    description: "",
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
  }))

console.log(tokens[0].chainData)

export default tokens
