import { ButtonProps } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import useClaimText from "platforms/SecretText/hooks/useClaimText"
import { useAccount } from "wagmi"
import { useClaimedReward } from "../../../../hooks/useClaimedReward"
import { RolePlatform } from "../../../../types"
import { MintLinkModal } from "./MintLinkModal"

type Props = {
  rolePlatform: RolePlatform
} & ButtonProps

const ClaimPoapButton = ({ rolePlatform, ...rest }: Props) => {
  const { captureEvent } = usePostHogContext()

  const { isConnected } = useAccount()

  const { claimed, isLoading: isClaimedLoading } = useClaimedReward(rolePlatform.id)

  const { urlName, roles } = useGuild()

  const roleId = roles?.find((role) =>
    role.rolePlatforms.some((rp) => rp.id === rolePlatform.id)
  )?.id
  const { isLoading: isAccessLoading, hasRoleAccess } = useRoleMembership(roleId)

  const {
    onSubmit,
    isLoading: isClaimLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatform.id)

  const showErrorToast = useShowErrorToast()
  const { triggerMembershipUpdate, isLoading: isMembershipUpdateLoading } =
    useMembershipUpdate({
      onSuccess: () => onSubmit(),
      onError: (err) =>
        showErrorToast({
          error: "Couldn't check eligibility",
          correlationId: err.correlationId,
        }),
    })

  const isLoading =
    isAccessLoading ||
    isMembershipUpdateLoading ||
    isClaimLoading ||
    isClaimedLoading

  const isDisabled = !isConnected || rest?.isDisabled || !rolePlatform?.capacity

  return (
    <>
      <Button
        size="lg"
        w="full"
        isLoading={isLoading}
        colorScheme={!rest.isDisabled || claimed ? "green" : "gray"}
        loadingText={
          isAccessLoading
            ? "Checking access"
            : isMembershipUpdateLoading
            ? "Checking eligibility"
            : "Claiming POAP"
        }
        onClick={() => {
          captureEvent("Click: ClaimPoapButton", {
            guild: urlName,
          })
          onOpen()

          if (response) return

          if (hasRoleAccess) {
            onSubmit()
          } else {
            triggerMembershipUpdate({
              roleIds: [roleId],
            })
          }
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
