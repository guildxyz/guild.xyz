import { ButtonProps } from "@chakra-ui/react"
import { MintLinkModal } from "components/[guild]/claim-poap/components/MintLinkModal"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"
import useClaimText from "rewards/SecretText/hooks/useClaimText"
import { Rest } from "types"

type ShowMintLinkButtonProps = { rolePlatformId: number } & ButtonProps & Rest

const ShowMintLinkButton: React.FC<PropsWithChildren<ShowMintLinkButtonProps>> = ({
  rolePlatformId,
  children,
  ...rest
}) => {
  const {
    isLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatformId)

  return (
    <>
      <Button onClick={onOpen} {...rest}>
        {children}
      </Button>
      <MintLinkModal
        isOpen={isOpen}
        onClose={onClose}
        response={response}
        error={error}
        isLoading={isLoading}
      />
    </>
  )
}

export default ShowMintLinkButton
