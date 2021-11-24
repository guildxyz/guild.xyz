import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import FormCard from "../FormCard"
import useSnapshots from "./hooks/useSnapshots"
import useStrategyParamsArray from "./hooks/useStrategyParamsArray"

type Props = {
  index: number
  onRemove?: () => void
}

const SnapshotFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    control,
  } = useFormContext()

  // Set up default value if needed
  const defaultKey = getValues(`requirements.${index}.key`)

  const pickedStrategy = useWatch({ name: `requirements.${index}.key` })
  const strategyParams = useStrategyParamsArray(pickedStrategy)
  const { strategies, isLoading } = useSnapshots()

  // Set up default values when picked strategy changes
  useEffect(() => {
    strategyParams.forEach((param) =>
      setValue(`requirements.${index}.value.${param.name}`, param.defaultValue)
    )
  }, [strategyParams])

  const capitalize = (text: string) => {
    if (text.length > 1) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return text
  }

  // We don't display this input rn, just sending a default 0 value to the API
  useEffect(() => {
    setValue(`requirements.${index}.value.min`, 0)
  }, [])

  return (
    <FormCard type="SNAPSHOT" onRemove={onRemove}>
      <FormControl
        position="relative"
        isRequired
        isInvalid={errors?.requirements?.[index]?.key}
      >
        <FormLabel>Pick a strategy:</FormLabel>
        <Controller
          control={control}
          name={`requirements.${index}.key`}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, ref } }) => (
            <Select
              inputRef={ref}
              options={strategies?.map((strategy) => ({
                label: capitalize(strategy.name),
                value: strategy.name,
              }))}
              isLoading={isLoading}
              onChange={(newValue) => onChange(newValue.value)}
              placeholder={defaultKey || "Search..."}
              onBlur={() => trigger(`requirements.${index}.key`)}
            />
          )}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.key?.message}
        </FormErrorMessage>
      </FormControl>

      {strategyParams.map((param) => (
        <FormControl
          key={`${pickedStrategy}-${param.name}`}
          isRequired
          isInvalid={errors?.requirements?.[index]?.value?.[param.name]}
          mb={2}
        >
          <FormLabel>{capitalize(param.name)}</FormLabel>
          <Input
            {...register(`requirements.${index}.value.${param.name}`, {
              required: "This field is required.",
              shouldUnregister: true,
              valueAsNumber: typeof param.defaultValue === "number",
            })}
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
    </FormCard>
  )
}

export default SnapshotFormCard
