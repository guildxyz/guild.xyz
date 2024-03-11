import {
  beraTestnet,
  bitfinityTestnet,
  blastMainnet,
  blastSepolia,
  bobaAvax,
  exosama,
  kava,
  lukso,
  neonEVM,
  oasisSapphire,
  ontology,
  palm,
  pgn,
  scrollAlpha,
  shimmer,
  taikoKatlaTestnet,
  x1Testnet,
} from "static/customChains"
import { Chain as ViemChain, http } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { createConfig } from "wagmi"
import {
  arbitrum,
  arbitrumNova,
  avalanche,
  base,
  baseGoerli,
  baseSepolia,
  boba,
  bsc,
  celo,
  cronos,
  evmos,
  fantom,
  gnosis,
  goerli,
  harmonyOne,
  linea,
  mainnet,
  manta,
  mantle,
  metis,
  moonbeam,
  moonriver,
  optimism,
  polygon,
  polygonMumbai,
  polygonZkEvm,
  ronin,
  scroll,
  scrollSepolia,
  sepolia,
  zetachainAthensTestnet,
  zkSync,
  zora,
} from "wagmi/chains"
import {
  coinbaseWallet,
  injected,
  mock,
  safe,
  walletConnect,
} from "wagmi/connectors"

// WAGMI 2 TODO: add all chains here
export const wagmiConfig = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
  connectors: process.env.NEXT_PUBLIC_MOCK_CONNECTOR
    ? [
        mock({
          accounts: [
            mnemonicToAccount(process.env.NEXT_PUBLIC_E2E_WALLET_MNEMONIC).address,
          ],
        }),
      ]
    : [
        injected(),
        coinbaseWallet({
          appName: "Guild.xyz",
        }),
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          showQrModal: true,
          qrModalOptions: {
            explorerRecommendedWalletIds: [
              "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX
              "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c", // Bitcoin.com
              "541d5dcd4ede02f3afaf75bf8e3e4c4f1fb09edb5fa6c4377ebf31c2785d9adf", // Ronin
              "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
            ],
            themeVariables: {
              "--wcm-z-index": "10001",
              "--w3m-z-index": "10001",
            } as any, // casting it, so `--wcm-z-index` is accepted
          },
        }),
        safe({
          allowedDomains: [/gnosis-safe\.io$/, /app\.safe\.global$/],
          debug: false,
        }),
        // TODO: CWaaS connector
      ],
})

// declare module "wagmi" {
//   interface Register {
//     config: typeof wagmiConfig
//   }
// }

type GuildChain = ViemChain & {
  iconUrl: string
  coinIconUrl: string
  blockExplorerIconUrl: {
    light: string
    dark: string
  }
  etherscanApiUrl?: string
}

const ETH_ICON =
  "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880"

const CHAIN_CONFIG: Record<Chain, GuildChain> = {
  ETHEREUM: {
    ...mainnet,
    iconUrl: "/networkLogos/ethereum.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    etherscanApiUrl: "https://api.etherscan.io",
  },
  SEPOLIA: {
    ...sepolia,
    iconUrl: "/networkLogos/ethereum.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    etherscanApiUrl: "https://api-sepolia.etherscan.io",
  },
  GOERLI: {
    ...goerli,
    iconUrl: "/networkLogos/ethereum.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    etherscanApiUrl: "https://api-goerli.etherscan.io",
  },
  BSC: {
    ...bsc,
    iconUrl: "/networkLogos/bsc.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png",
    blockExplorerIconUrl: {
      light: "/explorerLogos/bscscan-light.svg",
      dark: "/explorerLogos/bscscan-dark.svg",
    },
    etherscanApiUrl: "https://api.bscscan.com",
  },
  POLYGON: {
    ...polygon,
    iconUrl: "/networkLogos/polygon.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    etherscanApiUrl: "https://api.polygonscan.com",
  },
  POLYGON_ZKEVM: {
    ...polygonZkEvm,
    iconUrl: "/networkLogos/polygon.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
  },
  POLYGON_MUMBAI: {
    ...polygonMumbai,
    iconUrl: "/networkLogos/polygon.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    etherscanApiUrl: "https://api-testnet.polygonscan.com",
  },
  AVALANCHE: {
    ...avalanche,
    iconUrl: "/networkLogos/avalanche.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png",
    blockExplorerIconUrl: {
      light: "/explorerLogos/snowtrace.svg",
      dark: "/explorerLogos/snowtrace.svg",
    },
    etherscanApiUrl: "https://api.snowtrace.io",
  },
  GNOSIS: {
    ...gnosis,
    iconUrl: "/networkLogos/gnosis.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/11062/small/xdai.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/gnosis.svg",
      dark: "/networkLogos/gnosis.svg",
    },
    etherscanApiUrl: "https://api.gnosisscan.io",
  },
  FANTOM: {
    ...fantom,
    iconUrl: "/networkLogos/fantom.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/4001/small/Fantom.png",
    blockExplorerIconUrl: {
      light: "/explorerLogos/ftmscan.svg",
      dark: "/networkLogos/fantom.svg",
    },
    etherscanApiUrl: "https://api.ftmscan.com",
  },
  ARBITRUM: {
    ...arbitrum,
    iconUrl: "/networkLogos/arbitrum.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/arbitrum.svg",
      dark: "/networkLogos/arbitrum.svg",
    },
    etherscanApiUrl: "https://api.arbiscan.io",
  },
  NOVA: {
    ...arbitrumNova,
    iconUrl: "/networkLogos/nova.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/nova.svg",
      dark: "/networkLogos/nova.svg",
    },
    etherscanApiUrl: "https://api-nova.arbiscan.io",
  },
  CELO: {
    ...celo,
    iconUrl: "/networkLogos/celo.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/celo.svg",
      dark: "/networkLogos/celo.svg",
    },
    etherscanApiUrl: "https://explorer.celo.org",
  },
  HARMONY: {
    ...harmonyOne,
    iconUrl: "/networkLogos/harmony.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/harmony.svg",
      dark: "/networkLogos/harmony.svg",
    },
  },
  OPTIMISM: {
    ...optimism,
    iconUrl: "/networkLogos/optimism.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/optimism.svg",
      dark: "/networkLogos/optimism.svg",
    },
    etherscanApiUrl: "https://api-optimistic.etherscan.io",
  },
  MOONBEAM: {
    ...moonbeam,
    iconUrl: "/networkLogos/moonbeam.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/22459/small/glmr.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/moonbeam.svg",
      dark: "/networkLogos/moonbeam.svg",
    },
    etherscanApiUrl: "https://api-moonbeam.moonscan.io",
  },
  MOONRIVER: {
    ...moonriver,
    iconUrl: "/networkLogos/moonriver.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/17984/small/9285.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/moonriver.svg",
      dark: "/networkLogos/moonriver.svg",
    },
    etherscanApiUrl: "https://api-moonriver.moonscan.io",
  },
  METIS: {
    ...metis,
    iconUrl: "/networkLogos/metis.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/15595/small/metis.PNG",
    blockExplorerIconUrl: {
      light: "/networkLogos/metis.svg",
      dark: "/explorerLogos/metis-dark.svg",
    },
    etherscanApiUrl: "https://andromeda-explorer.metis.io",
  },
  CRONOS: {
    ...cronos,
    iconUrl: "/networkLogos/cronos.svg",
    coinIconUrl:
      "https://assets.coingecko.com/coins/images/7310/small/oCw2s3GI_400x400.jpeg",
    blockExplorerIconUrl: {
      light: "/networkLogos/cronos.svg",
      dark: "/explorerLogos/cronos-dark.svg",
    },
    etherscanApiUrl: "https://cronos.org/explorer",
  },
  BOBA: {
    ...boba,
    iconUrl: "/networkLogos/boba.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/explorerLogos/boba-light.svg",
      dark: "/networkLogos/boba.svg",
    },
    etherscanApiUrl: "https://api.bobascan.com",
  },
  BOBA_AVAX: {
    ...bobaAvax,
    iconUrl: "/networkLogos/boba.svg",
    coinIconUrl: "https://assets.coingecko.com/coins/images/20285/small/BOBA.png",
    blockExplorerIconUrl: {
      light: "/explorerLogos/boba-light.svg",
      dark: "/networkLogos/boba.svg",
    },
    etherscanApiUrl: "https://blockexplorer.avax.boba.network",
  },
  PALM: {
    ...palm,
    iconUrl: "/networkLogos/palm.png",
    coinIconUrl: "/networkLogos/palm.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/palm.png",
      dark: "/networkLogos/palm.png",
    },
    etherscanApiUrl: "https://explorer.palm.io",
  },
  BASE_MAINNET: {
    ...base,
    iconUrl: "/networkLogos/base.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/base.svg",
      dark: "/networkLogos/base.svg",
    },
    etherscanApiUrl: "https://api.basescan.org",
  },
  BASE_GOERLI: {
    ...baseGoerli,
    iconUrl: "/networkLogos/base.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/base.svg",
      dark: "/networkLogos/base.svg",
    },
    etherscanApiUrl: "https://api-goerli.basescan.org",
  },
  BASE_SEPOLIA: {
    ...baseSepolia,
    iconUrl: "/networkLogos/base.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/base.svg",
      dark: "/networkLogos/base.svg",
    },
    etherscanApiUrl: "https://api-sepolia.basescan.org",
  },
  EXOSAMA: {
    ...exosama,
    iconUrl: "/networkLogos/exosama.png",
    coinIconUrl:
      "https://raw.githubusercontent.com/nico-ma1/Exosama-Network-Brand/main/sama-token%403x.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/exosama.png",
      dark: "/networkLogos/exosama.png",
    },
    etherscanApiUrl: "https://explorer.exosama.com",
  },
  EVMOS: {
    ...evmos,
    rpcUrls: {
      default: {
        http: ["https://evmos.lava.build"],
      },
      public: {
        http: ["https://evmos.lava.build"],
      },
    },
    iconUrl: "/networkLogos/evmos.svg",
    coinIconUrl: "/networkLogos/evmos.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/evmos.svg",
      dark: "/networkLogos/evmos.svg",
    },
  },
  ZETACHAIN_ATHENS: {
    ...zetachainAthensTestnet,
    iconUrl: "/networkLogos/zetachain.svg",
    coinIconUrl: "https://explorer.zetachain.com/img/logos/zeta-logo.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/zetachain.svg",
      dark: "/networkLogos/zetachain.svg",
    },
  },
  SCROLL_ALPHA: {
    ...scrollAlpha,
    iconUrl: "/networkLogos/scroll.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/scroll.svg",
      dark: "/networkLogos/scroll.svg",
    },
  },
  SCROLL_SEPOLIA: {
    ...scrollSepolia,
    iconUrl: "/networkLogos/scroll.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/scroll.svg",
      dark: "/networkLogos/scroll.svg",
    },
  },
  SCROLL: {
    ...scroll,
    iconUrl: "/networkLogos/scroll.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/scroll.svg",
      dark: "/networkLogos/scroll.svg",
    },
  },
  ZKSYNC_ERA: {
    ...zkSync,
    iconUrl: "/networkLogos/zksync-era.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/zksync-era.svg",
      dark: "/networkLogos/zksync-era.svg",
    },
  },
  ZORA: {
    ...zora,
    iconUrl: "/networkLogos/zora.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/zora.svg",
      dark: "/networkLogos/zora.svg",
    },
  },
  PGN: {
    ...pgn,
    iconUrl: "/networkLogos/pgn.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/pgn-light.svg",
      dark: "/networkLogos/pgn.svg",
    },
  },
  NEON_EVM: {
    ...neonEVM,
    iconUrl: "/networkLogos/neon.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/explorerLogos/neonscan.svg",
      dark: "/explorerLogos/neonscan.svg",
    },
  },
  LINEA: {
    ...linea,
    iconUrl: "/networkLogos/linea.png",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/linea.png",
      dark: "/networkLogos/linea.png",
    },
  },
  LUKSO: {
    ...lukso,
    iconUrl: "/networkLogos/lukso.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/lukso.svg",
      dark: "/networkLogos/lukso.svg",
    },
  },
  MANTLE: {
    ...mantle,
    iconUrl: "/networkLogos/mantle.svg",
    coinIconUrl: "/networkLogos/mantle.svg",
    blockExplorerIconUrl: {
      light: "/explorerLogos/mantle-light.svg",
      dark: "/networkLogos/mantle.svg",
    },
  },
  RONIN: {
    ...ronin,
    iconUrl: "/networkLogos/ronin.svg",
    coinIconUrl: "/networkLogos/ronin.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/ronin.svg",
      dark: "/networkLogos/ronin.svg",
    },
  },
  SHIMMER: {
    ...shimmer,
    iconUrl: "/networkLogos/shimmer.svg",
    coinIconUrl: "/networkLogos/shimmer.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/shimmer.svg",
      dark: "/networkLogos/shimmer.svg",
    },
  },
  KAVA: {
    ...kava,
    iconUrl: "/networkLogos/kava.svg",
    coinIconUrl: "/networkLogos/kava.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/kava.svg",
      dark: "/networkLogos/kava.svg",
    },
  },
  BITFINITY_TESTNET: {
    ...bitfinityTestnet,
    iconUrl: "/networkLogos/bitfinity.svg",
    coinIconUrl: "/networkLogos/bitfinity.svg",
    blockExplorerIconUrl: {
      light: "/explorerLogos/bitfinity-light.svg",
      dark: "/explorerLogos/bitfinity.svg",
    },
  },
  X1_TESTNET: {
    ...x1Testnet,
    iconUrl: "/walletLogos/okx.png",
    coinIconUrl: "/walletLogos/okx.png",
    blockExplorerIconUrl: {
      light: "/walletLogos/okx.png",
      dark: "/walletLogos/okx.png",
    },
  },
  ONTOLOGY: {
    ...ontology,
    iconUrl: "/networkLogos/ontology.svg",
    coinIconUrl: "/networkLogos/ontology.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/ontology.svg",
      dark: "/networkLogos/ontology.svg",
    },
  },
  BERA_TESTNET: {
    ...beraTestnet,
    iconUrl: "/networkLogos/berachain.png",
    coinIconUrl: "/networkLogos/berachain.png",
    blockExplorerIconUrl: {
      light: "/networkLogos/berachain.png",
      dark: "/networkLogos/berachain.png",
    },
  },
  MANTA: {
    ...manta,
    iconUrl: "/networkLogos/manta.png",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/manta.png",
      dark: "/networkLogos/manta.png",
    },
  },
  TAIKO_KATLA: {
    ...taikoKatlaTestnet,
    iconUrl: "/networkLogos/taiko-katla.svg",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/taiko-katla.svg",
      dark: "/networkLogos/taiko-katla.svg",
    },
  },
  BLAST_SEPOLIA: {
    ...blastSepolia,
    iconUrl: "/networkLogos/blast.png",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/blast.png",
      dark: "/networkLogos/blast.png",
    },
  },
  BLAST_MAINNET: {
    ...blastMainnet,
    iconUrl: "/networkLogos/blast.png",
    coinIconUrl: ETH_ICON,
    blockExplorerIconUrl: {
      light: "/networkLogos/blast.png",
      dark: "/networkLogos/blast.png",
    },
  },
  OASIS_SAPPHIRE: {
    ...oasisSapphire,
    iconUrl: "/networkLogos/oasis-sapphire.svg",
    coinIconUrl: "/networkLogos/oasis-sapphire.svg",
    blockExplorerIconUrl: {
      light: "/networkLogos/oasis-sapphire.svg",
      dark: "/networkLogos/oasis-sapphire.svg",
    },
  },
}

enum Chains {
  ETHEREUM = mainnet.id,
  BSC = bsc.id,
  POLYGON = polygon.id,
  AVALANCHE = avalanche.id,
  GNOSIS = gnosis.id,
  FANTOM = fantom.id,
  ARBITRUM = arbitrum.id,
  NOVA = arbitrumNova.id,
  CELO = celo.id,
  HARMONY = harmonyOne.id,
  OPTIMISM = optimism.id,
  MOONBEAM = moonbeam.id,
  MOONRIVER = moonriver.id,
  METIS = metis.id,
  CRONOS = cronos.id,
  BOBA = boba.id,
  BOBA_AVAX = bobaAvax.id,
  PALM = palm.id,
  BASE_GOERLI = baseGoerli.id,
  BASE_SEPOLIA = baseSepolia.id,
  EXOSAMA = exosama.id,
  EVMOS = evmos.id,
  ZETACHAIN_ATHENS = zetachainAthensTestnet.id,
  SCROLL_ALPHA = scrollAlpha.id,
  SCROLL_SEPOLIA = scrollSepolia.id,
  SCROLL = scroll.id,
  ZKSYNC_ERA = zkSync.id,
  SEPOLIA = sepolia.id,
  GOERLI = goerli.id,
  POLYGON_MUMBAI = polygonMumbai.id,
  BASE_MAINNET = base.id,
  ZORA = zora.id,
  POLYGON_ZKEVM = polygonZkEvm.id,
  PGN = pgn.id,
  NEON_EVM = neonEVM.id,
  LINEA = linea.id,
  LUKSO = lukso.id,
  MANTLE = mantle.id,
  RONIN = ronin.id,
  SHIMMER = shimmer.id,
  KAVA = kava.id,
  BITFINITY_TESTNET = bitfinityTestnet.id,
  X1_TESTNET = x1Testnet.id,
  ONTOLOGY = ontology.id,
  BERA_TESTNET = beraTestnet.id,
  MANTA = manta.id,
  TAIKO_KATLA = taikoKatlaTestnet.id,
  BLAST_SEPOLIA = blastSepolia.id,
  BLAST_MAINNET = blastMainnet.id,
  OASIS_SAPPHIRE = oasisSapphire.id,
}

export type Chain = keyof typeof Chains

const supportedChains = Object.keys(CHAIN_CONFIG) as Chain[]

export { CHAIN_CONFIG, Chains, supportedChains }
