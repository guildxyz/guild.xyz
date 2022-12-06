import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { TrashSimple } from "phosphor-react"
import { useMemo } from "react"
import { Controller, useController, useFormContext } from "react-hook-form"
import useSnapshots from "requirements/Snapshot/hooks/useSnapshots"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"

type Props = {
  baseFieldPath: string
  index: number
  onRemove: (index: number) => void
}

const SingleStrategy = ({ baseFieldPath, index, onRemove }: Props): JSX.Element => {
  const bgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  const {
    field: {
      name: strategyFieldName,
      onBlur: strategyFieldOnBlur,
      onChange: strategyFieldOnChange,
      ref: strategyFieldRef,
      value: strategyFieldValue,
    },
  } = useController({
    name: `${baseFieldPath}.data.strategies.${index}.name`,
    rules: { required: "This field is required." },
  })

  const { strategies, isLoading } = useSnapshots()

  const mappedStrategies = useMemo(
    () =>
      Object.entries(strategies ?? {}).map(([id]) => ({
        label: id,
        value: id,
      })),
    [strategies]
  )

  const selectedStrategyData = Object.entries(strategies ?? {}).find(
    ([id]) => id === strategyFieldValue
  )?.[1]?.schema?.definitions.Strategy

  return (
    <Box p={4} borderRadius="xl" bgColor={bgColor}>
      <Stack spacing={4} alignItems="start">
        <FormControl
          position="relative"
          isRequired
          isInvalid={
            !!parseFromObject(errors, baseFieldPath)?.data?.strategies?.[index]?.name
          }
        >
          <FormLabel>Strategy:</FormLabel>

          <StyledSelect
            ref={strategyFieldRef}
            name={strategyFieldName}
            isClearable
            isLoading={isLoading}
            options={mappedStrategies}
            placeholder="Search..."
            value={
              mappedStrategies?.find(
                (strategy) => strategy.value === strategyFieldValue
              ) ?? ""
            }
            onChange={(newValue: SelectOption) =>
              strategyFieldOnChange(newValue?.value)
            }
            onBlur={strategyFieldOnBlur}
          />

          <FormErrorMessage>
            {
              parseFromObject(errors, baseFieldPath)?.data?.strategies?.[index]?.name
                ?.message
            }
          </FormErrorMessage>
        </FormControl>

        {Object.entries(selectedStrategyData?.properties ?? {}).map(
          ([key, prop]) => (
            <FormControl
              key={key}
              isRequired={selectedStrategyData.required.includes(key)}
              isInvalid={
                !!parseFromObject(errors, baseFieldPath)?.data?.strategies?.[index]
                  ?.params?.[key]
              }
            >
              <FormLabel>{prop.title}</FormLabel>

              {(() => {
                switch (prop.type) {
                  case "number":
                    return (
                      <Controller
                        name={`${baseFieldPath}.data.strategies.${index}.params.${key}`}
                        control={control}
                        rules={{
                          required: selectedStrategyData.required.includes(key)
                            ? "This field is required."
                            : false,
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <NumberInput
                            ref={ref}
                            value={value ?? undefined}
                            onChange={onChange}
                            onBlur={onBlur}
                          >
                            <NumberInputField placeholder={prop.examples?.[0]} />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      />
                    )
                  case "string":
                    return (
                      <Input
                        {...register(
                          `${baseFieldPath}.data.strategies.${index}.params.${key}`,
                          {
                            required: selectedStrategyData.required.includes(key)
                              ? "This field is required."
                              : false,
                            pattern: prop.pattern
                              ? {
                                  value: prop.pattern,
                                  message: "Invalid value",
                                }
                              : undefined,
                            minLength: prop.minLength,
                            maxLength: prop.maxLength,
                          }
                        )}
                        placeholder={prop.examples?.[0]}
                      />
                    )
                  // case "object":
                  //   return null
                  // Unsupported field
                  // e.g.: https://github.com/snapshot-labs/snapshot-strategies/blob/master/src/strategies/ctsi-staking/schema.json
                }
              })()}

              <FormErrorMessage>
                {
                  parseFromObject(errors, baseFieldPath)?.data?.strategies?.[index]
                    ?.params?.[key]?.message
                }
              </FormErrorMessage>
            </FormControl>
          )
        )}
      </Stack>

      {index > 0 && (
        <Flex mt={2} justifyContent="end">
          <Button
            leftIcon={<Icon as={TrashSimple} />}
            size="xs"
            borderRadius="md"
            colorScheme="red"
            variant="ghost"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        </Flex>
      )}
    </Box>
  )
}

export default SingleStrategy
