import { Flex, Stack, Tooltip } from "@chakra-ui/react"
import ConnectWalletButton from "components/[guild]/Requirements/components/GuildCheckout/components/buttons/ConnectWalletButton"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import CircleDivider from "components/common/CircleDivider"
import { useClaimedReward } from "hooks/useClaimedReward"
import { getRolePlatformTimeframeInfo } from "utils/rolePlatformHelpers"
import ClaimPoapButton from "./ClaimPoapButton"

type Props = {
  rolePlatformId: number
}

const availibiltyTagStyleProps = {
  bgColor: "transparent",
  fontSize: "sm",
  fontWeight: "medium",
  colorScheme: "purple",
  p: 0,
}

const ClaimPoap = ({ rolePlatformId }: Props) => {
  const padding = { base: 5, sm: 6, lg: 7, xl: 8 }

  const { roles } = useGuild()
  const rolePlatform = roles
    ?.flatMap((r) => r.rolePlatforms)
    .find((rp) => rp.id === rolePlatformId)

  const { isAvailable: isButtonEnabled, startTimeDiff } =
    getRolePlatformTimeframeInfo(rolePlatform)
  const { claimed, isLoading } = useClaimedReward(rolePlatform.id)

  return (
    <Stack p={padding} w="full" spacing={2}>
      <ConnectWalletButton />
      <Tooltip
        isDisabled={isButtonEnabled || claimed}
        label={
          startTimeDiff > 0 ? "Claim hasn't started yet" : "Claim already ended"
        }
        hasArrow
        shouldWrapChildren
      >
        <ClaimPoapButton
          rolePlatformId={rolePlatformId}
          isDisabled={!isButtonEnabled}
          isClaimedLoading={isLoading}
        />
      </Tooltip>

      <Flex justifyContent="center" alignItems="center" wrap="wrap">
        {typeof rolePlatform?.capacity === "number" && (
          <>
            <CapacityTag
              capacity={rolePlatform.capacity}
              claimedCount={rolePlatform.claimedCount}
              {...availibiltyTagStyleProps}
            />
            <CircleDivider />
          </>
        )}

        {rolePlatform?.startTime && startTimeDiff > 0 && (
          <>
            <StartTimeTag
              startTime={rolePlatform?.startTime}
              {...availibiltyTagStyleProps}
            />
            <CircleDivider />
          </>
        )}

        {rolePlatform?.endTime && (
          <EndTimeTag
            endTime={rolePlatform?.endTime}
            {...availibiltyTagStyleProps}
          />
        )}
      </Flex>
    </Stack>
  )
}
export default ClaimPoap
