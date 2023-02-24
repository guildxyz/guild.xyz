import {
  Circle,
  FormControlProps,
  HStack,
  IconButton,
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
import {
  GlobeHemisphereEast,
  GlobeHemisphereWest,
  IconProps,
  LockSimple,
  UserPlus,
} from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Visibility } from "types"

const SetVisibility = (props: {
  entityType: "role" | "requirement" | "reward"
  fieldBase?: string
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <IconButton
        variant="gh"
        size={props.entityType === "reward" ? "xs" : undefined}
        aria-label="Set visibility attribute"
        icon={<GlobeHemisphereEast color="var(--chakra-colors-gray-500)" />}
        onClick={onOpen}
      />

      <SetVisibilityModal {...props} isOpen={isOpen} onClose={onClose} />
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
  const { setValue } = useFormContext()
  const saveAndClose = () => {
    setValue(visibilityField, localVisibility)
    onClose()
  }
  const visibilityField = `${fieldBase}.visibility`
  const actualVisibility = useWatch({ name: visibilityField })

  const [localVisibility, setLocalVisibility] =
    useState<Visibility>(actualVisibility)

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
                title: "Public",
                description: "Visible to everyone",
                RightComponent: getLeftSideIcon(GlobeHemisphereWest),
              },
              {
                value: Visibility.PRIVATE,
                title: "Private",
                description: "Only visible to role holders",
                RightComponent: getLeftSideIcon(UserPlus),
              },
              {
                value: Visibility.HIDDEN,
                title: "Hidden",
                description: "Only visible to you and other admins of the guild",
                RightComponent: getLeftSideIcon(LockSimple),
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
