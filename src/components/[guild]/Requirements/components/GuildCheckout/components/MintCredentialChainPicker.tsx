import {
  Img,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chain, Chains, RPC } from "connectors"
import { useState } from "react"
import { GUILD_CREDENTIAL_CONTRACT } from "utils/guildCheckout/constants"

type ChainButtonProps = { chain: Chain; comingSoon?: boolean }

const CHAINS: ChainButtonProps[] = [
  ...Object.keys(GUILD_CREDENTIAL_CONTRACT).map((chain) => ({
    chain: chain as Chain,
  })),
  { chain: "ETHEREUM", comingSoon: true },
]

const MintCredentialChainPicker = (): JSX.Element => (
  <Stack>
    <Text fontWeight={"medium"}>Chain to mint on</Text>
    <SimpleGrid
      w="full"
      columns={{ base: 2, sm: Math.min(CHAINS.length, 3) }}
      gap={2}
    >
      {CHAINS.map(({ chain, comingSoon }) => (
        <ChainButton key={chain} chain={chain} comingSoon={comingSoon} />
      ))}
    </SimpleGrid>
  </Stack>
)

const ChainButton = ({ chain, comingSoon }: ChainButtonProps): JSX.Element => {
  const { chainId } = useWeb3React()
  const { requestNetworkChange } = useWeb3ConnectionManager()
  const [isLoading, setIsLoading] = useState(false)

  const isCurrentChain = Chains[chain] === chainId

  const activeBorderColor = useColorModeValue("gray.300", "gray.500")

  return (
    <Tooltip label="Coming soon" isDisabled={!comingSoon} placement="top" hasArrow>
      <Button
        size="sm"
        isDisabled={comingSoon || isCurrentChain}
        leftIcon={
          <Img
            src={RPC[chain].iconUrls[0]}
            alt={`${RPC[chain].chainName} network icon`}
            boxSize={4}
          />
        }
        borderRadius="lg"
        onClick={() => {
          setIsLoading(true)
          requestNetworkChange(
            RPC[chain].chainId,
            () => setIsLoading(false),
            () => setIsLoading(false)
          )
        }}
        isLoading={isLoading}
        loadingText={RPC[chain].chainName}
        border={!comingSoon && isCurrentChain && "2px"}
        borderColor={activeBorderColor}
        opacity={!comingSoon && isCurrentChain && "1!important"}
      >
        {RPC[chain].chainName}
      </Button>
    </Tooltip>
  )
}

export default MintCredentialChainPicker
