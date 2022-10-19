import { FormControl, FormLabel, Icon, Input, Stack, Text } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import Link from "components/common/Link"
import StyledSelect from "components/common/StyledSelect"
import { ArrowSquareOut } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { FormCardProps, SelectOption } from "types"
import capitalize from "utils/capitalize"
import parseFromObject from "utils/parseFromObject"
import ChainInfo from "./../ChainInfo"
import useSnapshots from "./hooks/useSnapshots"
import useStrategyParamsArray from "./hooks/useStrategyParamsArray"

const SnapshotFormCard = ({ baseFieldPath, field }: FormCardProps): JSX.Element => {
  const [defaultValueObject, setDefaultValueObject] = useState(null)

  useEffect(() => {
    setDefaultValueObject({ ...field?.data?.strategy?.params })
  }, [])

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext()

  const dataStrategyName = useWatch({
    name: `${baseFieldPath}data.strategy.name`,
    control,
  })

  const { strategies, isLoading } = useSnapshots()

  const strategyParams = useStrategyParamsArray(dataStrategyName)

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
    const prevValues = getValues(`${baseFieldPath}data.strategy.params`)
    Object.keys(prevValues || {}).forEach((prevParam) => {
      const strategyParamsNames = ["min"].concat(
        strategyParams.map((param) => param.name)
      )
      if (!strategyParamsNames?.includes(prevParam)) {
        setValue(`${baseFieldPath}data.strategy.params.${prevParam}`, undefined)
      }
    })

    // Set up default values when picked strategy changes
    strategyParams.forEach((param) => {
      setValue(
        `${baseFieldPath}data.strategy.params.${param.name}`,
        parseFromObject(dirtyFields, baseFieldPath)?.data?.strategy?.name
          ? param.defaultValue
          : defaultValueObject?.[param.name]
      )
    })
  }, [strategyParams])

  // We don't display this input rn, just sending a default 0 value to the API
  useEffect(() => {
    setValue(`${baseFieldPath}data.strategy.params.min`, 0)
  }, [])

  return (
    <Stack spacing={4} alignItems="start">
      <ChainInfo>Works on ETHEREUM</ChainInfo>

      <FormControl
        position="relative"
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.strategy?.name}
      >
        <FormLabel>Strategy:</FormLabel>
        <Controller
          name={`${baseFieldPath}data.strategy.name` as const}
          control={control}
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
              onChange={(newValue: SelectOption) => onChange(newValue?.value)}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.strategy?.name?.message}
        </FormErrorMessage>
      </FormControl>

      {strategyParams?.map((param) => (
        <FormControl
          key={`${dataStrategyName}-${param.name}`}
          isRequired
          isInvalid={
            !!parseFromObject(errors, baseFieldPath)?.data?.strategy?.params?.[
              param.name
            ]
          }
          mb={2}
        >
          <FormLabel>{capitalize(param.name)}</FormLabel>
          <Input
            {...register(
              `${baseFieldPath}data.strategy.params.${param.name}` as const,
              {
                required: "This field is required.",
                valueAsNumber: typeof param.defaultValue === "number",
              }
            )}
            defaultValue={field?.data?.strategy?.params?.[param.name]}
          />
          <FormErrorMessage>
            {
              parseFromObject(errors, baseFieldPath)?.data?.strategy?.params?.[
                param.name
              ]?.message as string
            }
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
    </Stack>
  )
}

export default SnapshotFormCard
