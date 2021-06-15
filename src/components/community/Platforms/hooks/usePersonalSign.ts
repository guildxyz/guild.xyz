import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"

type SignErrorType = { code: number; message: string }

const hexlify = (message: string): string =>
  `0x${Buffer.from(message, "utf8").toString("hex")}`

const usePersonalSign = (): ((message: string) => Promise<any>) => {
  const { library, account } = useWeb3React<Web3Provider>()

  return async (message: string): Promise<any> =>
    library.send("personal_sign", [hexlify(message), account])
}

export type { SignErrorType }
export { usePersonalSign }
