import {
  Circle,
  FormControlProps,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import RadioSelect from "components/common/RadioSelect"
import { GlobeHemisphereWest, IconProps, LockSimple, UserPlus } from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Visibility } from "types"

export const visibilityData = {
  [Visibility.PUBLIC]: {
    title: "Public",
    Icon: GlobeHemisphereWest,
    description: "Visible to everyone",
  },
  [Visibility.PRIVATE]: {
    title: "Private",
    Icon: UserPlus,
    description: "Only visible to role holders",
  },
  [Visibility.HIDDEN]: {
    title: "Hidden",
    Icon: LockSimple,
    description: "Only visible to you and other admins of the guild",
  },
}

const SetVisibility = (props: {
  entityType: "role" | "requirement" | "reward"
  fieldBase?: string
}) => {
  const parentField = props.fieldBase ?? ""
  const { isOpen, onClose, onOpen } = useDisclosure()

  const currentVisibility: Visibility = useWatch({
    name: `${parentField}.visibility`,
  })

  const Icon = visibilityData[currentVisibility ?? Visibility.PUBLIC].Icon

  return (
    <>
      <Button ml={3} size="xs" leftIcon={<Icon />} onClick={onOpen}>
        {visibilityData[currentVisibility].title}
      </Button>

      <SetVisibilityModal
        {...props}
        fieldBase={parentField}
        isOpen={isOpen}
        onClose={onClose}
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
}: {
  entityType: "role" | "requirement" | "reward"
  fieldBase?: string
  isOpen: boolean
  onClose: () => void
} & FormControlProps) => {
  const visibilityField = `${fieldBase}.visibility`
  const { setValue } = useFormContext()
  const actualVisibility = useWatch({ name: visibilityField })
  const [localVisibility, setLocalVisibility] =
    useState<Visibility>(actualVisibility)

  const saveAndClose = () => {
    setValue(visibilityField, localVisibility, { shouldValidate: false })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={saveAndClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change {entityType} visibility</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RadioSelect
            colorScheme="indigo"
            value={localVisibility}
            onChange={(newVisibility) =>
              setLocalVisibility(newVisibility as Visibility)
            }
            options={Object.entries(visibilityData).map(
              ([visibility, { Icon, ...rest }]) => ({
                value: visibility,
                ...rest,
                RightComponent: getLeftSideIcon(Icon),
              })
            )}
          />
        </ModalBody>

        <ModalFooter>
          <HStack justifyContent={"end"}>
            <Button
              variant={"ghost"}
              onClick={() => {
                setLocalVisibility(Visibility.PUBLIC)
                onClose()
              }}
            >
              Cancel
            </Button>
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
