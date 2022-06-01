import {
  Box,
  HStack,
  Img,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import { Modal } from "components/common/Modal"
import { CreatePoapProvider } from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import CreatePoapSuccess from "./components/CreatePoapSuccess"
import SetupBot from "./components/SetupBot"
import UploadMintLinks from "./components/UploadMintLinks"

const steps = [
  {
    label: "Create a POAP",
    content: CreatePoapForm,
  },
  {
    label: "Successful POAP drop",
    content: CreatePoapSuccess,
  },
  {
    label: "Upload mint links",
    content: UploadMintLinks,
  },
  {
    label: "Set up bot",
    content: SetupBot,
  },
]

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const CreatePoap = ({ isOpen, onClose }: Props): JSX.Element => {
  const { nextStep, activeStep, setStep } = useSteps({ initialStep: 0 })

  return (
    <CreatePoapProvider>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent mt={16} mb={{ base: 0, md: 16 }}>
          <ModalHeader>
            <HStack>
              <Img
                position="relative"
                top={0.5}
                src="/requirementLogos/poap.svg"
                boxSize={6}
              />
              <Text as="span">Create a POAP</Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Steps colorScheme="indigo" size="sm" activeStep={activeStep}>
              {steps.map(({ label, content: Content }) => (
                <Step label={label} key={label}>
                  <Box pt={6}>
                    <Content {...{ nextStep, setStep }} />
                  </Box>
                </Step>
              ))}
            </Steps>
          </ModalBody>
        </ModalContent>
      </Modal>
    </CreatePoapProvider>
  )
}

export default CreatePoap
