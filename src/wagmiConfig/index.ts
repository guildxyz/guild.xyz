import { PublicUser } from "components/[guild]/hooks/useUser"
import {
  beraTestnet,
  bitfinityTestnet,
  exosama,
  formTestnet,
  metisSepolia,
  neonEVM,
  oasisSapphire,
  ontology,
  palm,
  taikoKatlaTestnet,
  x1,
} from "static/customChains"
import { mutate } from "swr"
import fetcher, { fetcherWithSign } from "utils/fetcher"
import { http, type Chain, type WalletClient } from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { createConfig, type Connector } from "wagmi"
import {
  arbitrum,
  arbitrumNova,
  astarZkEVM,
  avalanche,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  boba,
  bsc,
  celo,
  coreDao,
  cronos,
  evmos,
  fantom,
  gnosis,
  harmonyOne,
  kava,
  linea,
  liskSepolia,
  lukso,
  mainnet,
  manta,
  mantle,
  metis,
  moonbeam,
  moonriver,
  opBNB,
  optimism,
  pgn,
  polygon,
  polygonZkEvm,
  ronin,
  scroll,
  scrollSepolia,
  sepolia,
  shimmer,
  x1Testnet,
  zetachain,
  zetachainAthensTestnet,
  zkSync,
  zora,
} from "wagmi/chains"
import { coinbaseWallet, injected, safe, walletConnect } from "wagmi/connectors"
import { mock } from "wagmiConfig/mockConnector"
import waasConnector, { WAAS_CONNECTOR_ID } from "wagmiConfig/waasConnector"

/**
 * We should consider adding only those chains here which we actually use for
 * client-side interactions (e.g. where users can mint Guild Pins, NFTs, buy tokens,
 * etc.)
 */
export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    polygon,
    polygonZkEvm,
    base as Chain,
    baseSepolia as Chain,
    optimism as Chain,
    arbitrum,
    arbitrumNova,
    bsc,
    avalanche,
    gnosis,
    fantom,
    celo as Chain,
    harmonyOne,
    moonbeam,
    moonriver,
    metis,
    metisSepolia,
    cronos,
    boba,
    palm,
    exosama,
    evmos,
    zetachain,
    zetachainAthensTestnet,
    scroll,
    scrollSepolia,
    zkSync as Chain,
    zora as Chain,
    pgn,
    neonEVM,
    linea,
    lukso,
    mantle,
    ronin,
    shimmer,
    kava,
    bitfinityTestnet,
    x1,
    x1Testnet,
    ontology,
    beraTestnet,
    manta,
    taikoKatlaTestnet,
    blast,
    blastSepolia,
    oasisSapphire,
    sepolia,
    astarZkEVM,
    coreDao,
    liskSepolia as Chain,
    opBNB,
    formTestnet,
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http("https://polygon-bor-rpc.publicnode.com"),
    [polygonZkEvm.id]: http(),
    [base.id]: http("https://base-pokt.nodies.app"),
    [baseSepolia.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumNova.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
    [gnosis.id]: http(),
    [fantom.id]: http(),
    [celo.id]: http(),
    [harmonyOne.id]: http(),
    [moonbeam.id]: http(),
    [moonriver.id]: http(),
    [metis.id]: http(),
    [metisSepolia.id]: http(),
    [cronos.id]: http(),
    [boba.id]: http(),
    [palm.id]: http(),
    [exosama.id]: http(),
    [evmos.id]: http("https://evmos.lava.build"),
    [zetachain.id]: http(),
    [zetachainAthensTestnet.id]: http(),
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
    [zkSync.id]: http(),
    [zora.id]: http(),
    [pgn.id]: http(),
    [neonEVM.id]: http(),
    [linea.id]: http(),
    [lukso.id]: http(),
    [mantle.id]: http(),
    [ronin.id]: http(),
    [shimmer.id]: http(),
    [kava.id]: http(),
    [bitfinityTestnet.id]: http(),
    [x1.id]: http(),
    [x1Testnet.id]: http(),
    [ontology.id]: http(),
    [beraTestnet.id]: http(),
    [manta.id]: http(),
    [taikoKatlaTestnet.id]: http(),
    [blast.id]: http(),
    [blastSepolia.id]: http(),
    [oasisSapphire.id]: http(),
    [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
    [astarZkEVM.id]: http(),
    [coreDao.id]: http(),
    [liskSepolia.id]: http(),
    [opBNB.id]: http(),
    [formTestnet.id]: http(),
  },
  ssr: true,
  connectors: process.env.NEXT_PUBLIC_MOCK_CONNECTOR
    ? [
        mock({
          accounts: [mnemonicToAccount(process.env.NEXT_PUBLIC_E2E_WALLET_MNEMONIC)],
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
        waasConnector({
          provideAuthToken: async () => {
            const connector = wagmiConfig.connectors.find(
              (conn) => conn.id === WAAS_CONNECTOR_ID
            ) as Connector

            const walletClient = await connector
              .getClient()
              .catch(() => null as WalletClient)

            // First we check if there is data in the cache
            const userCheck = !!walletClient
              ? await mutate<PublicUser>(
                  `/v2/users/${walletClient.account.address.toLowerCase()}/profile`,
                  (prev) => prev,
                  { revalidate: false }
                )
              : null

            // If there isn't, we mutate
            const user = !!walletClient
              ? !userCheck
                ? await mutate<PublicUser>(
                    `/v2/users/${walletClient.account.address.toLowerCase()}/profile`
                  )
                : userCheck
              : null

            const shouldSign =
              walletClient &&
              walletClient?.account?.address &&
              user?.keyPair?.keyPair

            const token = shouldSign
              ? await fetcherWithSign(
                  {
                    address: walletClient?.account?.address,
                    publicClient: null,
                    walletClient,
                    keyPair: user?.keyPair?.keyPair,
                  },
                  "/v2/third-party/coinbase/token",
                  { method: "GET" }
                )
              : await fetcher("/v2/third-party/coinbase/token")

            return token
          },
          collectAndReportMetrics: true,
          prod:
            (typeof window !== "undefined" &&
              window.origin === "https://guild.xyz") ||
            undefined,
        }),
      ],
})
