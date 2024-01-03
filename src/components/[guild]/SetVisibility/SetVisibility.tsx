import {
  ButtonProps,
  Circle,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import RadioSelect from "components/common/RadioSelect"
import { useRef } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { Visibility } from "types"
import useVisibilityTooltipLabel from "./hooks/useVisibilityTooltipLabel"
import {
  VISIBILITY_DATA,
  VISIBILITY_DATA_BASED_ON_ROLE_VISIBILITY,
} from "./visibilityData"

type FilterableEntity = "role" | "requirement" | "reward"

const SetVisibility = ({
  entityType,
  fieldBase,
  ...buttonProps
}: {
  entityType: FilterableEntity
  fieldBase?: string
} & ButtonProps) => {
  const parentField = fieldBase ?? ""
  const { isOpen, onClose, onOpen } = useDisclosure()

  const buttonRef = useRef()

  const currentVisibility: Visibility = useWatch({
    name: `${parentField}.visibility`,
  })

  const currentVisibilityRoleId: number = useWatch({
    name: `${parentField}.visibilityRoleId`,
  })

  const tooltipLabel = useVisibilityTooltipLabel(
    currentVisibility,
    currentVisibilityRoleId
  )

  if (!currentVisibility) {
    return null
  }

  const Icon = VISIBILITY_DATA[currentVisibility].Icon

  return (
    <>
      {entityType === "role" ? (
        <Button
          ml={3}
          size="xs"
          leftIcon={<Icon />}
          onClick={onOpen}
          ref={buttonRef}
          {...buttonProps}
        >
          {VISIBILITY_DATA[currentVisibility].title}
        </Button>
      ) : (
        <Tooltip label={tooltipLabel} placement="top" hasArrow>
          <IconButton
            size={"xs"}
            variant="ghost"
            icon={<Icon />}
            aria-label="Set visibility"
            onClick={onOpen}
            ref={buttonRef}
            ml={1}
            color="gray"
            {...buttonProps}
          />
        </Tooltip>
      )}

      <SetVisibilityModal
        entityType={entityType}
        fieldBase={parentField}
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={buttonRef}
      />
    </>
  )
}

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
  const { colorMode } = useColorMode()

  const saveAndClose = () => {
    onClose()
  }

  const requirements = useWatch({ name: "requirements" })
  const rolePlatforms = useWatch({ name: "rolePlatforms" })
  const { setValue } = useFormContext()
  const roleVisibility = useWatch({ name: ".visibility" })

  const mapToAtLeastPrivate = (entities, base) =>
    entities?.forEach(({ visibility }, index) => {
      if (visibility === Visibility.PUBLIC) {
        setValue(`${base}.${index}.visibility`, Visibility.PRIVATE, {
          shouldDirty: true,
        })
      }
    })

  const mapToHidden = (entities, base) =>
    entities?.forEach(({ visibility }, index) => {
      if (visibility !== Visibility.HIDDEN) {
        setValue(`${base}.${index}.visibility`, Visibility.HIDDEN, {
          shouldDirty: true,
        })
      }
    })

  const onChange = (newValue: Visibility) => {
    if (entityType === "role") {
      if (newValue === Visibility.PRIVATE) {
        mapToAtLeastPrivate(requirements, "requirements")
        mapToAtLeastPrivate(rolePlatforms, "rolePlatforms")
      } else if (newValue === Visibility.HIDDEN) {
        mapToHidden(requirements, "requirements")
        mapToHidden(rolePlatforms, "rolePlatforms")
      }
    }

    setValue(visibilityField, newValue, { shouldDirty: true })
  }

  const options = Object.entries(VISIBILITY_DATA).map(
    ([key, { Icon, Child, ...rest }]) => ({
      value: key,
      leftComponent: (
        <Circle bg={colorMode === "dark" ? "gray.600" : "blackAlpha.200"} p={3}>
          <Icon />
        </Circle>
      ),
      ...rest,
      ...(entityType === "role"
        ? {}
        : VISIBILITY_DATA_BASED_ON_ROLE_VISIBILITY[key]?.[roleVisibility] ?? {}),
      children: Child && <Child fieldBase={fieldBase} />,
    })
  )

  return (
    <Modal
      colorScheme={"dark"}
      isOpen={isOpen}
      onClose={saveAndClose}
      size="lg"
      {...modalProps}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change {entityType} visibility</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RadioSelect
            colorScheme="indigo"
            options={options}
            {...field}
            onChange={onChange}
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
