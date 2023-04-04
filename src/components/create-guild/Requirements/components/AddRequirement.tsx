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
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Modal } from "components/common/Modal"
import SearchBar from "components/explorer/SearchBar"
import useGuild from "components/[guild]/hooks/useGuild"
import { AnimatePresence, AnimateSharedLayout, usePresence } from "framer-motion"
import useDebouncedState from "hooks/useDebouncedState"
import useToast from "hooks/useToast"
import { ArrowLeft, CaretRight } from "phosphor-react"
import { FC, forwardRef, useEffect, useRef, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import REQUIREMENTS, { REQUIREMENTS_DATA } from "requirements"
import { Visibility } from "types"
import BalancyFooter from "./BalancyFooter"
import IsNegatedPicker from "./IsNegatedPicker"

const GENERAL_REQUIREMENTS_COUNT = 8
const general = REQUIREMENTS_DATA.slice(1, GENERAL_REQUIREMENTS_COUNT + 1)
const integrations = REQUIREMENTS_DATA.slice(GENERAL_REQUIREMENTS_COUNT + 1)

// call undocumented preload() from next/dynamic, so the components are already loaded when they mount, which is needed for the height animation
Object.values(REQUIREMENTS).forEach((a: any) => a.formComponent?.render?.preload?.())

const TRANSITION_DURATION_MS = 200
const HOME_MAXHEIGHT = "550px"

const AddRequirement = ({ onAdd }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [onCloseAttemptToast, setOnCloseAttemptToast] = useState()
  const toast = useToast()
  const [selectedType, setSelectedType] = useState<string>()
  const [height, setHeight] = useState("auto")
  const addCardRef = useRef()
  const homeRef = useRef(null)
  const formRef = useRef(null)

  const handleClose = () => {
    if (onCloseAttemptToast)
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
        setHeight(HOME_MAXHEIGHT)
      }, 10)
    }
  }, [selectedType, homeRef, formRef])

  return (
    <>
      <CardMotionWrapper>
        <AddCard ref={addCardRef} title="Add requirement" onClick={onOpen} />
      </CardMotionWrapper>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        scrollBehavior="inside"
        finalFocusRef={addCardRef}
      >
        <ModalOverlay />
        <ModalContent>
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
            <AddRequirementHome
              ref={homeRef}
              {...{ selectedType, setSelectedType }}
            />
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

const AddRequirementForm = forwardRef(
  ({ onAdd, handleClose, selectedType, setOnCloseAttemptToast }: any, ref: any) => {
    const FormComponent = REQUIREMENTS[selectedType].formComponent

    const methods = useForm({ mode: "all" })
    const roleVisibility: Visibility = useWatch({ name: ".visibility" })

    const [isPresent, safeToRemove] = usePresence()
    useEffect(() => {
      if (!isPresent) setTimeout(safeToRemove, TRANSITION_DURATION_MS)
    }, [isPresent])

    const onSubmit = methods.handleSubmit((data) => {
      onAdd({
        type: selectedType,
        visibility: roleVisibility,
        ...data,
      })
      handleClose()
    })

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
            {selectedType !== "PAYMENT" && <IsNegatedPicker baseFieldPath="" />}
            <FormComponent
              baseFieldPath=""
              addRequirement={onSubmit}
              setOnCloseAttemptToast={setOnCloseAttemptToast}
            />
          </ModalBody>
          {selectedType !== "PAYMENT" && (
            <ModalFooter gap="3">
              <BalancyFooter baseFieldPath={null} />
              <Button colorScheme="green" onClick={onSubmit} ml="auto">
                Add requirement
              </Button>
            </ModalFooter>
          )}
        </FormProvider>
      </Box>
    )
  }
)

const AddRequirementHome = forwardRef(
  ({ selectedType, setSelectedType }: any, ref: any) => {
    const { featureFlags } = useGuild()

    const [search, setSearch] = useState("")
    const filteredIntegrations = integrations?.filter((integration) =>
      integration.name.toLowerCase().includes(search.toLowerCase())
    )

    const debouncedSelectedValue = useDebouncedState(
      selectedType,
      TRANSITION_DURATION_MS
    )

    const openPaymentRequirementNotionForm = () => {
      if (typeof window === "undefined") return
      window
        .open(
          "https://notionforms.io/forms/payment-requirement-alpha-interest-form-warden-edition",
          "_blank"
        )
        ?.focus()
    }

    return (
      <ModalBody
        ref={ref}
        minHeight={!debouncedSelectedValue ? HOME_MAXHEIGHT : undefined}
        maxHeight={HOME_MAXHEIGHT}
        className="custom-scrollbar"
      >
        <Heading size="sm" mb="3">
          General
        </Heading>
        <SimpleGrid columns={2} gap={2}>
          {general.map((requirementButton) => {
            const isPayment = requirementButton.types[0] === "PAYMENT"
            const isPaymentAllowed = featureFlags?.includes("PAYMENT_REQUIREMENT")

            return (
              <Button
                key={requirementButton.types[0]}
                w="full"
                py={11}
                onClick={() =>
                  isPayment && !isPaymentAllowed
                    ? openPaymentRequirementNotionForm()
                    : setSelectedType(requirementButton.types[0])
                }
              >
                <VStack w="full" whiteSpace="break-spaces">
                  <Icon as={requirementButton.icon as FC} boxSize={6} />
                  <Text as="span">{requirementButton.name}</Text>
                </VStack>

                {isPayment && (
                  <Tag
                    position="absolute"
                    top={2}
                    right={2}
                    size="sm"
                    bgColor="blue.500"
                    color="white"
                  >
                    Alpha
                  </Tag>
                )}
              </Button>
            )
          })}
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
                      isDisabled={!(requirementButton as any).disabled}
                      label="Temporarily unavailable"
                      hasArrow
                    >
                      <Button
                        w="full"
                        py="8"
                        px="6"
                        leftIcon={
                          <Img src={requirementButton.icon as string} boxSize="6" />
                        }
                        rightIcon={<Icon as={CaretRight} />}
                        iconSpacing={4}
                        onClick={() => setSelectedType(requirementButton.types[0])}
                        isDisabled={(requirementButton as any).disabled}
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
  }
)

export default AddRequirement
