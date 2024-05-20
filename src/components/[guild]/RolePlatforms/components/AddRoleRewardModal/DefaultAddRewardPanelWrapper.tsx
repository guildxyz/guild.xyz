import {
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { ArrowLeft } from "phosphor-react"
import rewards from "platforms/rewards"
import { ReactNode } from "react"

export const DefaultAddRewardPanelWrapper = ({
  children,
}: {
  children: ReactNode
}) => {
  const { modalRef, selection, setStep } = useAddRewardContext()

  return (
    <ModalContent>
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
            onClick={() => setStep("HOME")}
          />
          <Text>{`Add ${rewards[selection].name} reward`}</Text>
        </HStack>
      </ModalHeader>

      <ModalBody ref={modalRef} className="custom-scrollbar">
        {children}
      </ModalBody>
    </ModalContent>
  )
}

export default DefaultAddRewardPanelWrapper
