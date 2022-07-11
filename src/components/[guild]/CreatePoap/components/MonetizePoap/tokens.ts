type TokenOption = {
  label: string
  value: string
  img: string
  coingeckoId?: string
}

const TOKENS: Record<number, TokenOption[]> = {
  // Mainnet
  1: [
    {
      label: "ETH",
      value: "0x0000000000000000000000000000000000000000",
      img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoId: "ethereum",
    },
    {
      label: "USDC",
      value: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      img: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      label: "USDT",
      value: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      img: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    },
  ],
  // Polygon
  137: [
    {
      label: "MATIC",
      value: "0x0000000000000000000000000000000000000000",
      img: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
      coingeckoId: "matic-network",
    },
    {
      label: "USDC",
      value: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      img: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      label: "USDT",
      value: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      img: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    },
  ],
  // Gnosis (xDAI)
  100: [
    {
      label: "xDAI",
      value: "0x0000000000000000000000000000000000000000",
      img: "https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492",
      coingeckoId: "xdai",
    },
    // {
    //   label: "USDC",
    //   value: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    //   img: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    // },
    // {
    //   label: "USDT",
    //   value: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6",
    //   img: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    // },
  ],
  // Binance
  56: [
    {
      label: "BNB",
      value: "0x0000000000000000000000000000000000000000",
      img: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
      coingeckoId: "binancecoin",
    },
    {
      label: "BUSD",
      value: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      img: "https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png",
    },
  ],
  // Görli
  5: [
    {
      label: "GörliETH",
      value: "0x0000000000000000000000000000000000000000",
      img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoId: "ethereum",
    },
  ],
}

export default TOKENS
export type { TokenOption }
