import { Box, Tooltip } from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import { useCommunity } from "components/community/Context"
import useLevelAccess from "../Levels/components/Level/hooks/useLevelAccess"
import PlatformButton from "./components/PlatformButton"

const Platforms = (): JSX.Element => {
  const {
    communityPlatforms,
    levels: [{ requirementType, requirementAmount }],
  } = useCommunity()
  const [hasAccess, noAccessMessage] = useLevelAccess(
    requirementType,
    requirementAmount
  )

  return (
    <ActionCard
      title="Platforms"
      description="All platforms are bridged together so you’ll see the same messages everywhere."
    >
      {communityPlatforms
        .filter((platform) => platform.active)
        .map((platform) => (
          <Tooltip
            key={platform.name}
            isDisabled={hasAccess}
            label={
              noAccessMessage === "Wallet not connected"
                ? noAccessMessage
                : "You don't have access to any of the levels"
            }
          >
            <Box>
              <PlatformButton platform={platform.name} disabled={!hasAccess} />
            </Box>
          </Tooltip>
        ))}
    </ActionCard>
  )
}

export default Platforms
