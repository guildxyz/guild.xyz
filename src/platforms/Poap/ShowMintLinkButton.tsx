import { ButtonProps } from "@chakra-ui/react"
import Button from "components/common/Button"
import useClaimText from "platforms/SecretText/hooks/useClaimText"
import { PropsWithChildren } from "react"
import { Rest } from "types"
import { MintLinksModal } from "components/[guild]/claim-poap/components/MintLinksModal"

export type ShowMintLinkButtonProps = { rolePlatformId: number } & ButtonProps & Rest

export const ShowMintLinkButton: React.FC<
  PropsWithChildren<ShowMintLinkButtonProps>
> = ({ rolePlatformId, children, ...rest }) => {
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
      <MintLinksModal
        isOpen={isOpen}
        onClose={onClose}
        response={response}
        error={error}
        isLoading={isLoading}
      />
    </>
  )
}
