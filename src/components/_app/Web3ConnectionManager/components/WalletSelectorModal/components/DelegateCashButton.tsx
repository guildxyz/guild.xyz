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
  Tag,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import useDatadog from "components/_app/Datadog/useDatadog"
import useKeyPair from "hooks/useKeyPair"
import { ArrowSquareOut } from "phosphor-react"

const DelegateCashButton = (): JSX.Element => {
  const { addDatadogAction } = useDatadog()

  const { account, isActive: isAnyConnectorActive } = useWeb3React()
  const { ready } = useKeyPair()

  const iconUrl = "delegatecash.png"
  const connectorName = "Delegate"

  if (account && ready && isAnyConnectorActive) return null

  return (
    <Popover
      trigger="hover"
      onOpen={() => addDatadogAction("hover Delegate.cash button")}
    >
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
            disabled
            w="full"
            size="xl"
            justifyContent="space-between"
          >
            {connectorName}
            <Tag ml="2">Coming soon</Tag>
          </Button>
        </Box>
      </PopoverTrigger>
      <PopoverContent w="150px">
        <PopoverArrow />
        <PopoverBody>
          <Link
            href="https://delegate.cash"
            isExternal
            fontWeight={"semibold"}
            onClick={() => addDatadogAction("view Delegate.cash website")}
          >
            View website
            <Icon as={ArrowSquareOut} ml="1" />
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default DelegateCashButton
