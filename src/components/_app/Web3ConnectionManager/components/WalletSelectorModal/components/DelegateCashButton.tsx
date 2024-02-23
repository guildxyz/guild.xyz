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
import { ArrowSquareOut } from "@phosphor-icons/react"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { useAccount } from "wagmi"

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
        <Box mb="4" tabIndex={0}>
          <Button
            rightIcon={
              <Center boxSize={6}>
                <Img
                  src={`/walletLogos/${iconUrl}`}
                  maxW={6}
                  maxH={6}
                  alt={`${connectorName} logo`}
                />
              </Center>
            }
            w="full"
            size="xl"
            justifyContent="space-between"
            onClick={() => {
              setIsDelegateConnection(true)
            }}
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
