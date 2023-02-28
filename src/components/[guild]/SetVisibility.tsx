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

const VisibilityIcons = {
  [Visibility.PUBLIC]: GlobeHemisphereWest,
  [Visibility.PRIVATE]: UserPlus,
  [Visibility.HIDDEN]: LockSimple,
}

const VisibilityReadableName = {
  [Visibility.PUBLIC]: "Public",
  [Visibility.PRIVATE]: "Private",
  [Visibility.HIDDEN]: "Hidden",
}

const SetVisibility = (props: {
  entityType: "role" | "requirement" | "reward"
  fieldBase?: string
}) => {
  const parentField = props.fieldBase ?? ""
  const { isOpen, onClose, onOpen } = useDisclosure()

  const currentVisibility = useWatch({ name: `${parentField}.visibility` })

  const Icon = VisibilityIcons[currentVisibility ?? Visibility.PUBLIC]

  return (
    <>
      <Button ml={3} size="xs" leftIcon={<Icon />} onClick={onOpen}>
        {VisibilityReadableName[currentVisibility]}
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
            options={[
              {
                value: Visibility.PUBLIC,
                title: VisibilityReadableName[Visibility.PUBLIC],
                description: "Visible to everyone",
                RightComponent: getLeftSideIcon(VisibilityIcons[Visibility.PUBLIC]),
              },
              {
                value: Visibility.PRIVATE,
                title: VisibilityReadableName[Visibility.PRIVATE],
                description: "Only visible to role holders",
                RightComponent: getLeftSideIcon(VisibilityIcons[Visibility.PRIVATE]),
              },
              {
                value: Visibility.HIDDEN,
                title: VisibilityReadableName[Visibility.HIDDEN],
                description: "Only visible to you and other admins of the guild",
                RightComponent: getLeftSideIcon(VisibilityIcons[Visibility.HIDDEN]),
              },
            ]}
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
