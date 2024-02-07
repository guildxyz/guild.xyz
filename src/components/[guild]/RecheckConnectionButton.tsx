import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import useMembershipUpdate from "./JoinModal/hooks/useMembershipUpdate"

const RecheckConnectionButton = ({
  children,
  ...props
}: ButtonProps): JSX.Element => {
  const showErrorToast = useShowErrorToast()

  const { triggerMembershipUpdate, isLoading } = useMembershipUpdate((error) => {
    const errorMsg = "Couldn't check access"
    const correlationId = error.correlationId
    showErrorToast(
      correlationId
        ? {
            error: errorMsg,
            correlationId,
          }
        : errorMsg
    )
  })

  return (
    <Button
      onClick={triggerMembershipUpdate}
      colorScheme="green"
      isLoading={isLoading}
      w="full"
      {...props}
    >
      {children}
    </Button>
  )
}

export default RecheckConnectionButton
