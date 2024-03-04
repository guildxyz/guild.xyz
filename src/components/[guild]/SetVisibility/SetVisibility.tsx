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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import RadioSelect from "components/common/RadioSelect"
import { useRef } from "react"
import { FormProvider, useController, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"
import useVisibilityTooltipLabel from "./hooks/useVisibilityTooltipLabel"
import { VISIBILITY_DATA } from "./visibilityData"

type FilterableEntity = "role" | "requirement" | "reward"
export type SetVisibilityForm = {
  visibility?: Visibility
  visibilityRoleId?: number
}

const SetVisibility = ({
  entityType,
  isOpen,
  onOpen,
  onClose,
  onSave,
  isLoading,
  defaultValues = {
    visibility: Visibility.PUBLIC,
    visibilityRoleId: undefined,
  },
  ...buttonProps
}: {
  entityType: FilterableEntity
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onSave: (data: SetVisibilityForm) => void
  isLoading?: boolean
  defaultValues?: SetVisibilityForm
} & ButtonProps) => {
  const methods = useForm<SetVisibilityForm>({
    mode: "all",
    defaultValues,
  })

  const buttonRef = useRef()

  const { field: visibilityField } = useController({
    control: methods.control,
    name: "visibility",
  })

  const visibilityRoleId: number = useWatch({
    control: methods.control,
    name: "visibilityRoleId",
  })

  const tooltipLabel = useVisibilityTooltipLabel(
    visibilityField.value,
    visibilityRoleId
  )

  const circleBgColor = useColorModeValue("blackAlpha.200", "gray.600")

  const options = Object.entries(VISIBILITY_DATA).map(
    ([key, { Icon, Child, ...rest }]) => ({
      value: key,
      leftComponent: (
        <Circle bg={circleBgColor} p={3}>
          <Icon />
        </Circle>
      ),
      ...rest,
      children: Child && <Child />,
    })
  )

  if (!visibilityField.value) {
    return null
  }

  const Icon = VISIBILITY_DATA[visibilityField.value].Icon

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
          {VISIBILITY_DATA[visibilityField.value].title}
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={buttonRef}
        size="lg"
        colorScheme="dark"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change {entityType} visibility</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormProvider {...methods}>
              <RadioSelect
                colorScheme="indigo"
                options={options}
                {...visibilityField}
              />
            </FormProvider>
          </ModalBody>

          <ModalFooter>
            <HStack justifyContent={"end"}>
              <Button
                colorScheme={"green"}
                onClick={() =>
                  onSave({
                    visibility: visibilityField.value,
                    visibilityRoleId,
                  })
                }
                isLoading={isLoading}
                loadingText="Saving"
              >
                Done
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SetVisibility
