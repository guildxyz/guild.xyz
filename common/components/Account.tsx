import { Button, Link } from "@chakra-ui/react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { useWeb3React } from "@web3-react/core"
import { UserRejectedRequestError } from "@web3-react/injected-connector"
import { useEffect, useRef, useState } from "react"
import injected from "../../connectors"
import useENSName from "../hooks/useENSName"
import formatEtherscanLink from "../../utils/formatEtherscanLink"
import shortenHex from "../../utils/shortenHex"

type Props = {
  triedToEagerConnect: boolean
}

const Account = ({ triedToEagerConnect }: Props): JSX.Element => {
  const { active, error, activate, chainId, account, setError } = useWeb3React()

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()

  if (process.browser) {
    onboarding.current = new MetaMaskOnboarding()
  }

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false)
  useEffect(() => {
    if (active || error) {
      setConnecting(false)
      onboarding.current?.stopOnboarding()
    }
  }, [active, error])

  const ENSName = useENSName(account)

  if (error) {
    return null
  }

  if (!triedToEagerConnect) {
    return null
  }

  if (typeof account !== "string") {
    const hasMetaMaskOrWeb3Available =
      MetaMaskOnboarding.isMetaMaskInstalled() ||
      (window as any)?.ethereum ||
      (window as any)?.web3

    return (
      <div>
        {hasMetaMaskOrWeb3Available ? (
          <Button
            type="button"
            onClick={() => {
              setConnecting(true)

              activate(injected, undefined, true).catch((err) => {
                if (err instanceof UserRejectedRequestError) {
                  setConnecting(false)
                } else {
                  setError(err)
                }
              })
            }}
          >
            {MetaMaskOnboarding.isMetaMaskInstalled()
              ? "Connect to MetaMask"
              : "Connect to Wallet"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => onboarding.current?.startOnboarding()}
          >
            Install Metamask
          </Button>
        )}
      </div>
    )
  }

  return (
    <Link
      href={formatEtherscanLink("Account", [chainId, account])}
      target="_blank"
      rel="noopener noreferrer"
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </Link>
  )
}

export default Account
