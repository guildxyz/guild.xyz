import { CHAIN_CONFIG, Chains } from "chains"
// import EIP1271_ABI from "static/abis/EIP1271.json"
import gnosisSignMessageLibAbi from "static/abis/gnosisSignMessageLib"
import { createPublicClient, hashMessage, http } from "viem"

// Move this type elsewhere, if we add multiple callbacks like this
export type MethodSignCallback = (
  message: string,
  address: `0x${string}`,
  chainId: number
) => Promise<void>

const gnosisSafeSignCallback: MethodSignCallback = async (
  message,
  address,
  chainId
) => {
  try {
    const publicClient = createPublicClient({
      chain: CHAIN_CONFIG[Chains[chainId]],
      transport: http(),
    })
    /**
     * Calling using sign lib abi here instead of the safe's, because the call gets
     * forwarded to the lib by the safe contract. This seems to be the only way, we
     * can call getMessageHash.
     */
    const msgHash = await publicClient.readContract({
      abi: gnosisSignMessageLibAbi,
      address,
      functionName: "getMessageHash",
      args: [hashMessage(message)],
    })

    /**
     * This message gets emitted when the sign transaction is finalized, we must
     * await it here
     */
    // WAGMI TODO: not sure if this actually works, I just followed the docs, but haven't tested it yet
    await new Promise<void>((resolve) =>
      publicClient.watchContractEvent({
        abi: gnosisSignMessageLibAbi,
        address,
        eventName: "SignMsg",
        args: {
          msgHash,
        },
        onLogs: () => resolve(),
      })
    )
  } catch (error) {
    console.error("Gnosis Safe signature error:", error)
  }
}

export default gnosisSafeSignCallback
