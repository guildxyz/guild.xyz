import { ButtonProps, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { MintModal } from "components/[guild]/CreatePoap/hooks/useMintPoapButton"
import useJoin from "components/[guild]/JoinModal/hooks/useJoin"
import useClaimPoap from "components/[guild]/claim-poap/hooks/useClaimPoap"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import useToast from "hooks/useToast"
import { ArrowSquareOut } from "phosphor-react"
import { PropsWithChildren, forwardRef } from "react"

type Props = {
  poapId: number
} & ButtonProps

const JoinAndMintPoapButton = forwardRef(
  ({ poapId, children, ...buttonProps }: PropsWithChildren<Props>, ref: any) => {
    const { account } = useWeb3React()
    const isMember = useIsMember()
    const toast = useToast()

    const {
      isOpen: isMintModalOpen,
      onOpen: onMintModalOpen,
      onClose: onMintModalClose,
    } = useDisclosure()

    const { onSubmit, response, ...rest } = useClaimPoap(poapId)

    const handleSubmit = (res) => {
      if (!res.success) {
        toast({
          status: "warning",
          title: "No access",
          description:
            "Seems like you're not eligible for any roles in this guild. Check the guild page for more info!",
          duration: 8000,
        })
        return
      }

      onSubmit()
      onMintModalOpen()
    }

    const {
      isLoading: isJoinLoading,
      onSubmit: onJoinSubmit,
      isSigning,
      signLoadingText,
    } = useJoin(handleSubmit)

    const props = response
      ? {
          as: "a",
          target: "_blank",
          href: `${response}?address=${account}`,
          rightIcon: <ArrowSquareOut />,
          children: "Go to minting page",
        }
      : isMember
      ? {
          onClick: handleSubmit,
          children: "Mint POAP",
        }
      : {
          onClick: () => onJoinSubmit(),
          isLoading: isJoinLoading || isSigning,
          loadingText: signLoadingText || "Joining Guild",
          children: "Mint POAP",
        }

    return (
      <>
        <Button ref={ref} {...buttonProps} {...props} />
        <MintModal
          isOpen={isMintModalOpen}
          onClose={onMintModalClose}
          response={response}
          {...rest}
        />
      </>
    )
  }
)

export default JoinAndMintPoapButton
