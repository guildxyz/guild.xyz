import {
  Box,
  Center,
  Icon,
  Img,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { useAccount } from "wagmi"
import { connectorButtonProps } from "./ConnectorButton"

const DelegateCashButton = (): JSX.Element => {
  const { isConnected } = useAccount()
  const { keyPair } = useUserPublic()

  const iconUrl = "delegatecash.png"
  const connectorName = "Delegate"

  const { setIsDelegateConnection } = useWeb3ConnectionManager()

  if (keyPair && isConnected) return null

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Box tabIndex={0}>
          <Button
            leftIcon={
              <Center boxSize={6}>
                <Img
                  src={`/walletLogos/${iconUrl}`}
                  maxW={6}
                  maxH={6}
                  alt={`${connectorName} logo`}
                />
              </Center>
            }
            onClick={() => {
              setIsDelegateConnection(true)
            }}
            {...connectorButtonProps}
          >
            {connectorName}
          </Button>
        </Box>
      </PopoverTrigger>
      <PopoverContent w="150px">
        <PopoverArrow />
        <PopoverBody>
          <Link href="https://delegate.cash" isExternal fontWeight={"semibold"}>
            View website
            <Icon as={ArrowSquareOut} ml="1" />
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default DelegateCashButton
