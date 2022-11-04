import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Modal } from "components/common/Modal"
import { AnimatePresence, usePresence } from "framer-motion"
import {
  ArrowLeft,
  CaretRight,
  CurrencyCircleDollar,
  ImageSquare,
  ListChecks,
  Wrench,
} from "phosphor-react"
import { FC, forwardRef, useEffect, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { RequirementType } from "types"
import REQUIREMENT_FORMCARDS from "../formCards"
import BalancyFooter from "./BalancyFooter"

type RequirementButton = {
  icon: FC | string
  label: string
  type: RequirementType
  color?: string
  disabled?: boolean
}

const general: Array<RequirementButton> = [
  {
    icon: CurrencyCircleDollar,
    label: "Token",
    type: "ERC20",
  },
  {
    icon: ImageSquare,
    label: "NFT",
    type: "ERC721",
  },
  {
    icon: ListChecks,
    label: "Allowlist",
    type: "ALLOWLIST",
  },
  {
    icon: Wrench,
    label: "Custom contract query",
    type: "CONTRACT",
  },
]

const integrations: Array<RequirementButton> = [
  {
    icon: "/requirementLogos/twitter.svg",
    label: "Twitter",
    type: "TWITTER",
  },
  {
    icon: "/platforms/github.png",
    label: "GitHub",
    type: "GITHUB",
  },
  {
    icon: "/platforms/discord.png",
    label: "Discord",
    type: "DISCORD",
  },
  {
    icon: "/requirementLogos/unlock.png",
    label: "Unlock",
    type: "UNLOCK",
  },
  {
    icon: "/requirementLogos/poap.svg",
    label: "POAP",
    type: "POAP",
  },
  {
    icon: "/requirementLogos/gitpoap.svg",
    label: "GitPOAP",
    type: "GITPOAP",
  },
  {
    icon: "/requirementLogos/mirror.svg",
    label: "Mirror",
    type: "MIRROR_COLLECT",
  },
  {
    icon: "/requirementLogos/juicebox.png",
    label: "Juicebox",
    type: "JUICEBOX",
  },
  {
    icon: "/requirementLogos/snapshot.png",
    label: "Snapshot",
    type: "SNAPSHOT",
    disabled: true,
  },
  {
    icon: "/requirementLogos/galaxy.svg",
    label: "Galxe",
    type: "GALAXY",
  },
  {
    icon: "/requirementLogos/noox.svg",
    label: "Noox",
    type: "NOOX",
  },
  {
    icon: "/requirementLogos/lens.png",
    label: "Lens",
    type: "LENS_PROFILE",
  },
  {
    icon: "/requirementLogos/otterspace.png",
    label: "Otterspace",
    type: "OTTERSPACE",
  },
  {
    icon: "/requirementLogos/disco.png",
    label: "Disco",
    type: "DISCO",
  },
  {
    icon: "/requirementLogos/orange.png",
    label: "Orange",
    type: "ORANGE",
  },
  {
    icon: "/requirementLogos/101.png",
    label: "101",
    type: "101",
  },
  {
    icon: "/requirementLogos/rabbithole.png",
    label: "Rabbithole",
    type: "RABBITHOLE",
  },
  {
    icon: "/requirementLogos/kycdao.svg",
    label: "kycDAO",
    type: "KYC_DAO",
  },
  {
    icon: "/requirementLogos/cask.png",
    label: "Cask",
    type: "CASK",
  },
]

const TRANSITION_DURATION_MS = 250
const HOME_MAXHEIGHT = "550px"

const AddRequirementCard = ({ onAdd }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedType, setSelectedType] = useState<string>()
  const [height, setHeight] = useState("auto")
  const addCardRef = useRef()
  const homeRef = useRef(null)
  const formRef = useRef(null)

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSelectedType(null)
    }, 300)
  }

  useEffect(() => {
    if (selectedType) {
      setHeight(formRef.current?.getBoundingClientRect().height)

      // set height to auto after the transition is done so the content can change
      setTimeout(() => {
        // the form is always taller than 200px, and it's better than 0 for animating back
        if (homeRef.current) homeRef.current.style.height = "200px"
        setHeight("auto")
      }, TRANSITION_DURATION_MS)
    } else {
      // set current height back to explicit value from auto so it can animate
      if (formRef.current) setHeight(formRef.current.getBoundingClientRect().height)

      // 10ms setTimeout to ensure these happen after the setHeight above has completed
      setTimeout(() => {
        if (homeRef.current) homeRef.current.style.height = "auto"
        setHeight(HOME_MAXHEIGHT)
      }, 10)
    }
  }, [selectedType, homeRef, formRef])

  return (
    <>
      <CardMotionWrapper>
        <AddCard ref={addCardRef} text="Add requirement" onClick={onOpen} />
      </CardMotionWrapper>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        scrollBehavior="inside"
        finalFocusRef={addCardRef}
        // colorScheme={"dark"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <HStack>
              {selectedType && (
                <IconButton
                  rounded={"full"}
                  aria-label="Back"
                  size="sm"
                  mb="-3px"
                  icon={<ArrowLeft size={20} />}
                  variant="ghost"
                  onClick={() => setSelectedType(null)}
                />
              )}
              <Text w="calc(100% - 70px)" noOfLines={1}>{`Add ${
                selectedType ?? ""
              } requirement`}</Text>
            </HStack>
          </ModalHeader>

          <SimpleGrid
            overflow={"hidden"}
            w="200%"
            columns={2}
            transform={selectedType ? "translateX(-50%)" : "translateX(0px)"}
            height={height}
            transition={`transform ${TRANSITION_DURATION_MS}ms, height ${TRANSITION_DURATION_MS}ms`}
          >
            <RequirementTypes ref={homeRef} {...{ setSelectedType }} />
            <AnimatePresence>
              {selectedType && (
                <RequirementForm
                  ref={formRef}
                  {...{ onAdd, handleClose, selectedType }}
                />
              )}
            </AnimatePresence>
          </SimpleGrid>
        </ModalContent>
      </Modal>
    </>
  )
}

const RequirementForm = forwardRef(
  ({ onAdd, handleClose, selectedType }: any, ref: any) => {
    const FormComponent = REQUIREMENT_FORMCARDS[selectedType]
    const methods = useForm({ mode: "all" })

    const [isPresent, safeToRemove] = usePresence()
    useEffect(() => {
      if (!isPresent) setTimeout(safeToRemove, TRANSITION_DURATION_MS)
    }, [isPresent])

    const onSubmit = methods.handleSubmit((data) => {
      onAdd({ type: selectedType, ...data })
      handleClose()
    })

    return (
      <Box ref={ref} alignSelf="start">
        <FormProvider {...methods}>
          <ModalBody>
            <FormComponent baseFieldPath="" />
          </ModalBody>
          <ModalFooter gap="3">
            <BalancyFooter baseFieldPath={null} />
            <Button colorScheme="green" onClick={onSubmit} ml="auto">
              Add requirement
            </Button>
          </ModalFooter>
        </FormProvider>
      </Box>
    )
  }
)

const RequirementTypes = forwardRef(({ setSelectedType }: any, ref: any) => (
  <ModalBody ref={ref} maxHeight={HOME_MAXHEIGHT}>
    <Heading size="sm" mb="3">
      General
    </Heading>
    <SimpleGrid columns={2} gap="2">
      {general.map((requirementButton: RequirementButton, index: number) => (
        <Button
          key={requirementButton.type}
          minH={24}
          onClick={() => setSelectedType(requirementButton.type)}
          isDisabled={requirementButton.disabled}
        >
          <VStack w="full" whiteSpace={"break-spaces"}>
            <Icon as={requirementButton.icon as FC} boxSize={6} />
            <Text as="span">{requirementButton.label}</Text>
          </VStack>
        </Button>
      ))}
    </SimpleGrid>
    <Heading size="sm" mb="3" mt="8">
      Integrations
    </Heading>
    <Stack>
      {integrations.map((requirementButton: RequirementButton, index: number) => (
        <Tooltip
          key={requirementButton.type}
          isDisabled={!requirementButton.disabled}
          label="Temporarily unavailable"
          hasArrow
        >
          <Button
            py="8"
            px="6"
            leftIcon={<Img src={requirementButton.icon as string} boxSize="6" />}
            rightIcon={<Icon as={CaretRight} />}
            iconSpacing={4}
            onClick={() => setSelectedType(requirementButton.type)}
            isDisabled={requirementButton.disabled}
            sx={{ ".chakra-text": { w: "full", textAlign: "left" } }}
          >
            {requirementButton.label}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  </ModalBody>
))

export default AddRequirementCard
