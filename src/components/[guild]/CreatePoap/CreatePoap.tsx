import {
  Box,
  Divider,
  HStack,
  Icon,
  Img,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "phosphor-react"
import { useEffect, useState } from "react"
import {
  CreatePoapProvider,
  useCreatePoapContext,
} from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import CreatePoapSuccess from "./components/CreatePoapSuccess"
import PoapListItem from "./components/PoapListItem"
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

const MotionBox = motion(Box)

const CreatePoap = ({ isOpen, onClose }: Props): JSX.Element => {
  const poapListBg = useColorModeValue("gray.200", "blackAlpha.300")
  const modalBg = useColorModeValue(undefined, "gray.800")

  const { poaps } = useGuild()
  const { poapData } = useCreatePoapContext()
  const [shouldCreatePoap, setShouldCreatePoap] = useState(false)

  const { nextStep, activeStep, setStep } = useSteps({ initialStep: 0 })

  // If the user picks a POAP from the list, we should show the "Upload mint links" page
  useEffect(() => {
    if (!poaps?.length || !poapData) return
    if (poaps.find((poap) => poap.poapIdentifier === poapData.id)) setStep(2)
  }, [poaps, poapData])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={poapData?.id || shouldCreatePoap ? "4xl" : "lg"}
    >
      <ModalOverlay />
      <ModalContent mt={16} mb={{ base: 0, md: 16 }}>
        <ModalHeader bgColor={modalBg}>
          <HStack>
            <Img
              position="relative"
              top={0.5}
              src="/requirementLogos/poap.svg"
              boxSize={6}
            />
            <Text as="span">
              {poaps?.length ? "Choose a POAP" : "Create a POAP"}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalBody bgColor={modalBg}>
          <AnimatePresence initial={false} exitBeforeEnter>
            <MotionBox
              key={
                poaps?.length && !poapData?.id && !shouldCreatePoap
                  ? "select-poap"
                  : "create-poap"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              {poaps?.length && !poapData?.id && !shouldCreatePoap ? (
                <Stack spacing={4} mx="auto" maxW="sm">
                  <Stack
                    p={4}
                    bgColor={poapListBg}
                    borderRadius="2xl"
                    divider={<Divider />}
                  >
                    {poaps.map((poap) => (
                      <PoapListItem key={poap?.id} poapFancyId={poap?.fancyId} />
                    ))}
                  </Stack>

                  <HStack>
                    <Divider />
                    <Text as="span" fontWeight="bold" fontSize="sm" color="gray">
                      OR
                    </Text>
                    <Divider />
                  </HStack>

                  <Button
                    colorScheme="indigo"
                    leftIcon={<Icon as={Plus} />}
                    onClick={() => setShouldCreatePoap(true)}
                  >
                    Create a POAP
                  </Button>
                </Stack>
              ) : (
                <Steps colorScheme="indigo" size="sm" activeStep={activeStep}>
                  {steps.map(({ label, content: Content }) => (
                    <Step label={label} key={label}>
                      <Box pt={{ base: 4, md: 12 }}>
                        <Content {...{ nextStep, setStep }} />
                      </Box>
                    </Step>
                  ))}
                </Steps>
              )}
            </MotionBox>
          </AnimatePresence>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const CreatePoapWrapper = ({ isOpen, onClose, onOpen }: Props): JSX.Element => (
  <CreatePoapProvider>
    <CreatePoap {...{ isOpen, onClose, onOpen }} />
  </CreatePoapProvider>
)

export default CreatePoapWrapper
