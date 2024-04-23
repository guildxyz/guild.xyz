// eslint-disable-next-line import/no-extraneous-dependencies
import { toViem } from "@coinbase/waas-sdk-viem"
import type {
  Address,
  InitializeWaasOptions,
  NewWallet,
  ProtocolFamily,
  Waas,
  Wallet,
} from "@coinbase/waas-sdk-web"
import { LocalAccount, createClient, http } from "viem"
import { createConnector, type Connector } from "wagmi"

export const WAAS_CONNECTOR_ID = "waas-connector"

export class WaasActionFailed extends Error {
  constructor(error: unknown) {
    super("Coinbase WaaS action failed")
    this.cause = error
  }
}

let cwaasModule: typeof import("@coinbase/waas-sdk-web")
const cwaasImport = async () => {
  if (cwaasModule) return cwaasModule
  // eslint-disable-next-line import/no-extraneous-dependencies
  const mod = await import("@coinbase/waas-sdk-web")
  cwaasModule = mod
  return mod
}

type WalletWithAccount<W extends NewWallet | Wallet> = {
  wallet: W
  account: LocalAccount
}

type WaaSSpecificFunctions = {
  createWallet(): Promise<WalletWithAccount<NewWallet>>
  restoreWallet(backupData: string): Promise<WalletWithAccount<Wallet>>
  currentAddress: Address<ProtocolFamily>
}

export default function waasConnector(options: InitializeWaasOptions) {
  let chainId: number
  let waas: Waas

  async function getAllEvmAddresses() {
    const { ProtocolFamily } = await cwaasImport()

    const allAddresses =
      (await waas.wallets.wallet.addresses.all()) as Address<ProtocolFamily>[]

    const evmAddresses = allAddresses.filter(
      (address) => address.protocolFamily === ProtocolFamily.EVM
    )

    return evmAddresses
  }

  function throwIfNoWallet() {
    if (!waas) {
      throw new Error("CWaaS SDK is not initialized")
    }

    if (!waas.wallets.wallet) {
      throw new Error("Create or restore a CWaaS wallet")
    }
  }

  async function withAccount<W extends Wallet>(wallet: W) {
    const { ProtocolFamily } = await cwaasImport()

    const address = await waas.wallets.wallet.addresses.for(ProtocolFamily.EVM)

    const account = toViem(address)

    return { wallet, account }
  }

  return createConnector<Waas, WaaSSpecificFunctions>(({ chains, emitter }) => ({
    id: WAAS_CONNECTOR_ID,
    name: "Coinbase WaaS",
    type: "coinbase-waas",

    currentAddress: null,

    async connect(config) {
      // emitter.emit("message", { type: "connecting" })

      await this.getProvider()
      throwIfNoWallet()

      const addresses = await getAllEvmAddresses()

      chainId = config?.chainId ?? 1

      this.currentAddress ||= addresses[0]

      return {
        accounts: [this.currentAddress.address],
        chainId,
      }
    },

    async getProvider() {
      try {
        if (!waas) {
          const { InitializeWaas } = await cwaasImport()

          waas = await InitializeWaas(options)
        }

        return waas
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async disconnect() {
      // emitter.emit("disconnect")
    },

    async getAccounts() {
      throwIfNoWallet()

      return [this.currentAddress.address]
    },

    async getChainId() {
      return chainId
    },

    /**
     * This returns a never, because viem's createClient and createWalletClient don't
     * work with strictNullChecks: false
     */
    async getClient(config) {
      throwIfNoWallet()

      const account = toViem(this.currentAddress)

      const chain = chains.find(({ id }) => id === (config?.chainId ?? 1))

      const walletClient = createClient({
        account,
        chain,
        transport: http(), // chain.rpcUrls[0].http[0]
      })

      return walletClient
    },

    async isAuthorized() {
      try {
        await this.getProvider()
        throwIfNoWallet()
        const { ProtocolFamily } = await cwaasImport()

        await this.getProvider()

        const addresses = await waas.wallets.wallet.addresses.for(ProtocolFamily.EVM)

        return !!addresses?.address
      } catch {
        return false
      }
    },

    async switchChain(parameters) {
      chainId = parameters.chainId
      await this.getClient({ chainId })
      const chain = chains.find(({ id }) => id === chainId)
      this.onChainChanged(chainId)
      return chain
    },

    async onAccountsChanged(_accounts) {
      // if (accounts.length === 0) emitter.emit("disconnect")
      // else emitter.emit("change", { account: currentAddress.address })
    },

    async onChainChanged(newChainId) {
      emitter.emit("change", { chainId: +newChainId })
    },

    async onDisconnect(_error) {
      emitter.emit("disconnect")
    },

    async createWallet() {
      try {
        await this.getProvider()
        const { Logout, ProtocolFamily } = await cwaasImport()

        await Logout().catch(() => {})

        const wallet = await waas.wallets.create()
        this.currentAddress = await wallet.addresses.for(ProtocolFamily.EVM)
        const withViemAccount = await withAccount(wallet)
        return withViemAccount
      } catch (error) {
        console.error(error)
        throw new WaasActionFailed(error)
      }
    },

    async restoreWallet(backupData) {
      try {
        await this.getProvider()
        const { Logout, ProtocolFamily } = await cwaasImport()

        await Logout().catch(() => {})

        const wallet = await waas.wallets.restoreFromBackup(backupData)

        this.currentAddress = await wallet.addresses.for(ProtocolFamily.EVM)

        const withViemAccount = await withAccount(wallet)
        return withViemAccount
      } catch (error) {
        console.error(error)
        throw new WaasActionFailed(error)
      }
    },
  }))
}

export type WaaSConnector = Connector & WaaSSpecificFunctions
