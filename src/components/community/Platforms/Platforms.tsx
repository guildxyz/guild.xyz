import ActionCard from "components/common/ActionCard"
import { Tooltip, Box } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import PlatformButton from "./components/PlatformButton"

// ! This is a dummy function for the demo !
const noAccessToAnyLevels = () => false

const tooltipLabel = (account: string) => {
  if (!account) return "Wallet not connected"
  if (noAccessToAnyLevels()) return "You don't have access to any of the levels"
  return ""
}

const Platforms = (): JSX.Element => {
  const { account } = useWeb3React()
  const { platforms } = useCommunity()

  return (
    <ActionCard
      title="Platforms"
      description="All platforms are bridged together so you’ll see the same messages everywhere."
    >
      {Object.keys(platforms)
        .filter((platform) => platforms[platform].active)
        .map((platform) => (
          <Tooltip
            key={platform}
            isDisabled={!!account || noAccessToAnyLevels()}
            label={tooltipLabel(account)}
          >
            <Box>
              <PlatformButton platform={platform} />
            </Box>
          </Tooltip>
        ))}
    </ActionCard>
  )
}

export default Platforms
