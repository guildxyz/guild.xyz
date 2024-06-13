/**
 * We couldn't use the `mock` connector for testing real interaction in our E2E
 * tests, so we copy-pasted its source code here, extended it:
 *
 * - Passing Account[] in params instead of a `0x${string}`[]
 * - Implemented the `getClient` method
 * - Added supportfor the `eth_accounts` method inside the `getProvider` function
 */

import {
  Account,
  RpcRequestError,
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  fromHex,
  getAddress,
  http,
  numberToHex,
  type Address,
  type Client,
  type EIP1193RequestFn,
  type Hex,
  type Transport,
  type WalletRpcSchema,
} from "viem"
import { rpc } from "viem/utils"
import { ChainNotConfiguredError, createConnector, normalizeChainId } from "wagmi"
import { type MockParameters } from "wagmi/connectors"

mock.type = "mock" as const
export function mock(
  parameters: Omit<MockParameters, "accounts"> & {
    accounts: readonly [Account, ...Account[]]
  }
) {
  const features = parameters.features ?? {}

  type Provider = ReturnType<
    Transport<"custom", NonNullable<unknown>, EIP1193RequestFn<WalletRpcSchema>>
  >
  let connected = false
  let connectedChainId: number

  return createConnector<Provider>((config) => ({
    id: "mock",
    name: "Mock Connector",
    type: mock.type,
    async setup() {
      connectedChainId = config.chains[0].id
    },
    async connect({ chainId } = {}) {
      if (features.connectError) {
        if (typeof features.connectError === "boolean")
          throw new UserRejectedRequestError(new Error("Failed to connect."))
        throw features.connectError
      }

      const provider = await this.getProvider()
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      })

      let currentChainId = await this.getChainId()
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain({ chainId })
        currentChainId = chain.id
      }

      connected = true

      return { accounts, chainId: currentChainId }
    },
    async disconnect() {
      connected = false
    },
    async getAccounts() {
      if (!connected) throw new Error("Connector is not connected")
      const provider = await this.getProvider()
      const accounts = await provider.request({ method: "eth_accounts" })
      return accounts.map((x) => getAddress(x))
    },
    async getChainId() {
      const provider = await this.getProvider()
      const hexChainId = await provider.request({ method: "eth_chainId" })
      return fromHex(hexChainId, "number")
    },
    async isAuthorized() {
      if (!features.reconnect) return false
      if (!connected) return false
      const accounts = await this.getAccounts()
      return !!accounts.length
    },
    async switchChain({ chainId }) {
      const provider = await this.getProvider()
      const chain = config.chains.find((x) => x.id === chainId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      })
      return chain
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect()
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        })
    },
    onChainChanged(chain) {
      const chainId = normalizeChainId(chain)
      config.emitter.emit("change", { chainId })
    },
    async onDisconnect() {
      config.emitter.emit("disconnect")
      connected = false
    },
    async getProvider({ chainId } = {}) {
      const chain = config.chains.find((x) => x.id === chainId) ?? config.chains[0]

      const url = chain.rpcUrls.default.http[0]

      const request: EIP1193RequestFn = async ({ method, params }) => {
        // eth methods
        if (method === "eth_chainId") return numberToHex(connectedChainId)
        if (method === "eth_requestAccounts")
          return parameters.accounts.map((acc) => acc.address)
        if (method === "eth_signTypedData_v4")
          if (features.signTypedDataError) {
            if (typeof features.signTypedDataError === "boolean")
              throw new UserRejectedRequestError(
                new Error("Failed to sign typed data.")
              )
            throw features.signTypedDataError
          }

        if (method === "eth_accounts")
          return parameters.accounts.map((acc) => acc.address)

        // wallet methods
        if (method === "wallet_switchEthereumChain") {
          if (features.switchChainError) {
            if (typeof features.switchChainError === "boolean")
              throw new UserRejectedRequestError(
                new Error("Failed to switch chain.")
              )
            throw features.switchChainError
          }
          type Params = [{ chainId: Hex }]
          connectedChainId = fromHex((params as Params)[0].chainId, "number")
          this.onChainChanged(connectedChainId.toString())
          return
        }

        // other methods
        if (method === "personal_sign") {
          if (features.signMessageError) {
            if (typeof features.signMessageError === "boolean")
              throw new UserRejectedRequestError(
                new Error("Failed to sign message.")
              )
            throw features.signMessageError
          }
          // Change `personal_sign` to `eth_sign` and swap params
          method = "eth_sign"
          type Params = [data: Hex, address: Address]
          params = [(params as Params)[1], (params as Params)[0]]
        }

        const body = { method, params }

        const { error, result } = await rpc.http(url, { body })
        if (error) throw new RpcRequestError({ body, error, url })

        return result
      }

      return custom({ request })({ retryCount: 0 })
    },
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    async getClient({ chainId }) {
      const client = createWalletClient({
        transport: http(
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          config.chains.find((c) => c.id === chainId).rpcUrls.default.http[0]
        ),
        account: parameters.accounts[0],
      }) as Client

      return client
    },
  }))
}
