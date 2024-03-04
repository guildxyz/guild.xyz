import { ButtonProps } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useClaimText from "platforms/SecretText/hooks/useClaimText"
import { useClaimedReward } from "../../../../hooks/useClaimedReward"
import { RolePlatform } from "../../../../types"
import { MintLinkModal } from "./MintLinkModal"

type Props = {
  rolePlatform: RolePlatform
} & ButtonProps

const ClaimPoapButton = ({ rolePlatform, ...rest }: Props) => {
  const { captureEvent } = usePostHogContext()
  const { claimed, isLoading: isClaimedLoading } = useClaimedReward(rolePlatform.id)

  const { urlName, roles } = useGuild()

  const roleId = roles?.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatform.id)
  )?.id
  const { isLoading: isAccessLoading, hasRoleAccess } = useRoleMembership(roleId)

  const {
    onSubmit,
    isPreparing,
    isLoading: isClaimLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatform.id)

  const isLoading =
    isAccessLoading || isPreparing || isClaimLoading || isClaimedLoading

  const isDisabled = rest?.isDisabled || !rolePlatform?.capacity

  return (
    <>
      <Button
        size="lg"
        w="full"
        isLoading={isLoading}
        colorScheme={!rest.isDisabled || claimed ? "green" : "gray"}
        loadingText={
          isAccessLoading || isPreparing ? "Checking access" : "Claiming POAP"
        }
        onClick={() => {
          captureEvent("Click: ClaimPoapButton", {
            guild: urlName,
          })
          onOpen()
          if (!response) onSubmit()
        }}
        {...rest}
        isDisabled={isDisabled}
      >
        {claimed
          ? "View mint link"
          : !hasRoleAccess
          ? "Check access & claim"
          : "Claim now"}
      </Button>
      <MintLinkModal
        isLoading={isLoading}
        onClose={onClose}
        isOpen={isOpen}
        error={error}
        response={response}
      />
    </>
  )
}
export default ClaimPoapButton
