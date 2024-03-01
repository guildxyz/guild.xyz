import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { GuildPlatform } from "types"
import ClaimGatherModal from "./ClaimGatherModal"
import useClaimGather from "./hooks/useClaimGather"

type Props = {
  platform: GuildPlatform
}

const GatherCardButton = ({ platform }: Props) => {
  const { roles } = useGuild()

  const rolePlatform = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)

  //const { claimed } = useClaimedReward(platform.id)
  const claimed = false
  const spaceUrl = `https://app.gather.town/app/${platform?.platformGuildId.replace(
    "\\",
    "/"
  )}`

  const getNameFromSpaceId = () => {
    return decodeURIComponent(platform.platformGuildData?.spaceId.split("\\")[1])
  }

  const {
    onSubmit,
    isLoading,
    error,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimGather(rolePlatform?.id)

  return (
    <>
      {claimed ? (
        <Button
          as="a"
          target="_blank"
          href={spaceUrl}
          rightIcon={<ArrowSquareOut />}
          colorScheme="GATHER"
          w="full"
        >
          Go to space
        </Button>
      ) : (
        <Button colorScheme="GATHER" w="full" onClick={onOpen}>
          Claim
        </Button>
      )}

      <ClaimGatherModal
        title={getNameFromSpaceId()}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default GatherCardButton
