import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { Web3ReactHooks } from "@web3-react/core"
import { GnosisSafe } from "@web3-react/gnosis-safe"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect-v2"
import initializeCoinbaseWalletConnector from "./coinbaseWallet"
import initializeGnosisConnector from "./gnosis"
import initializeMetaMaskConnector from "./metaMask"
import initializeWalletConnectConnector from "./walletConnect"

enum Chains {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
  AVALANCHE = 43114,
  GNOSIS = 100,
  FANTOM = 250,
  ARBITRUM = 42161,
  NOVA = 42170,
  CELO = 42220,
  HARMONY = 1666600000,
  OPTIMISM = 10,
  MOONBEAM = 1284,
  MOONRIVER = 1285,
  METIS = 1088,
  CRONOS = 25,
  BOBA = 288,
  BOBA_AVAX = 43288,
  PALM = 11297108109,
  BASE_GOERLI = 84531,
  EXOSAMA = 2109,
  EVMOS = 9001,
  ZETACHAIN_ATHENS = 7001,
  SCROLL_ALPHA = 534353,
  ZKSYNC_ERA = 324,
  SEPOLIA = 11155111,
  GOERLI = 5,
  POLYGON_MUMBAI = 80001,
}

export type Chain = keyof typeof Chains

type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
  address: string
  logoURI: string
}

type RpcConfig = Record<
  Chain,
  {
    chainId: number
    chainName: string
    nativeCurrency: NativeCurrency
    blockExplorerUrls: string[]
    blockExplorerIcons: {
      light: string
      dark: string
    }
    apiUrl?: string
    iconUrls: string[]
    rpcUrls: string[]
    multicallAddress?: string
  }
>

const RPC: RpcConfig = {
  ETHEREUM: {
    chainId: 1,
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenForm component
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://etherscan.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    apiUrl: "https://api.etherscan.io",
    iconUrls: ["/networkLogos/ethereum.svg"],
    rpcUrls: [
      process.env.MAINNET_ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.MAINNET_ALCHEMY_KEY}`
        : "https://cloudflare-eth.com",
    ],
    multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  BSC: {
    chainId: 56,
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    },
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    blockExplorerIcons: {
      light: "/explorerLogos/bscscan-light.svg",
      dark: "/explorerLogos/bscscan-dark.svg",
    },
    apiUrl: "https://api.bscscan.com",
    iconUrls: ["/networkLogos/bsc.svg"],
    multicallAddress: "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c",
  },
  POLYGON: {
    chainId: 137,
    chainName: "Polygon",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    rpcUrls: [
      process.env.POLYGON_ALCHEMY_KEY
        ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_KEY}`
        : "https://polygon-rpc.com",
    ],
    blockExplorerUrls: ["https://polygonscan.com"],
    blockExplorerIcons: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    apiUrl: "https://api.polygonscan.com",
    iconUrls: ["/networkLogos/polygon.svg"],
    multicallAddress: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
  },
  AVALANCHE: {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/snowtrace.svg",
      dark: "/explorerLogos/snowtrace.svg",
    },
    apiUrl: "https://api.snowtrace.io",
    iconUrls: ["/networkLogos/avalanche.svg"],
    multicallAddress: "0x98e2060F672FD1656a07bc12D7253b5e41bF3876",
  },
  GNOSIS: {
    chainId: 100,
    chainName: "Gnosis Chain",
    nativeCurrency: {
      name: "Gnosis",
      symbol: "Gnosis",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492",
    },
    rpcUrls: ["https://rpc.gnosischain.com"],
    blockExplorerUrls: ["https://gnosisscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/gnosis.svg",
      dark: "/networkLogos/gnosis.svg",
    },
    apiUrl: "https://api.gnosisscan.io",
    iconUrls: ["/networkLogos/gnosis.svg"],
    multicallAddress: "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a",
  },
  FANTOM: {
    chainId: 250,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
    },
    rpcUrls: ["https://rpc.ftm.tools"],
    blockExplorerUrls: ["https://ftmscan.com"],
    blockExplorerIcons: {
      light: "/explorerLogos/ftmscan.svg",
      dark: "/networkLogos/fantom.svg",
    },
    apiUrl: "https://api.ftmscan.com",
    iconUrls: ["/networkLogos/fantom.svg"],
    multicallAddress: "0xD98e3dBE5950Ca8Ce5a4b59630a5652110403E5c",
  },
  ARBITRUM: {
    chainId: 42161,
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: [
      process.env.ARBITRUM_ALCHEMY_KEY
        ? `https://arb-mainnet.g.alchemy.com/v2/${process.env.ARBITRUM_ALCHEMY_KEY}`
        : "https://arbitrum.public-rpc.com",
    ],
    blockExplorerUrls: ["https://arbiscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/arbitrum.svg",
      dark: "/networkLogos/arbitrum.svg",
    },
    apiUrl: "https://api.arbiscan.io",
    iconUrls: ["/networkLogos/arbitrum.svg"],
    multicallAddress: "0x52bfe8fE06c8197a8e3dCcE57cE012e13a7315EB",
  },
  NOVA: {
    chainId: 42170,
    chainName: "Arbitrum Nova",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://nova.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://nova.arbiscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/nova.svg",
      dark: "/networkLogos/nova.svg",
    },
    apiUrl: "https://api-nova.arbiscan.io",
    iconUrls: ["/networkLogos/nova.svg"],
    multicallAddress: "0x5e1eE626420A354BbC9a95FeA1BAd4492e3bcB86",
  },
  CELO: {
    chainId: 42220,
    chainName: "Celo Mainnet",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png?1592293590",
    },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
    blockExplorerIcons: {
      light: "/networkLogos/celo.svg",
      dark: "/networkLogos/celo.svg",
    },
    apiUrl: "https://explorer.celo.org",
    iconUrls: ["/networkLogos/celo.svg"],
    multicallAddress: "0xb74C3A8108F1534Fc0D9b776A9B487c84fe8eD06",
  },
  HARMONY: {
    chainId: 1666600000,
    chainName: "Harmony",
    nativeCurrency: {
      name: "Harmony",
      symbol: "ONE",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4344/small/Y88JAze.png?1565065793",
    },
    rpcUrls: ["https://api.harmony.one"],
    blockExplorerUrls: ["https://explorer.harmony.one"],
    blockExplorerIcons: {
      light: "/networkLogos/harmony.svg",
      dark: "/networkLogos/harmony.svg",
    },
    iconUrls: ["/networkLogos/harmony.svg"],
    multicallAddress: "0x34b415f4d3b332515e66f70595ace1dcf36254c5",
  },
  OPTIMISM: {
    chainId: 10,
    chainName: "Optimism",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/optimism.svg",
      dark: "/networkLogos/optimism.svg",
    },
    apiUrl: "https://api-optimistic.etherscan.io",
    iconUrls: ["/networkLogos/optimism.svg"],
    rpcUrls: ["https://optimism.publicnode.com"],
    multicallAddress: "0x2DC0E2aa608532Da689e89e237dF582B783E552C",
  },
  MOONBEAM: {
    chainId: 1284,
    chainName: "Moonbeam",
    nativeCurrency: {
      name: "Moonbeam",
      symbol: "GLMR",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000", // needed for proper form handling in the TokenForm component
      logoURI:
        "https://assets.coingecko.com/coins/images/22459/small/glmr.png?1641880985",
    },
    blockExplorerUrls: ["https://moonbeam.moonscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/moonbeam.svg",
      dark: "/networkLogos/moonbeam.svg",
    },
    apiUrl: "https://api-moonbeam.moonscan.io",
    iconUrls: ["/networkLogos/moonbeam.svg"],
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    multicallAddress: "0x83e3b61886770de2F64AAcaD2724ED4f08F7f36B",
  },
  MOONRIVER: {
    chainId: 1285,
    chainName: "Moonriver",
    nativeCurrency: {
      name: "Moonriver",
      symbol: "MOVR",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/17984/small/9285.png?1630028620",
    },
    blockExplorerUrls: ["https://moonriver.moonscan.io"],
    blockExplorerIcons: {
      light: "/networkLogos/moonriver.svg",
      dark: "/networkLogos/moonriver.svg",
    },
    apiUrl: "https://api-moonriver.moonscan.io",
    iconUrls: ["/networkLogos/moonriver.svg"],
    rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
    multicallAddress: "0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5",
  },
  METIS: {
    chainId: 1088,
    chainName: "Metis Andromeda",
    nativeCurrency: {
      name: "Metis",
      symbol: "METIS",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/15595/small/metis.PNG?1621298076",
    },
    blockExplorerUrls: ["https://andromeda-explorer.metis.io"],
    blockExplorerIcons: {
      light: "/networkLogos/metis.svg",
      dark: "/explorerLogos/metis-dark.svg",
    },
    apiUrl: "https://andromeda-explorer.metis.io",
    iconUrls: ["/networkLogos/metis.svg"],
    rpcUrls: ["https://andromeda.metis.io/?owner=1088"],
    multicallAddress: "0x1a2AFb22B8A90A77a93e80ceA61f89D04e05b796",
  },
  CRONOS: {
    chainId: 25,
    chainName: "Cronos Mainnet",
    nativeCurrency: {
      name: "Cronos",
      symbol: "CRO",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/7310/small/oCw2s3GI_400x400.jpeg?1645172042",
    },
    blockExplorerUrls: ["https://cronos.org/explorer"],
    blockExplorerIcons: {
      light: "/networkLogos/cronos.svg",
      dark: "/explorerLogos/cronos-dark.svg",
    },
    apiUrl: "https://cronos.org/explorer",
    iconUrls: ["/networkLogos/cronos.svg"],
    rpcUrls: ["https://evm.cronos.org"],
    multicallAddress: "0x0fA4d452693F2f45D28c4EC4d20b236C4010dA74",
  },
  BOBA: {
    chainId: 288,
    chainName: "Boba Network",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://blockexplorer.boba.network"],
    blockExplorerIcons: {
      light: "/explorerLogos/boba-light.svg",
      dark: "/networkLogos/boba.svg",
    },
    apiUrl: "https://api.bobascan.com",
    iconUrls: ["/networkLogos/boba.svg"],
    rpcUrls: ["https://mainnet.boba.network"],
    multicallAddress: "0xbe2Be647F8aC42808E67431B4E1D6c19796bF586",
  },
  BOBA_AVAX: {
    chainId: 43288,
    chainName: "Boba-Avax L2",
    nativeCurrency: {
      name: "Boba",
      symbol: "BOBA",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/20285/small/BOBA.png?1636811576",
    },
    blockExplorerUrls: ["https://blockexplorer.avax.boba.network"],
    blockExplorerIcons: {
      light: "/explorerLogos/boba-light.svg",
      dark: "/networkLogos/boba.svg",
    },
    apiUrl: "https://blockexplorer.avax.boba.network",
    iconUrls: ["/networkLogos/boba.svg"],
    rpcUrls: ["https://avax.boba.network"],
    multicallAddress: "0x352E11Da7C12EA2440b079A335E67ff9219f6FfB",
  },
  PALM: {
    chainId: 11297108109,
    chainName: "Palm",
    nativeCurrency: {
      name: "Palm",
      symbol: "PALM",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "/networkLogos/palm.png",
    },
    blockExplorerUrls: ["https://explorer.palm.io"],
    blockExplorerIcons: {
      light: "/networkLogos/palm.png",
      dark: "/networkLogos/palm.png",
    },
    apiUrl: "https://explorer.palm.io",
    iconUrls: ["/networkLogos/palm.png"],
    rpcUrls: ["https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b"],
    multicallAddress: "0xfFE2FF36c5b8D948f788a34f867784828aa7415D",
  },
  BASE_GOERLI: {
    chainId: 84531,
    chainName: "Base Testnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    blockExplorerUrls: ["https://goerli.basescan.org"],
    blockExplorerIcons: {
      light: "/networkLogos/base.svg",
      dark: "/networkLogos/base.svg",
    },
    apiUrl: "https://api-goerli.basescan.org",
    iconUrls: ["/networkLogos/base.svg"],
    rpcUrls: ["https://goerli.base.org"],
    multicallAddress: "",
  },
  EXOSAMA: {
    chainId: 2109,
    chainName: "Exosama Network",
    nativeCurrency: {
      name: "Moonsama",
      symbol: "SAMA",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://raw.githubusercontent.com/nico-ma1/Exosama-Network-Brand/main/sama-token%403x.png",
    },
    blockExplorerUrls: ["https://explorer.exosama.com"],
    blockExplorerIcons: {
      light: "/networkLogos/exosama.png",
      dark: "/networkLogos/exosama.png",
    },
    apiUrl: "https://explorer.exosama.com",
    iconUrls: ["/networkLogos/exosama.png"],
    rpcUrls: ["https://rpc.exosama.com"],
    multicallAddress: "0x2feFC828e2fEfdE0C9f7740919c6A9139F886067",
  },
  EVMOS: {
    chainId: 9001,
    chainName: "Evmos",
    nativeCurrency: {
      name: "Evmos",
      symbol: "EVMOS",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "/networkLogos/evmos.svg",
    },
    blockExplorerUrls: ["https://escan.live"],
    blockExplorerIcons: {
      light: "/networkLogos/evmos.svg",
      dark: "/networkLogos/evmos.svg",
    },
    iconUrls: ["/networkLogos/evmos.svg"],
    rpcUrls: ["https://eth.bd.evmos.org:8545"],
    multicallAddress: "",
  },
  ZETACHAIN_ATHENS: {
    chainId: 7001,
    chainName: "ZetaChain Athens",
    nativeCurrency: {
      name: "aZETA",
      symbol: "aZETA",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI: "https://explorer.zetachain.com/img/logos/zeta-logo.svg",
    },
    rpcUrls: ["https://api.athens2.zetachain.com/evm"],
    blockExplorerUrls: ["https://explorer.zetachain.com"],
    blockExplorerIcons: {
      light: "/networkLogos/zetachain.svg",
      dark: "/networkLogos/zetachain.svg",
    },
    iconUrls: ["/networkLogos/zetachain.svg"],
  },
  SCROLL_ALPHA: {
    chainId: 534353,
    chainName: "Scroll Alpha",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://alpha-rpc.scroll.io/l2"],
    blockExplorerUrls: ["https://blockscout.scroll.io"],
    blockExplorerIcons: {
      light: "/networkLogos/scroll.png",
      dark: "/networkLogos/scroll.png",
    },
    iconUrls: ["/networkLogos/scroll.png"],
  },
  ZKSYNC_ERA: {
    chainId: 324,
    chainName: "zkSync Era",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://mainnet.era.zksync.io"],
    blockExplorerUrls: ["https://explorer.zksync.io"],
    blockExplorerIcons: {
      light: "/networkLogos/zksync-era.svg",
      dark: "/networkLogos/zksync-era.svg",
    },
    iconUrls: ["/networkLogos/zksync-era.svg"],
  },
  SEPOLIA: {
    chainId: 11155111,
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    apiUrl: "https://api-sepolia.etherscan.io",
    iconUrls: ["/networkLogos/ethereum.svg"],
  },
  GOERLI: {
    chainId: 5,
    chainName: "Goerli",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    rpcUrls: [
      process.env.GOERLI_ALCHEMY_KEY
        ? `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_KEY}`
        : // : "https://ethereum-goerli-rpc.allthatnode.com",
          "https://eth-goerli.g.alchemy.com/v2/demo	",
    ],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    blockExplorerIcons: {
      light: "/explorerLogos/etherscan-light.svg",
      dark: "/explorerLogos/etherscan-dark.svg",
    },
    apiUrl: "https://api-goerli.etherscan.io",
    iconUrls: ["/networkLogos/ethereum.svg"],
    multicallAddress: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    blockExplorerIcons: {
      light: "/networkLogos/polygon.svg",
      dark: "/networkLogos/polygon.svg",
    },
    apiUrl: "https://api-testnet.polygonscan.com",
    iconUrls: ["/networkLogos/polygon.svg"],
  },
}

const supportedChains = Object.keys(RPC) as Chain[]

const RPC_URLS = {}

supportedChains.forEach(
  (chain) => (RPC_URLS[RPC[chain].chainId] = RPC[chain].rpcUrls)
)

const [metaMask, metaMaskHooks] = initializeMetaMaskConnector()
const [walletConnect, walletConnectHooks] = initializeWalletConnectConnector()
const [coinbaseWallet, coinbaseWalletHooks] = initializeCoinbaseWalletConnector()
const [gnosisWallet, gnosisWalletHooks] = initializeGnosisConnector()

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet | GnosisSafe,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [gnosisWallet, gnosisWalletHooks],
]

export { Chains, RPC, RPC_URLS, connectors, supportedChains }
