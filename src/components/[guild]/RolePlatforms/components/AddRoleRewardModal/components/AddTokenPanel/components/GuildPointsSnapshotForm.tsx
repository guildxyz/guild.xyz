import { Alert, AlertIcon, Box } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { PlatformType } from "types"
import SnapshotSelector from "./SnapshotSelector"

const GuildPointsSnapshotForm = () => {
  const { guildPlatforms } = useGuild()

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  return (
    <Box w="full" p={5}>
      {existingPointsRewards.length === 0 ? (
        <Alert status="error" display="flex" alignItems="center">
          <AlertIcon mt={0} /> <p>You need to create a point reward first!</p>
        </Alert>
      ) : (
        <SnapshotSelector />
      )}
    </Box>
  )
}

export default GuildPointsSnapshotForm
