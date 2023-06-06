import {
  Box,
  Flex,
  FormControl,
  HStack,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Plus, TrashSimple, X } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import capitalize from "utils/capitalize"
import isNumber from "utils/isNumber"
import parseFromObject from "utils/parseFromObject"
import useNftType from "../hooks/useNftType"

type Props = {
  attributes: Record<string, any>
  isAttributesLoading: boolean
  nftCustomAttributeNames: { label: string; value: string }[]
  baseFieldPath: string
  index: number
  onRemove: (index: number) => void
}

const AttributePicker = ({
  attributes,
  isAttributesLoading,
  nftCustomAttributeNames,
  baseFieldPath,
  index,
  onRemove,
}: Props): JSX.Element => {
  const bgColor = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    resetField,
    formState: { errors },
  } = useFormContext()

  const [isRangeValue, setIsRangeValue] = useState(
    getValues(`${baseFieldPath}.data.attributes.${index}.minValue`) ||
      getValues(`${baseFieldPath}.data.attributes.${index}.maxValue`)
  )

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })
  const { nftType } = useNftType(address, chain)

  const traitType = useWatch({
    name: `${baseFieldPath}.data.attributes.${index}.trait_type`,
  })

  const nftCustomAttributeValues = useMemo(() => {
    const mappedAttributeValues =
      attributes?.[traitType]?.map(
        nftType === "NOUNS"
          ? (attributeValue, i) => ({
              label: capitalize(attributeValue.toString()),
              value: i.toString(),
            })
          : (attributeValue) => ({
              label: capitalize(attributeValue.toString()),
              value: attributeValue,
            })
      ) || []

    // For interval-like attribute values, only return the 2 numbers in an array (don't prepend the "Any attribute value" option)
    if (
      nftType !== "NOUNS" &&
      mappedAttributeValues?.length === 2 &&
      mappedAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    )
      return mappedAttributeValues

    return [{ label: "Any attribute values", value: "" }].concat(
      mappedAttributeValues
    )
  }, [attributes, traitType, nftType])

  // Setting the "default values" this way, to avoid errors with the min-max inputs
  useEffect(() => {
    if (
      nftCustomAttributeValues?.length === 2 &&
      !getValues(`${baseFieldPath}.data.attributes.${index}.interval.min`) &&
      !getValues(`${baseFieldPath}.data.attributes.${index}.interval.max`) &&
      nftCustomAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    ) {
      setValue(
        `${baseFieldPath}.data.attributes.${index}.interval.min`,
        parseInt(nftCustomAttributeValues[0]?.value)
      )
      setValue(
        `${baseFieldPath}.data.attributes.${index}.interval.max`,
        parseInt(nftCustomAttributeValues[1]?.value)
      )
    }
  }, [nftCustomAttributeValues])

  const changeRange = () => {
    if (isRangeValue) {
      const latestMinValue = getValues(
        `${baseFieldPath}.data.attributes.${index}.minValue`
      )
      setValue(`${baseFieldPath}.data.attributes.${index}.value`, latestMinValue)
      resetField(`${baseFieldPath}.data.attributes.${index}.minValue`, {
        defaultValue: null,
      })
      resetField(`${baseFieldPath}.data.attributes.${index}.maxValue`, {
        defaultValue: null,
      })
    } else {
      const latestValue = getValues(
        `${baseFieldPath}.data.attributes.${index}.value`
      )
      setValue(`${baseFieldPath}.data.attributes.${index}.minValue`, latestValue)
      resetField(`${baseFieldPath}.data.attributes.${index}.value`, {
        defaultValue: null,
      })
    }

    setIsRangeValue(!isRangeValue)
  }

  return (
    <Box p={2} borderRadius="xl" bgColor={bgColor}>
      {nftCustomAttributeNames?.length ? (
        <Stack>
          <FormControl isDisabled={!nftCustomAttributeNames?.length}>
            <ControlledSelect
              name={`${baseFieldPath}.data.attributes.${index}.trait_type`}
              isLoading={isAttributesLoading}
              options={nftCustomAttributeNames}
              placeholder="Attribute"
              afterOnChange={() => {
                setValue(`${baseFieldPath}.data.attributes.${index}.value`, null)
                setValue(`${baseFieldPath}.data.attributes.${index}.interval`, null)
                clearErrors([
                  `${baseFieldPath}.data.attributes.${index}.value`,
                  `${baseFieldPath}.data.attributes.${index}.interval`,
                ])
              }}
            />
          </FormControl>

          {nftCustomAttributeValues?.length === 2 &&
          nftCustomAttributeValues
            .map((attributeValue) => parseInt(attributeValue.value))
            .every(isNumber) ? (
            <VStack alignItems="start">
              <HStack spacing={2} alignItems="start">
                <FormControl
                  isDisabled={!traitType}
                  isInvalid={
                    traitType?.length &&
                    !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                      index
                    ]?.interval?.min
                  }
                >
                  <Controller
                    name={
                      `${baseFieldPath}.data.attributes.${index}.interval.min` as const
                    }
                    control={control}
                    rules={{
                      required: "This field is required.",
                      min: {
                        value: nftCustomAttributeValues[0]?.value,
                        message: `Minimum: ${nftCustomAttributeValues[0]?.value}`,
                      },
                      max: {
                        value: getValues(
                          `${baseFieldPath}.data.attributes.${index}.interval.max`
                        ),
                        message: `Maximum: ${getValues(
                          `${baseFieldPath}.data.attributes.${index}.interval.max`
                        )}`,
                      },
                    }}
                    render={({
                      field: {
                        onChange,
                        onBlur,
                        value: value0NumberInputValue,
                        ref,
                      },
                    }) => (
                      <NumberInput
                        ref={ref}
                        value={value0NumberInputValue || undefined}
                        onChange={onChange}
                        onBlur={onBlur}
                        min={+nftCustomAttributeValues[0]?.value}
                        max={getValues(
                          `${baseFieldPath}.data.attributes.${index}.interval.max`
                        )}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>
                    {
                      parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                        index
                      ]?.interval?.min?.message
                    }
                  </FormErrorMessage>
                </FormControl>

                <Text as="span" h={1} pt={2}>
                  -
                </Text>

                <FormControl
                  isDisabled={!traitType}
                  isInvalid={
                    traitType?.length &&
                    !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                      index
                    ]?.interval?.max
                  }
                >
                  <Controller
                    name={
                      `${baseFieldPath}.data.attributes.${index}.interval.max` as const
                    }
                    control={control}
                    rules={{
                      required: "This field is required.",
                      min: {
                        value: getValues(
                          `${baseFieldPath}.data.attributes.${index}.interval.min`
                        ),
                        message: `Minimum: ${getValues(
                          `${baseFieldPath}.data.attributes.${index}.interval.min`
                        )}`,
                      },
                      max: {
                        value: nftCustomAttributeValues[1]?.value,
                        message: `Maximum: ${nftCustomAttributeValues[1]?.value}`,
                      },
                    }}
                    render={({
                      field: {
                        onChange,
                        onBlur,
                        value: value1NumberInputValue,
                        ref,
                      },
                    }) => (
                      <NumberInput
                        ref={ref}
                        value={value1NumberInputValue || undefined}
                        onChange={onChange}
                        onBlur={onBlur}
                        min={getValues(
                          `${baseFieldPath}.data.attributes.${index}.interval.min`
                        )}
                        max={+nftCustomAttributeValues[1]?.value}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />

                  <FormErrorMessage>
                    {
                      parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                        index
                      ]?.interval?.max?.message
                    }
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            </VStack>
          ) : (
            <FormControl
              isRequired={
                !!getValues(`${baseFieldPath}.data.attributes.${index}.trait_type`)
              }
              isInvalid={
                !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                  ?.value
              }
              isDisabled={!nftCustomAttributeNames?.length}
            >
              <ControlledSelect
                name={`${baseFieldPath}.data.attributes.${index}.value`}
                rules={{
                  required:
                    !nftCustomAttributeNames?.length &&
                    getValues(
                      `${baseFieldPath}.data.attributes.${index}.trait_type`
                    ) &&
                    "This field is required.",
                }}
                options={nftCustomAttributeValues}
                placeholder="Any attribute values"
              />

              <FormErrorMessage>
                {
                  parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                    ?.value?.message
                }
              </FormErrorMessage>
            </FormControl>
          )}
        </Stack>
      ) : (
        <FormControl>
          <Stack spacing={2}>
            <FormControl
              isRequired
              isInvalid={
                !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                  ?.trait_type
              }
            >
              <Input
                {...register(
                  `${baseFieldPath}.data.attributes.${index}.trait_type`,
                  { required: "Required" }
                )}
                placeholder="Key"
              />
              <FormErrorMessage>
                {
                  parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                    ?.trait_type?.message
                }
              </FormErrorMessage>
            </FormControl>

            {isRangeValue ? (
              <HStack alignItems="start">
                <FormControl
                  isRequired
                  isInvalid={
                    !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                      index
                    ]?.minValue
                  }
                >
                  <Input
                    {...register(
                      `${baseFieldPath}.data.attributes.${index}.minValue`,
                      {
                        required:
                          isRangeValue &&
                          !getValues(
                            `${baseFieldPath}.data.attributes.${index}.maxValue`
                          )
                            ? "Required"
                            : false,
                      }
                    )}
                    placeholder="From"
                  />
                  <FormErrorMessage>
                    {
                      parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                        index
                      ]?.minValue?.message
                    }
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={
                    !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                      index
                    ]?.maxValue
                  }
                >
                  <Input
                    {...register(
                      `${baseFieldPath}.data.attributes.${index}.maxValue`,
                      {
                        required:
                          isRangeValue &&
                          !getValues(
                            `${baseFieldPath}.data.attributes.${index}.minValue`
                          )
                            ? "Required"
                            : false,
                      }
                    )}
                    placeholder="To"
                  />
                  <FormErrorMessage>
                    {
                      parseFromObject(errors, baseFieldPath)?.data?.attributes?.[
                        index
                      ]?.maxValue?.message
                    }
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            ) : (
              <FormControl
                isRequired
                isInvalid={
                  !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                    ?.value
                }
              >
                <Input
                  {...register(`${baseFieldPath}.data.attributes.${index}.value`, {
                    required: isRangeValue ? false : "Required",
                  })}
                  placeholder="Value"
                />
                <FormErrorMessage>
                  {
                    parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                      ?.value?.message
                  }
                </FormErrorMessage>
              </FormControl>
            )}
          </Stack>
        </FormControl>
      )}

      <Flex mt={2}>
        <Button
          leftIcon={<Icon as={isRangeValue ? X : Plus} />}
          size="xs"
          borderRadius="md"
          onClick={changeRange}
        >
          {isRangeValue ? "Remove range" : "Add range"}
        </Button>

        <Button
          ml="auto"
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
    </Box>
  )
}

export default AttributePicker
