import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { GuildPlatform } from "types"
import useClaimText, { ClaimTextModal } from "./hooks/useClaimText"

type Props = {
  platform: GuildPlatform
}

const TextCardButton = ({ platform }: Props) => {
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
        loadingText="Claiming secret..."
      >
        Reveal secret
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

export default TextCardButton
