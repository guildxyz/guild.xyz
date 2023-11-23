import {
  FormControl,
  FormLabel,
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
} from "@chakra-ui/react"
import Button from "components/common/Button"
import CheckboxColorCard from "components/common/CheckboxColorCard"
import { Modal } from "components/common/Modal"
import { Clock, Hash } from "phosphor-react"
import { useController, useForm, useWatch } from "react-hook-form"
import { PlatformName } from "types"

export type RolePlatformAvailibiltyForm = {
  capacity?: number
  startTime?: string
  endTime?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  platformType: PlatformName
  defaultValues?: RolePlatformAvailibiltyForm
  isLoading?: boolean
  onDone: (data: RolePlatformAvailibiltyForm) => void
}

const AUTO_SUPPLY_PLATFORMS: PlatformName[] = ["UNIQUE_TEXT"]

export const DAY_IN_MS = 1000 * 60 * 60 * 24

const getShortDate = (isoDate: string): string | undefined => {
  if (!isoDate) return undefined
  return isoDate.split(/:\d{2}\.\d{3}Z/)[0]
}

const datetimeLocalToIsoString = (datetimeLocal: string): string | undefined => {
  if (!datetimeLocal) return undefined

  try {
    return new Date(datetimeLocal).toISOString()
  } catch {
    return undefined
  }
}

const EditRolePlatformAvailibiltyModal = ({
  isOpen,
  onClose,
  platformType,
  defaultValues,
  isLoading,
  onDone,
}: Props) => {
  const { control, register, setValue, handleSubmit } =
    useForm<RolePlatformAvailibiltyForm>({
      mode: "all",
      defaultValues: {
        capacity: defaultValues?.capacity,
        startTime: getShortDate(defaultValues?.startTime),
        endTime: getShortDate(defaultValues?.endTime),
      },
    })

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
    rules: {
      min: {
        value: 1,
        message: "Amount must be positive",
      },
    },
  })

  const startTimeValue = useWatch({ control, name: "startTime" })
  const endTimeValue = useWatch({ control, name: "endTime" })

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
      <ModalOverlay />
      <ModalContent maxW="39rem">
        <ModalHeader>Limit reward availibility</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={8}>
            <Text>
              You can limit the reward’s availability, so it’s not enough to satisfy
              the requirements, users also have to be fast claiming it.
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
                    <NumberInputField placeholder="0" />
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
                  setValue("startTime", null)
                  setValue("endTime", null)
                }}
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  mx="px"
                  pb="px"
                  w="calc(100% - 2px)"
                  spacing={{ base: 4, md: 2 }}
                >
                  <FormControl>
                    <FormLabel>
                      From{" "}
                      <Text as="span" colorScheme="gray">
                        (UTC)
                      </Text>
                    </FormLabel>
                    <Input
                      type="datetime-local"
                      {...register("startTime")}
                      max={
                        endTimeValue
                          ? getShortDate(
                              new Date(
                                new Date(endTimeValue).getTime() - DAY_IN_MS
                              ).toISOString()
                            )
                          : undefined
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      Available until{" "}
                      <Text as="span" colorScheme="gray">
                        (UTC)
                      </Text>
                    </FormLabel>
                    <Input
                      type="datetime-local"
                      {...register("endTime")}
                      min={
                        startTimeValue &&
                        new Date(startTimeValue).getTime() > Date.now()
                          ? getShortDate(
                              new Date(
                                new Date(startTimeValue).getTime() + DAY_IN_MS
                              ).toISOString()
                            )
                          : getShortDate(
                              new Date(Date.now() + DAY_IN_MS).toISOString()
                            )
                      }
                    />
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
                  startTime: datetimeLocalToIsoString(startTime),
                  endTime: datetimeLocalToIsoString(endTime),
                })
              })}
              isLoading={isLoading}
              loadingText="Saving"
            >
              Done
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditRolePlatformAvailibiltyModal
