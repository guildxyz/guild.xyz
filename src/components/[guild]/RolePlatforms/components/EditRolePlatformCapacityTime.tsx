import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import CheckboxColorCard from "components/common/CheckboxColorCard"
import { Modal } from "components/common/Modal"
import { Clock, GearSix, Hash } from "phosphor-react"
import { useController, useForm } from "react-hook-form"
import { PlatformName } from "types"

type RolePlatformCapacityTimeForm = {
  capacity?: number
  startTime?: string
  endTime?: string
}

type Props = {
  platformType: PlatformName
  defaultValues?: RolePlatformCapacityTimeForm
  onDone: (data: RolePlatformCapacityTimeForm) => void
  isCompact?: boolean
}

const AUTO_SUPPLY_PLATFORMS: PlatformName[] = ["UNIQUE_TEXT"]

const normalizeDate = (isoDate: string): string | undefined => {
  if (!isoDate) return undefined

  try {
    return new Date(isoDate.split("T")[0]).toISOString()
  } catch {
    return undefined
  }
}

const getShortDate = (isoDate: string): string | undefined => {
  if (!isoDate) return undefined

  return isoDate.split("T")[0]
}

const EditRolePlatformCapacityTime = ({
  platformType,
  defaultValues,
  onDone,
  isCompact,
}: Props) => {
  const { control, register, setValue, handleSubmit } =
    useForm<RolePlatformCapacityTimeForm>({
      mode: "all",
      defaultValues: {
        capacity: defaultValues?.capacity,
        startTime: getShortDate(defaultValues?.startTime),
        endTime: getShortDate(defaultValues?.endTime),
      },
    })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    field: {
      ref: capacityFieldRef,
      value: capacityFieldValue,
      onChange: capacityFieldOnChange,
      onBlur: capacityFieldOnBlur,
    },
  } = useController({
    control,
    name: "capacity",
    defaultValue: 1,
    rules: {
      min: {
        value: 1,
        message: "Amount must be positive",
      },
    },
  })

  const buttonProps = {
    variant: "outline",
    size: "xs",
    borderRadius: "md",
    borderWidth: 1,
    onClick: onOpen,
  }

  return (
    <>
      {isCompact ? (
        <IconButton
          {...buttonProps}
          aria-label="Limit availibility"
          px={1.5}
          icon={<GearSix />}
        />
      ) : (
        <Button {...buttonProps} leftIcon={<Clock />}>
          Limit availibility
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark" size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Limit reward availibility</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={8}>
              <Text>
                You can limit the reward’s availability, so it’s not enough to
                satisfy the requirements, users also have to be fast claiming it.
              </Text>

              <Stack spacing={4}>
                <Tooltip
                  label="Automatic by the number of secrets"
                  isDisabled={!AUTO_SUPPLY_PLATFORMS.includes(platformType)}
                  shouldWrapChildren
                  hasArrow
                >
                  <CheckboxColorCard
                    isDisabled={AUTO_SUPPLY_PLATFORMS.includes(platformType)}
                    defaultChecked={
                      AUTO_SUPPLY_PLATFORMS.includes(platformType) ||
                      !!defaultValues?.capacity
                    }
                    colorScheme="purple"
                    icon={Hash}
                    title="Limit supply"
                    description="First come, first served. Max-cap the number of users that can claim the reward"
                    onChange={(e) => {
                      if (e.target.checked) return
                      setValue("capacity", null)
                    }}
                  >
                    <NumberInput
                      min={1}
                      mx="px"
                      pb="px"
                      w="calc(100% - 2px)"
                      isDisabled={AUTO_SUPPLY_PLATFORMS.includes(platformType)}
                      ref={capacityFieldRef}
                      value={capacityFieldValue ?? ""}
                      onBlur={capacityFieldOnBlur}
                      onChange={(_, valueAsNumber) => {
                        capacityFieldOnChange(
                          !isNaN(valueAsNumber) ? valueAsNumber : ""
                        )
                      }}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </CheckboxColorCard>
                </Tooltip>

                <CheckboxColorCard
                  colorScheme="purple"
                  icon={Clock}
                  title="Limit claiming time"
                  description="Set a time frame the reward will be only claimable within"
                  defaultChecked={
                    !!defaultValues?.startTime || !!defaultValues?.endTime
                  }
                  onChange={(e) => {
                    if (e.target.checked) return
                    setValue("startTime", "")
                    setValue("endTime", "")
                  }}
                >
                  <Stack direction={{ base: "column", md: "row" }}>
                    <FormControl>
                      <FormLabel>
                        {"From "}
                        <Text as="span" colorScheme="gray">
                          (optional)
                        </Text>
                      </FormLabel>
                      <Input type="date" {...register("startTime")} />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Available until</FormLabel>
                      <Input type="date" {...register("endTime")} />
                    </FormControl>
                  </Stack>
                </CheckboxColorCard>
              </Stack>

              <Button
                colorScheme="green"
                ml="auto"
                onClick={handleSubmit(({ capacity, startTime, endTime }) => {
                  onDone({
                    capacity,
                    startTime: normalizeDate(startTime),
                    endTime: normalizeDate(endTime),
                  })
                  onClose()
                })}
              >
                Done
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditRolePlatformCapacityTime
