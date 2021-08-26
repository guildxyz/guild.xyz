import {
  Badge,
  CloseButton,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Kbd,
  Stack,
  Text,
  Textarea,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import Hint from "components/admin/common/Hint"
import PhotoUploader from "components/admin/common/PhotoUploader"
import Card from "components/common/Card"
import { Lock, LockOpen, LockSimpleOpen } from "phosphor-react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Icon as IconType } from "temporaryData/types"
import RadioCard from "./RadioCard"

type MembershipData = {
  name: string
  icon: IconType
}

type MembershipTypes = "OPEN" | "HOLD" | "STAKE"

const membershipsData: { [key: string]: MembershipData } = {
  OPEN: {
    name: "Open",
    icon: LockSimpleOpen,
  },
  HOLD: {
    name: "Hold",
    icon: LockOpen,
  },
  STAKE: {
    name: "Stake",
    icon: Lock,
  },
}

type Props = {
  index: number // index is (and should be) only used for managing the form state / removing a level form the form!
  onRemove: (levelId: number | null) => void
}

const AddLevel = ({ index, onRemove }: Props): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const options = ["OPEN", "HOLD", "STAKE"]
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "membership",
    defaultValue: getValues(`levels.${index}.requirementType`) || options[0],
    onChange: (newValue: MembershipTypes) =>
      setValue(`levels.${index}.requirementType`, newValue, { shouldDirty: true }),
  })

  const radioGroup = getRootProps()

  const requirementTypeChange = useWatch({ name: `levels.${index}.requirementType` })
  const isTGEnabledChange = useWatch({ name: "isTGEnabled" })

  return (
    <Card position="relative" width="full" padding={8}>
      <CloseButton
        position="absolute"
        top={4}
        right={4}
        width={10}
        height={10}
        rounded="full"
        zIndex="docked"
        aria-label="Remove level"
        onClick={() => onRemove(getValues(`levels.${index}.id`))}
      />

      <VStack spacing={12}>
        <Grid
          width="full"
          templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }}
          gap={12}
        >
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                {...register(`levels.${index}.name`, { required: true })}
                isInvalid={errors.levels && errors.levels[index]?.name}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            {/* Disabled for now, until we can't upload photos */}
            <FormControl>
              <FormLabel>
                <Text as="span" mr={1.5} opacity={0.5}>
                  Image
                </Text>{" "}
                <Badge>Coming soon</Badge>
              </FormLabel>
              <Controller
                render={({ field, fieldState }) => (
                  <PhotoUploader
                    ref={field.ref}
                    isInvalid={fieldState.invalid}
                    buttonText="Change image..."
                    isDisabled
                    onPhotoChange={(newPhoto: File) => field.onChange(newPhoto)}
                    {...field}
                  />
                )}
                name={`levels.${index}.image`}
                control={control}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea {...register(`levels.${index}.description`)} />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid
          width="full"
          templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }}
          gap={12}
        >
          <GridItem mb={-8} colSpan={{ base: 1, md: 2 }}>
            <Text as="h2" fontWeight="bold" fontSize="lg">
              Membership requirements
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Membership</FormLabel>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={6}
                {...radioGroup}
              >
                {options.map((value) => {
                  const radio = getRadioProps({ value })
                  return (
                    <RadioCard
                      key={value}
                      isDisabled={value === "STAKE" && !getValues("stakeToken")} // Disabling the "STAKE" radio if the community doesn't have a stakeToken
                      {...radio}
                    >
                      <HStack spacing={2} justify="center">
                        <Icon as={membershipsData[value].icon} />
                        <Text as="span">{membershipsData[value].name}</Text>
                      </HStack>
                    </RadioCard>
                  )
                })}
              </Stack>
              <Input
                type="hidden"
                {...register(`levels.${index}.requirementType`, {
                  required: true,
                })}
                defaultValue={
                  getValues(`levels.${index}.requirementType`) || options[0]
                }
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isDisabled={requirementTypeChange === "OPEN"}>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  {...register(`levels.${index}.requirement`, {
                    valueAsNumber: true,
                    required: requirementTypeChange !== "OPEN",
                    max: {
                      value: 2147483647, // Postgres Int max value
                      message:
                        "The maximum possible requirement amount is 2147483647",
                    },
                  })}
                  isInvalid={errors.levels && errors.levels[index]?.requirement}
                />
                <InputRightAddon
                  opacity={requirementTypeChange === "OPEN" ? 0.5 : 1}
                >
                  {getValues("tokenSymbol")}
                </InputRightAddon>
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isDisabled={requirementTypeChange !== "STAKE"}>
              <FormLabel>Timelock</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  {...register(`levels.${index}.stakeTimelockMs`, {
                    valueAsNumber: true,
                    required: requirementTypeChange === "STAKE",
                  })}
                  isInvalid={errors.levels && errors.levels[index]?.stakeTimelockMs}
                />
                <InputRightAddon
                  opacity={requirementTypeChange !== "STAKE" ? 0.5 : 1}
                >
                  month(s)
                </InputRightAddon>
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>

        {isTGEnabledChange && (
          <VStack width="full" spacing={6} alignItems="start">
            <Text as="h2" fontWeight="bold" fontSize="lg">
              Platform linking
            </Text>

            <FormControl>
              <FormLabel>
                <Text as="span">Telegram group</Text>
                <Hint
                  body={
                    <Text>
                      Medousa will send you the group id when you add her to your
                      group. If she's already in, type <Kbd>/groupId</Kbd> and she'll
                      send it again.
                    </Text>
                  }
                />
              </FormLabel>

              <Input
                width="full"
                placeholder="+ paste group ID"
                {...register(`levels.${index}.telegramGroupId`, {
                  required: isTGEnabledChange,
                  shouldUnregister: true,
                })}
                isInvalid={errors.levels && errors.levels[index]?.telegramGroupId}
              />
            </FormControl>
          </VStack>
        )}
      </VStack>
    </Card>
  )
}

export default AddLevel
