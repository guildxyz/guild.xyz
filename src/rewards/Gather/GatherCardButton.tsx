import { Tooltip } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { claimTextButtonTooltipLabel } from "rewards/SecretText/TextCardButton"
import { RewardCardButton } from "rewards/components/RewardCardButton"
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

  return (
    <>
      {claimed ? (
        <RewardCardButton
          as="a"
          target="_blank"
          href={spaceUrl}
          iconSpacing={1}
          rightIcon={<ArrowSquareOut />}
          colorScheme="GATHER_TOWN"
        >
          Go to space
        </RewardCardButton>
      ) : (
        <Tooltip
          isDisabled={!isButtonDisabled}
          label={claimTextButtonTooltipLabel[getRolePlatformStatus(rolePlatform)]}
          hasArrow
          shouldWrapChildren
          w="full"
        >
          <RewardCardButton
            onClick={onOpen}
            isDisabled={isButtonDisabled}
            colorScheme="GATHER_TOWN"
          >
            Claim access
          </RewardCardButton>
        </Tooltip>
      )}

      <ClaimGatherModal
        title={platform.platformGuildData?.name}
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        onSubmit={onSubmit}
        gatherSpaceUrl={spaceUrl}
        claimed={claimed}
      />
    </>
  )
}

export default GatherCardButton
