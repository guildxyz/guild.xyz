import { Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { claimTextButtonTooltipLabel } from "platforms/SecretText/TextCardButton"
import { GuildPlatform } from "types"
import {
  getRolePlatformStatus,
  getRolePlatformTimeframeInfo,
} from "utils/rolePlatformHelpers"
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
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimGather(rolePlatform?.id)

  const { isAvailable } = getRolePlatformTimeframeInfo(rolePlatform)
  const isButtonDisabled = !isAvailable && !claimed

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
          iconSpacing={1}
          rightIcon={<ArrowSquareOut />}
          w="full"
          colorScheme="GATHER_TOWN"
        >
          Go to space
        </Button>
      ) : (
        <Tooltip
          isDisabled={!isButtonDisabled}
          label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
          hasArrow
          shouldWrapChildren
          w="full"
        >
          <Button
            colorScheme="GATHER_TOWN"
            w="full"
            onClick={onOpen}
            isDisabled={isButtonDisabled}
          >
            Claim access
          </Button>
        </Tooltip>
      )}

      <ClaimGatherModal
        title={platform.platformGuildData?.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onSubmit={submitClaim}
      />
    </>
  )
}

export default GatherCardButton
