import {
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
import rewards from "platforms/rewards"
import { FormProvider, useController, useForm } from "react-hook-form"
import { PlatformName } from "types"
import StartEndTimeForm, {
  AUTO_TIMEFRAME_PLATFORMS,
  datetimeLocalToIsoString,
  getShortDate,
} from "./components/StartEndTimeForm"

export type RolePlatformAvailabilityForm = {
  capacity?: number
  startTime?: string
  endTime?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  platformType: PlatformName
  claimedCount?: number
  defaultValues?: RolePlatformAvailabilityForm
  isLoading?: boolean
  onDone: (data: RolePlatformAvailabilityForm) => void
}

const AUTO_SUPPLY_PLATFORMS: Partial<Record<PlatformName, string>> = {
  UNIQUE_TEXT: "secrets",
  POAP: "minting links",
}

const EditRewardAvailabilityModal = ({
  isOpen,
  onClose,
  claimedCount,
  platformType,
  defaultValues,
  isLoading,
  onDone,
}: Props) => {
  const methods = useForm<RolePlatformAvailabilityForm>({
    mode: "all",
    defaultValues: {
      capacity: defaultValues?.capacity,
      startTime: getShortDate(defaultValues?.startTime),
      endTime: getShortDate(defaultValues?.endTime),
    },
  })
  const { control, setValue, handleSubmit } = methods

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
    rules: !AUTO_SUPPLY_PLATFORMS[platformType]
      ? {
          min: {
            value: 1,
            message: "Amount must be positive",
          },
        }
      : undefined,
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
      <ModalOverlay />
      <ModalContent maxW="39rem">
        <ModalHeader>Limit reward availability</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...methods}>
            <Stack spacing={8}>
              <Text>
                You can limit the reward’s availability, so it’s not enough to
                satisfy the requirements, users also have to be fast claiming it.
              </Text>

              <Stack spacing={4}>
                <Tooltip
                  label={`Automatic by the number of ${AUTO_SUPPLY_PLATFORMS[platformType]}`}
                  isDisabled={!AUTO_SUPPLY_PLATFORMS[platformType]}
                  shouldWrapChildren
                  hasArrow
                >
                  <CheckboxColorCard
                    isDisabled={!!AUTO_SUPPLY_PLATFORMS[platformType]}
                    defaultChecked={
                      !!AUTO_SUPPLY_PLATFORMS[platformType] ||
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
                      min={1 < claimedCount ? claimedCount : 1}
                      mx="px"
                      pb="px"
                      w="calc(100% - 2px)"
                      isDisabled={!!AUTO_SUPPLY_PLATFORMS[platformType]}
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

                <Tooltip
                  label={`Automatic by ${
                    rewards[platformType]?.name ?? "reward"
                  } data`}
                  isDisabled={!AUTO_TIMEFRAME_PLATFORMS.includes(platformType)}
                  shouldWrapChildren
                  hasArrow
                >
                  <CheckboxColorCard
                    isDisabled={AUTO_TIMEFRAME_PLATFORMS.includes(platformType)}
                    colorScheme="purple"
                    icon={Clock}
                    title="Limit claiming time"
                    description="Set a time frame the reward will be only claimable within"
                    defaultChecked={
                      AUTO_TIMEFRAME_PLATFORMS.includes(platformType) ||
                      !!defaultValues?.startTime ||
                      !!defaultValues?.endTime
                    }
                    onChange={(e) => {
                      if (e.target.checked) return
                      setValue("startTime", null)
                      setValue("endTime", null)
                    }}
                  >
                    <StartEndTimeForm
                      control={control}
                      startTimeField="startTime"
                      endTimeField="endTime"
                      platformType={platformType}
                    />
                  </CheckboxColorCard>
                </Tooltip>
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
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditRewardAvailabilityModal
