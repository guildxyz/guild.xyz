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
import useGuild from "components/[guild]/hooks/useGuild"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Modal } from "components/common/Modal"
import SearchBar from "components/explorer/SearchBar"
import { AnimatePresence, AnimateSharedLayout, usePresence } from "framer-motion"
import useToast from "hooks/useToast"
import { ArrowLeft, CaretRight } from "phosphor-react"
import {
  Dispatch,
  FC,
  forwardRef,
  LegacyRef,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import REQUIREMENTS, { REQUIREMENTS_DATA, RequirementType } from "requirements"
import { Requirement, Visibility } from "types"
import useCreateRequirement from "../hooks/useCreateRequirement"
import BalancyFooter from "./BalancyFooter"
import IsNegatedPicker from "./IsNegatedPicker"

const GENERAL_REQUIREMENTS_COUNT = 12
const general = REQUIREMENTS_DATA.slice(1, GENERAL_REQUIREMENTS_COUNT + 1)
const integrations = REQUIREMENTS_DATA.slice(GENERAL_REQUIREMENTS_COUNT + 1)

// call undocumented preload() from next/dynamic, so the components are already loaded when they mount, which is needed for the height animation
Object.values(REQUIREMENTS).forEach((a: any) => a.formComponent?.render?.preload?.())

const TRANSITION_DURATION_MS = 200
const HOME_MAX_HEIGHT = "550px"

type AddRequirementProps = { onAdd?: (req: Requirement) => void }

const AddRequirement = ({ onAdd }: AddRequirementProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [onCloseAttemptToast, setOnCloseAttemptToast] = useState()
  const toast = useToast()
  const [selectedType, setSelectedType] = useState<RequirementType>()
  const [height, setHeight] = useState("auto")
  const addCardRef = useRef()
  const homeRef = useRef(null)
  const formRef = useRef(null)

  const handleClose = (forceClose = false) => {
    if (onCloseAttemptToast && !forceClose)
      return toast({ status: "warning", title: onCloseAttemptToast })

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
        setHeight(HOME_MAX_HEIGHT)
      }, 10)
    }
  }, [selectedType, homeRef, formRef])

  return (
    <>
      <CardMotionWrapper>
        <AddCard
          ref={addCardRef}
          title="Add requirement"
          onClick={onOpen}
          data-test="add-requirement-button"
        />
      </CardMotionWrapper>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        scrollBehavior="inside"
        finalFocusRef={addCardRef}
      >
        <ModalOverlay />
        <ModalContent data-test="add-requirement-modal">
          <ModalCloseButton />
          <ModalHeader>
            <HStack>
              {selectedType && (
                <IconButton
                  rounded="full"
                  aria-label="Back"
                  size="sm"
                  mb="-3px"
                  icon={<ArrowLeft size={20} />}
                  variant="ghost"
                  onClick={() => setSelectedType(null)}
                />
              )}
              <Text w="calc(100% - 70px)" noOfLines={1}>{`Add ${
                REQUIREMENTS[selectedType]?.name ?? ""
              } requirement`}</Text>
            </HStack>
          </ModalHeader>

          <SimpleGrid
            overflow="hidden"
            w="200%"
            columns={2}
            // fixes Safari height glitch (ModalBody being taller than this wrapper element on small screens so it's not fully scrollable)
            templateRows="1fr auto"
            transform={selectedType ? "translateX(-50%)" : "translateX(0px)"}
            maxHeight={height}
            transition={`transform ${TRANSITION_DURATION_MS}ms, min-height ${TRANSITION_DURATION_MS}ms, max-height ${TRANSITION_DURATION_MS}ms`}
          >
            <AddRequirementHome ref={homeRef} {...{ setSelectedType }} />
            <AnimatePresence>
              {selectedType && (
                <AddRequirementForm
                  ref={formRef}
                  {...{ onAdd, handleClose, selectedType, setOnCloseAttemptToast }}
                />
              )}
            </AnimatePresence>
          </SimpleGrid>
        </ModalContent>
      </Modal>
    </>
  )
}

type AddRequirementFormProps = {
  onAdd?: (req: Requirement) => void
  handleClose: (forceClose?: boolean) => void
  selectedType?: RequirementType
  setOnCloseAttemptToast: Dispatch<SetStateAction<string | boolean>>
}

const AddRequirementForm = forwardRef(
  (
    {
      onAdd,
      handleClose,
      selectedType,
      setOnCloseAttemptToast,
    }: AddRequirementFormProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const FormComponent = REQUIREMENTS[selectedType].formComponent

    const methods = useForm<Requirement>({ mode: "all" })

    const roleVisibility: Visibility = useWatch({ name: ".visibility" })
    const roleId: number = useWatch({ name: ".id" })

    const [isPresent, safeToRemove] = usePresence()
    useEffect(() => {
      if (!isPresent) setTimeout(safeToRemove, TRANSITION_DURATION_MS)
    }, [isPresent, safeToRemove])

    const toast = useToast()
    const {
      onSubmit: onCreateRequirementSubmit,
      isLoading: isCreateRequirementLoading,
    } = useCreateRequirement(roleId, {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Successfully created requirement",
        })
        handleClose(true)
      },
    })

    const onSubmit = methods.handleSubmit((data) => {
      const requirement: Requirement = {
        type: selectedType,
        visibility: roleVisibility,
        ...data,
      }

      if (!roleId) {
        onAdd?.(requirement)
        handleClose(true)
      } else {
        onCreateRequirementSubmit(requirement)
      }
    }, console.error)

    return (
      <Box
        ref={ref}
        alignSelf="start"
        maxHeight="full"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <FormProvider {...methods}>
          <ModalBody>
            {REQUIREMENTS[selectedType].isNegatable && (
              <IsNegatedPicker baseFieldPath="" />
            )}
            <FormComponent
              baseFieldPath=""
              addRequirement={onSubmit}
              setOnCloseAttemptToast={setOnCloseAttemptToast}
            />
          </ModalBody>
          {selectedType !== "PAYMENT" && (
            <ModalFooter gap="3">
              <BalancyFooter baseFieldPath={null} />
              <Button
                colorScheme="green"
                onClick={onSubmit}
                isDisabled={!methods.formState.isDirty}
                isLoading={isCreateRequirementLoading}
                loadingText={isCreateRequirementLoading ? "Creating" : undefined}
                ml="auto"
              >
                Add requirement
              </Button>
            </ModalFooter>
          )}
        </FormProvider>
      </Box>
    )
  }
)

const AddRequirementHome = forwardRef(({ setSelectedType }: any, ref: any) => {
  const { featureFlags } = useGuild()
  const [search, setSearch] = useState("")
  const filteredIntegrations = integrations?.filter((integration) =>
    integration.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ModalBody ref={ref} maxHeight={HOME_MAX_HEIGHT} className="custom-scrollbar">
      <Heading size="sm" mb="3">
        General
      </Heading>
      <SimpleGrid columns={2} gap={2}>
        {general
          .filter(
            (req) =>
              req.types[0] !== "GUILD_SNAPSHOT" &&
              (!!featureFlags.includes("PAYMENT_REQUIREMENT") ||
                req.types[0] !== "PAYMENT")
          )
          .map((requirementButton) => (
            <Button
              key={requirementButton.types[0]}
              w="full"
              py={11}
              onClick={() => setSelectedType(requirementButton.types[0])}
            >
              <VStack w="full" whiteSpace="break-spaces">
                <Icon as={requirementButton.icon as FC} boxSize={6} />
                <Text as="span">{requirementButton.name}</Text>
              </VStack>
            </Button>
          ))}
      </SimpleGrid>

      <Heading size="sm" mb="3" mt="8">
        Integrations
      </Heading>
      <Stack>
        <SearchBar {...{ search, setSearch }} placeholder="Search integrations" />

        <AnimateSharedLayout>
          <AnimatePresence>
            {filteredIntegrations.length ? (
              filteredIntegrations.map((requirementButton) => (
                <CardMotionWrapper key={requirementButton.types[0]}>
                  <Tooltip
                    isDisabled={!(requirementButton as any).isDisabled}
                    label="Temporarily unavailable"
                    hasArrow
                  >
                    <Button
                      w="full"
                      py="8"
                      px="6"
                      leftIcon={
                        typeof requirementButton.icon === "string" ? (
                          <Img src={requirementButton.icon} boxSize="6" />
                        ) : (
                          <Icon as={requirementButton.icon} boxSize={6} />
                        )
                      }
                      rightIcon={<Icon as={CaretRight} />}
                      iconSpacing={4}
                      onClick={() => setSelectedType(requirementButton.types[0])}
                      isDisabled={(requirementButton as any).isDisabled}
                      sx={{ ".chakra-text": { w: "full", textAlign: "left" } }}
                    >
                      {requirementButton.name}
                    </Button>
                  </Tooltip>
                </CardMotionWrapper>
              ))
            ) : (
              <CardMotionWrapper delay={0.4}>
                <Text colorScheme="gray" py={4} textAlign="center">
                  Couldn't find any integrations
                </Text>
              </CardMotionWrapper>
            )}
          </AnimatePresence>
        </AnimateSharedLayout>
      </Stack>
    </ModalBody>
  )
})

export default AddRequirement
