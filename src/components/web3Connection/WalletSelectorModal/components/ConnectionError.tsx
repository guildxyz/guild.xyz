import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Collapse,
  Stack,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector"
import { useEffect, useState } from "react"

const ConnectionError = (): JSX.Element => {
  const { error } = useWeb3React()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // delay the open of the Collapse from when the error has changed,
  // so it fetches the content height correctly
  const [delayedShow, setDelayedShow] = useState(!!error)

  useEffect(() => {
    console.log(error)

    if (!error) {
      setDelayedShow(false)
      return
    }

    setTimeout(() => setDelayedShow(true), 100)
    switch (error.constructor) {
      case NoEthereumProviderError:
        setTitle("Wallet not found")
        setDescription(
          "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
        )
        break
      case UnsupportedChainIdError:
        setTitle("Wrong network")
        setDescription(
          "Please switch to the appropriate Ropsten network, or connect to another wallet."
        )
        break
      case UserRejectedRequestError:
        setTitle("Error connecting. Try again!")
        setDescription(
          "Please authorize this website to access your Ethereum account."
        )
        break
      default:
        console.error(error)
        setTitle("An unknown error occurred")
        setDescription("Check the console for more details.")
        break
    }
  }, [error])

  return (
    <Collapse in={delayedShow}>
      <Alert status="error" mb="4">
        <AlertIcon />
        <Stack>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Stack>
      </Alert>
    </Collapse>
  )
}

export default ConnectionError
