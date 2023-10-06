import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import useClaimText, {
  ClaimTextModal,
} from "platforms/SecretText/hooks/useClaimText"
import { GuildPlatform } from "types"

type Props = {
  platform: GuildPlatform
}

const SecretTextCardButton = ({ platform }: Props) => {
  const { roles } = useGuild()
  const rolePlatformId = roles
    ?.find((r) => r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.id))
    ?.rolePlatforms?.find((rp) => rp.guildPlatformId === platform?.id)?.id
  const {
    onSubmit,
    isLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatformId)

  return (
    <>
      <Button
        onClick={() => {
          onOpen()
          if (!response) onSubmit()
        }}
        isLoading={isLoading}
        loadingText="Claiming..."
      >
        Claim
      </Button>

      <ClaimTextModal
        title={platform.platformGuildData.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        response={response}
      />
    </>
  )
}

export default SecretTextCardButton
