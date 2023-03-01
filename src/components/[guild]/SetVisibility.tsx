import {
  Circle,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import RadioSelect from "components/common/RadioSelect"
import { Eye, EyeClosed, EyeSlash, IconProps } from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes, useRef } from "react"
import { useController, useWatch } from "react-hook-form"
import { Visibility } from "types"

export const visibilityData = {
  [Visibility.PUBLIC]: {
    title: "Public",
    Icon: Eye,
    description: "Visible to everyone",
  },
  [Visibility.PRIVATE]: {
    title: "Private",
    Icon: EyeSlash,
    description: "Only visible to role holders",
  },
  [Visibility.HIDDEN]: {
    title: "Hidden",
    Icon: EyeClosed,
    description: "Only visible to admins",
  },
}

type FilterableEntity = "role" | "requirement" | "reward"

const SetVisibility = (props: {
  entityType: FilterableEntity
  fieldBase?: string
}) => {
  const parentField = props.fieldBase ?? ""
  const { isOpen, onClose, onOpen } = useDisclosure()

  const currentVisibility: Visibility = useWatch({
    name: `${parentField}.visibility`,
  })

  const Icon = visibilityData[currentVisibility ?? Visibility.PUBLIC].Icon

  const buttonRef = useRef()

  return (
    <>
      <Button ml={3} size="xs" leftIcon={<Icon />} onClick={onOpen} ref={buttonRef}>
        {visibilityData[currentVisibility].title}
      </Button>

      <SetVisibilityModal
        {...props}
        fieldBase={parentField}
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={buttonRef}
      />
    </>
  )
}

const getLeftSideIcon =
  (Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>) =>
  () =>
    (
      <Circle bg={"gray.600"} p={3} ml={"0 !important"} mr={"3 !important"}>
        <Icon />
      </Circle>
    )

const SetVisibilityModal = ({
  entityType,
  fieldBase = "",
  isOpen,
  onClose,
  ...modalProps
}: {
  entityType: "role" | "requirement" | "reward"
  fieldBase?: string
  isOpen: boolean
  onClose: () => void
} & Partial<ModalProps>) => {
  const visibilityField = `${fieldBase}.visibility`
  const { field } = useController({ name: visibilityField })

  const saveAndClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={saveAndClose} size="lg" {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change {entityType} visibility</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RadioSelect
            colorScheme="indigo"
            options={Object.entries(visibilityData).map(
              ([value, { Icon, ...rest }]) => ({
                value,
                ...rest,
                RightComponent: getLeftSideIcon(Icon),
              })
            )}
            {...field}
          />
        </ModalBody>

        <ModalFooter>
          <HStack justifyContent={"end"}>
            <Button colorScheme={"green"} onClick={saveAndClose}>
              Done
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SetVisibility
