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
          onSubmit()
        }}
        isLoading={isLoading}
        loadingText="Claiming secret..."
      >
        View secret
      </Button>

      <ClaimTextModal
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
