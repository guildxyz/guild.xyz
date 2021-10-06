import { hexlify } from "@ethersproject/bytes"
import { Web3Provider } from "@ethersproject/providers"
import { toUtf8Bytes } from "@ethersproject/strings"
import { useWeb3React } from "@web3-react/core"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type Store = {
  [address: string]: {
    [message: string]: string
  }
}

const SignContext = createContext<Store>({})

const PersonalSignStore = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [signedMessages, setSignedMessages] = useState<Store>({})

  useEffect(
    () =>
      setSignedMessages(
        JSON.parse(sessionStorage.getItem("signedMessages") ?? "{}")
      ),
    []
  )
  return (
    <SignContext.Provider value={signedMessages}>{children}</SignContext.Provider>
  )
}

const usePersonalSign = (): [
  (message: string) => Promise<string>, // sign
  (message: string) => boolean, // hasMessage
  (message: string) => string // getSign
] => {
  const signedMessages = useContext(SignContext)
  const { library, account, connector } = useWeb3React<Web3Provider>()

  const saveSignedMessages = useCallback(
    () => sessionStorage.setItem("signedMessages", JSON.stringify(signedMessages)),
    [signedMessages]
  )

  useEffect(() => {
    if (typeof account === "string" && !(account in signedMessages)) {
      signedMessages[account] = {}
      saveSignedMessages()
    }
  }, [account, signedMessages, saveSignedMessages])

  const sign = async (message: string): Promise<string> => {
    if (typeof signedMessages[account][message] === "string")
      return signedMessages[account][message]
    const signed =
      connector instanceof WalletConnectConnector
        ? await connector.walletConnectProvider.connector.signPersonalMessage([
            hexlify(toUtf8Bytes(message)),
            account.toLowerCase(),
          ])
        : await library.getSigner(account).signMessage(message)
    signedMessages[account][message] = signed
    saveSignedMessages()
    return signed
  }

  return [
    sign,
    (message: string) => typeof signedMessages[account][message] === "string",
    (message: string) => signedMessages[account][message],
  ]
}

export { usePersonalSign, PersonalSignStore }
