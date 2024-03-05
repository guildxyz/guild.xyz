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

  const spaceUrl = `https://app.gather.town/app/${platform?.platformGuildId.replace(
    "\\",
    "/"
  )}`

  const {
    onSubmit,
    response: claimed,
    isLoading,
    error,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimGather(rolePlatform?.id)

  const submitClaim = () => {
    onSubmit()
    onClose()
  }

  return (
    <>
      {claimed ? (
        <Button
          as="a"
          target="_blank"
          href={spaceUrl}
          rightIcon={<ArrowSquareOut />}
          colorScheme="GATHER_TOWN"
          w="full"
        >
          Go to space
        </Button>
      ) : (
        <Button colorScheme="GATHER_TOWN" w="full" onClick={onOpen}>
          Claim access
        </Button>
      )}

      <ClaimGatherModal
        title={platform.platformGuildData?.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        onSubmit={submitClaim}
      />
    </>
  )
}

export default GatherCardButton
