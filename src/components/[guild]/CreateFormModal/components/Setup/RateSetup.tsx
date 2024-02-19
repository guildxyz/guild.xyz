import { Flex, Grid, Input, Stack, Text } from "@chakra-ui/react"
import StyledSelect from "components/common/StyledSelect"
import { useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"
import Rate from "../Display/Rate"

type Props = {
  index: number
}

const RateSetup = ({ index }: Props) => {
  const field = useWatch({ name: `fields.${index}` })

  return (
    <Stack>
      <Rate field={field} isDisabled />

      <Grid templateColumns={{ md: "2fr 1fr" }} gap={2}>
        <Grid
          templateColumns={{
            base: "auto 85px 1fr",
            md: "auto var(--chakra-sizes-24) 1fr",
          }}
          gap={2}
        >
          <LabelSetup type="worst" fieldIndex={index} />
          <LabelSetup type="best" fieldIndex={index} />
        </Grid>
      </Grid>
    </Stack>
  )
}

type LabelSetupProps = {
  type: "worst" | "best"
  fieldIndex: number
}

const baseOptionsArray = [...Array(11)].map((_, i) => ({
  label: i.toString(),
  value: i,
}))

const labelSetupConfig: Record<
  LabelSetupProps["type"],
  {
    label: string
    options: SelectOption<number>[]
    labelFieldName: string
  }
> = {
  worst: {
    label: "Start",
    options: baseOptionsArray.slice(0, 2),
    labelFieldName: "worstLabel",
  },
  best: {
    label: "End",
    options: baseOptionsArray.slice(2, baseOptionsArray.length),
    labelFieldName: "bestLabel",
  },
}

const LabelSetup = ({ fieldIndex, type }: LabelSetupProps) => {
  const { register, getValues, setValue } = useFormContext()
  const optionsFieldName = `fields.${fieldIndex}.options`

  return (
    <>
      <Flex alignItems="center">
        <Text
          as="span"
          fontWeight="bold"
          fontSize="xs"
          textTransform="uppercase"
          color="GrayText"
        >
          {labelSetupConfig[type].label}
        </Text>
      </Flex>
      <StyledSelect
        defaultValue={labelSetupConfig[type].options.at(-1)}
        options={labelSetupConfig[type].options}
        onChange={({ value }) => {
          const currentRateOptions = getValues(optionsFieldName)
          if (type === "worst") {
            setValue(
              optionsFieldName,
              generateOptionsFromValue(value, currentRateOptions.at(-1).value)
            )
          } else {
            setValue(
              optionsFieldName,
              generateOptionsFromValue(currentRateOptions[0].value, value)
            )
          }
        }}
      />
      <Input
        {...register(
          `fields.${fieldIndex}.${labelSetupConfig[type].labelFieldName}`
        )}
        placeholder="Label (optional)"
      />
    </>
  )
}

const generateOptionsFromValue = (min: number, max: number): number[] => {
  const generatedArray = []

  for (let i = min; i <= max; i++) {
    generatedArray.push({ label: i.toString(), value: i })
  }

  return generatedArray
}

export default RateSetup
