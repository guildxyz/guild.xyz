import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react"
import { Control, Path, useFormContext, useWatch } from "react-hook-form"
import { PlatformName } from "types"
import { DAY_IN_MS } from "utils/formatRelativeTimeFromNow"

type Props<TFieldValues, TContext> = {
  // Passing control, so we can infer the proper field names for the other 2 props
  control: Control<TFieldValues, TContext>
  startTimeField: Path<TFieldValues>
  endTimeField: Path<TFieldValues>
  platformType: PlatformName
} & StackProps

export const AUTO_TIMEFRAME_PLATFORMS: PlatformName[] = ["POAP"]

export const getShortDate = (isoDate: string): string | undefined => {
  if (!isoDate) return undefined
  return isoDate.split("T")[0]
}

export const datetimeLocalToIsoString = (datetimeLocal: string): string | null => {
  if (!datetimeLocal) return null

  try {
    return new Date(datetimeLocal).toISOString()
  } catch {
    return null
  }
}

const StartEndTimeForm = <TFieldValues, TContext>({
  control,
  startTimeField,
  endTimeField,
  platformType,
  ...stackProps
}: Props<TFieldValues, TContext>) => {
  const { register } = useFormContext<TFieldValues>()

  const startTimeValue = useWatch({ control, name: startTimeField })
  const endTimeValue = useWatch({ control, name: endTimeField })

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      mx="px"
      pb="px"
      w="calc(100% - 2px)"
      spacing={{ base: 4, md: 2 }}
      {...stackProps}
    >
      <FormControl>
        <FormLabel>
          {"Available from "}
          <Text as="span" colorScheme="gray">
            (UTC)
          </Text>
        </FormLabel>
        <Input
          type="date"
          {...register(startTimeField)}
          max={
            endTimeValue
              ? getShortDate(
                  new Date(
                    new Date(endTimeValue.toString()).getTime() - DAY_IN_MS
                  ).toISOString()
                )
              : undefined
          }
          isDisabled={AUTO_TIMEFRAME_PLATFORMS.includes(platformType)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>
          {"Available until "}
          <Text as="span" colorScheme="gray">
            (UTC)
          </Text>
        </FormLabel>
        <Input
          type="date"
          {...register(endTimeField)}
          min={
            startTimeValue &&
            new Date(startTimeValue.toString()).getTime() > Date.now()
              ? getShortDate(
                  new Date(
                    new Date(startTimeValue.toString()).getTime() + DAY_IN_MS
                  ).toISOString()
                )
              : getShortDate(new Date(Date.now() + DAY_IN_MS).toISOString())
          }
          isDisabled={AUTO_TIMEFRAME_PLATFORMS.includes(platformType)}
        />
      </FormControl>
    </Stack>
  )
}
export default StartEndTimeForm
