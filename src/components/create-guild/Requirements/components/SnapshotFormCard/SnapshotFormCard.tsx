import { FormControl, FormLabel, Icon, Input, Text } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import Link from "components/common/Link"
import StyledSelect from "components/common/StyledSelect"
import { ArrowSquareOut } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField, SelectOption } from "types"
import ChainInfo from "./../ChainInfo"
import useSnapshots from "./hooks/useSnapshots"
import useStrategyParamsArray from "./hooks/useStrategyParamsArray"

type Props = {
  index: number
  field: RequirementFormField
}

const SnapshotFormCard = ({ index, field }: Props): JSX.Element => {
  const [defaultValueObject, setDefaultValueObject] = useState(null)

  useEffect(() => {
    setDefaultValueObject({ ...field?.value })
  }, [])

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext()

  const pickedStrategy = useWatch({ name: `requirements.${index}.key`, control })

  const { strategies, isLoading } = useSnapshots()

  const strategyParams = useStrategyParamsArray(pickedStrategy)

  const capitalize = (text: string) => {
    if (text.length > 1) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return text
  }

  const mappedStrategies = useMemo(
    () =>
      strategies?.map((strategy) => ({
        label: capitalize(strategy.name),
        value: strategy.name,
      })),
    [strategies]
  )

  useEffect(() => {
    if (!strategyParams) return
    // Delete fields of the previous strategy
    const prevValues = getValues(`requirements.${index}.value`)
    Object.keys(prevValues || {}).forEach((prevParam) => {
      const strategyParamsNames = ["min"].concat(
        strategyParams.map((param) => param.name)
      )
      if (!strategyParamsNames?.includes(prevParam)) {
        setValue(`requirements.${index}.value.${prevParam}`, undefined)
      }
    })

    // Set up default values when picked strategy changes
    strategyParams.forEach((param) => {
      // const fieldValue =
      setValue(
        `requirements.${index}.value.${param.name}`,
        dirtyFields?.requirements?.[index]?.key
          ? param.defaultValue
          : defaultValueObject?.[param.name]
      )
    })
  }, [strategyParams])

  // We don't display this input rn, just sending a default 0 value to the API
  useEffect(() => {
    setValue(`requirements.${index}.value.min`, 0)
  }, [])

  return (
    <>
      <ChainInfo>Works on ETHEREUM</ChainInfo>

      <FormControl
        position="relative"
        isRequired
        isInvalid={errors?.requirements?.[index]?.key}
      >
        <FormLabel>Strategy:</FormLabel>
        <Controller
          name={`requirements.${index}.key` as const}
          control={control}
          defaultValue={field.key}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isLoading}
              options={mappedStrategies}
              placeholder="Search..."
              value={mappedStrategies?.find((strategy) => strategy.value === value)}
              defaultValue={mappedStrategies?.find(
                (strategy) => strategy.value === field.key
              )}
              onChange={(newValue: SelectOption) => onChange(newValue?.value)}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.key?.message}
        </FormErrorMessage>
      </FormControl>

      {strategyParams?.map((param) => (
        <FormControl
          key={`${pickedStrategy}-${param.name}`}
          isRequired
          isInvalid={errors?.requirements?.[index]?.value?.[param.name]}
          mb={2}
        >
          <FormLabel>{capitalize(param.name)}</FormLabel>
          <Input
            {...register(`requirements.${index}.value.${param.name}` as const, {
              required: "This field is required.",
              valueAsNumber: typeof param.defaultValue === "number",
            })}
            defaultValue={field?.value?.[param.name]}
          />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.value?.[param.name]?.message}
          </FormErrorMessage>
        </FormControl>
      ))}

      <Link
        href="https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies"
        isExternal
      >
        <Text fontSize="sm">Snapshot strategies</Text>
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </>
  )
}

export default SnapshotFormCard
