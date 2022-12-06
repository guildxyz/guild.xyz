import {
  FormControl,
  FormLabel,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import Link from "components/common/Link"
import Switch from "components/common/Switch"
import { Chain, supportedChains } from "connectors"
import { ArrowSquareOut, Plus } from "phosphor-react"
import { useEffect } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import parseFromObject from "utils/parseFromObject"
import SpaceSelect from "../SpaceSelect"
import SingleStrategy from "./components/SingleStrategy"

const unsupportedChains: Chain[] = ["RINKEBY", "NOVA"]

const Strategy = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    control,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    name: `${baseFieldPath}.data.strategies`,
  })

  useEffect(() => {
    if (fields?.length) return
    append(
      {},
      {
        shouldFocus: false,
      }
    )
  }, [])

  return (
    <>
      <ChainPicker
        controlName={`${baseFieldPath}.chain`}
        supportedChains={supportedChains.filter(
          (c) => !unsupportedChains.includes(c)
        )}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.block}
      >
        <FormLabel>Block number</FormLabel>

        <Controller
          name={`${baseFieldPath}.data.block` as const}
          control={control}
          rules={{
            required: "This field is required.",
            min: {
              value: 0,
              message: "Must be a positive number",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumberInput
              isDisabled={getValues(`${baseFieldPath}.data.block`) === "latest"}
              ref={ref}
              value={typeof value === "number" ? value : ""}
              onChange={(newValue) => {
                const parsedValue = parseInt(newValue)
                onChange(isNaN(parsedValue) ? "" : parsedValue)
              }}
              onBlur={onBlur}
              min={0}
            >
              <NumberInputField
                placeholder={
                  getValues(`${baseFieldPath}.data.block`) === "latest"
                    ? "Latest"
                    : undefined
                }
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.block?.message}
        </FormErrorMessage>

        <Switch
          mt={4}
          title="Use the latest block number"
          isChecked={getValues(`${baseFieldPath}.data.block`) === "latest"}
          onChange={(e) => {
            clearErrors(`${baseFieldPath}.data.block`)
            setValue(`${baseFieldPath}.data.block`, e.target.checked ? "latest" : "")
          }}
        />
      </FormControl>

      <SpaceSelect optional baseFieldPath={baseFieldPath} />

      <Text as="span" fontWeight="medium">
        Strategies
      </Text>

      <Stack spacing={2} w="full">
        {fields?.map((field, fieldIndex) => (
          <SingleStrategy
            key={field.id}
            index={fieldIndex}
            baseFieldPath={baseFieldPath}
            onRemove={remove}
          />
        ))}

        <Button leftIcon={<Icon as={Plus} />} onClick={() => append({})}>
          Add strategy
        </Button>
      </Stack>

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

export default Strategy
