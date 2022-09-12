import {
  Box,
  Collapse,
  HStack,
  Icon,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Step, Steps } from "chakra-ui-steps"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useGuild from "components/[guild]/hooks/useGuild"
import { motion } from "framer-motion"
import { ArrowLeft, CaretDown, Plus } from "phosphor-react"
import capitalize from "utils/capitalize"
import {
  CreatePoapProvider,
  useCreatePoapContext,
} from "./components/CreatePoapContext"
import CreatePoapForm from "./components/CreatePoapForm"
import Distribution from "./components/Distribution"
import PoapListItem from "./components/PoapListItem"
import Requirements from "./components/Requirements"
import UploadMintLinks from "./components/UploadMintLinks"

const steps = [
  {
    label: "Set POAP data",
    content: CreatePoapForm,
  },
  {
    label: "Upload mint links",
    content: UploadMintLinks,
  },
  {
    label: "Requirements",
    description: "Optional",
    content: Requirements,
  },
  {
    label: "Distribute",
    content: Distribution,
  },
]

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

type WrapperProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  discordServerId: string
}

const MotionModalContent = motion(ModalContent)

const CreatePoap = ({ isOpen }: Props): JSX.Element => {
  const { poaps } = useGuild()
  const {
    activeStep,
    setStep,
    poapData,
    shouldCreatePoap,
    setShouldCreatePoap,
    setPoapData,
    onCloseHandler,
  } = useCreatePoapContext()

  const expiredPoaps = poaps?.filter((poap) => {
    const currentTime = Date.now() / 1000
    return poap.expiryDate <= currentTime
  })

  const activePoaps = poaps?.filter((poap) => {
    const currentTime = Date.now() / 1000
    return poap.expiryDate > currentTime
  })

  const { isOpen: isExpiredOpen, onToggle } = useDisclosure({
    defaultIsOpen: !activePoaps.length,
  })

  const viewPoapsList = () => {
    setPoapData(null)
    setShouldCreatePoap(false)
    setStep(0)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseHandler}
      size="3xl"
      scrollBehavior={
        poaps?.length && !poapData?.id && !shouldCreatePoap ? "inside" : "outside"
      }
      colorScheme={"dark"}
    >
      <ModalOverlay />
      <MotionModalContent
        mt={16}
        mb={{ base: 0, md: 16 }}
        initial={{
          maxWidth: !poaps?.length
            ? "var(--chakra-sizes-3xl)"
            : "var(--chakra-sizes-lg)",
        }}
        animate={{
          maxWidth:
            poapData?.id || shouldCreatePoap || !poaps?.length
              ? "var(--chakra-sizes-3xl)"
              : "var(--chakra-sizes-lg)",
        }}
      >
        <ModalHeader>
          <Stack alignItems="start">
            {(shouldCreatePoap || poapData?.id || !poaps?.length) && (
              <Button
                variant="link"
                fontFamily="body"
                color="gray"
                fontSize="xs"
                leftIcon={<Icon as={ArrowLeft} />}
                onClick={viewPoapsList}
              >
                View POAPs list
              </Button>
            )}
            <HStack alignItems="start">
              <Img
                position="relative"
                top={1.5}
                src="/requirementLogos/poap.svg"
                boxSize={6}
              />
              <Text as="span">
                {poapData?.id
                  ? "Manage POAP"
                  : shouldCreatePoap
                  ? "Create POAP"
                  : poaps?.length && activeStep === 0
                  ? "Manage POAPs"
                  : "Drop POAP"}
              </Text>
            </HStack>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />

        {poaps?.length && !poapData?.id && !shouldCreatePoap ? (
          <>
            <ModalBody className="custom-scrollbar">
              <Stack spacing="8">
                {!!activePoaps?.length && (
                  <Stack>
                    {activePoaps.map((poap) => (
                      <PoapListItem key={poap?.id} poapFancyId={poap?.fancyId} />
                    ))}
                  </Stack>
                )}

                {!!expiredPoaps?.length && (
                  <Box>
                    <Button
                      variant="link"
                      size="sm"
                      fontWeight="bold"
                      color="gray"
                      rightIcon={
                        <Icon
                          as={CaretDown}
                          transform={isExpiredOpen && "rotate(-180deg)"}
                          transition="transform .3s"
                        />
                      }
                      onClick={onToggle}
                    >
                      {capitalize(`${isExpiredOpen ? "" : "view "}expired POAPs`)}
                    </Button>
                    <Box mx="-2">
                      <Collapse in={isExpiredOpen}>
                        <Stack px="2" pb="2" pt="4">
                          {expiredPoaps.map((poap) => (
                            <PoapListItem
                              key={poap?.id}
                              poapFancyId={poap?.fancyId}
                            />
                          ))}
                        </Stack>
                      </Collapse>
                    </Box>
                  </Box>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                w="full"
                colorScheme="indigo"
                leftIcon={<Icon as={Plus} />}
                onClick={() => setShouldCreatePoap(true)}
              >
                Create a POAP
              </Button>
            </ModalFooter>
          </>
        ) : (
          <ModalBody>
            <Box animation={poaps?.length && "fadeIn .3s .2s both"}>
              <Steps
                textAlign={"left"}
                colorScheme="indigo"
                size="sm"
                activeStep={activeStep}
                onClickStep={poapData?.id ? setStep : undefined}
              >
                {steps.map(({ label, description, content: Content }) => (
                  <Step label={label} description={description} key={label}>
                    <Box pt={{ base: 6, md: 12 }}>
                      <Content />
                    </Box>
                  </Step>
                ))}
              </Steps>
            </Box>
          </ModalBody>
        )}
      </MotionModalContent>
    </Modal>
  )
}

const CreatePoapWrapper = ({
  isOpen,
  onClose,
  onOpen,
  discordServerId,
}: WrapperProps): JSX.Element => (
  <CreatePoapProvider onClose={onClose} discordServerId={discordServerId}>
    <CreatePoap {...{ isOpen, onClose, onOpen }} />
  </CreatePoapProvider>
)

export default CreatePoapWrapper
