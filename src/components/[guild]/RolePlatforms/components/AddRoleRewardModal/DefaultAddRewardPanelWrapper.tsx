import {
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { ArrowLeft } from "phosphor-react"
import rewards from "platforms/rewards"
import { ReactNode } from "react"

export const DefaultAddRewardPanelWrapper = ({
  goBack,
  children,
}: {
  goBack: () => void
  children: ReactNode
}) => {
  const { modalRef, selection } = useAddRewardContext()

  return (
    <>
      <ModalCloseButton />
      <ModalHeader>
        <HStack>
          <IconButton
            rounded="full"
            aria-label="Back"
            size="sm"
            mb="-3px"
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            onClick={goBack}
          />
          <Text>{`Add ${rewards[selection].name} reward`}</Text>
        </HStack>
      </ModalHeader>

      <ModalBody ref={modalRef} className="custom-scrollbar">
        {children}
      </ModalBody>
    </>
  )
}

export default DefaultAddRewardPanelWrapper
