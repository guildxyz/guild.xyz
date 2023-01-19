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
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { TrashSimple } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"
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
    formState: { errors },
  } = useFormContext()

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

  return (
    <Box p={2} borderRadius="xl" bgColor={bgColor}>
      {nftCustomAttributeNames?.length ? (
        <Stack>
          <FormControl isDisabled={!nftCustomAttributeNames?.length}>
            <Controller
              name={`${baseFieldPath}.data.attributes.${index}.trait_type` as const}
              control={control}
              render={({
                field: { onChange, onBlur, value: keySelectValue, ref },
              }) => (
                <StyledSelect
                  ref={ref}
                  isLoading={isAttributesLoading}
                  options={
                    nftCustomAttributeNames?.length > 0
                      ? nftCustomAttributeNames
                      : []
                  }
                  placeholder="Attribute"
                  value={
                    keySelectValue
                      ? nftCustomAttributeNames?.find(
                          (attributeName) => attributeName.value === keySelectValue
                        )
                      : null
                  }
                  onChange={(newValue: SelectOption) => {
                    onChange(newValue?.value ?? null)
                    setValue(`${baseFieldPath}.data.attributes.${index}.value`, null)
                    setValue(
                      `${baseFieldPath}.data.attributes.${index}.interval`,
                      null
                    )
                    clearErrors([
                      `${baseFieldPath}.data.attributes.${index}.value`,
                      `${baseFieldPath}.data.attributes.${index}.interval`,
                    ])
                  }}
                  onBlur={onBlur}
                />
              )}
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
              <Controller
                name={`${baseFieldPath}.data.attributes.${index}.value` as const}
                control={control}
                rules={{
                  required:
                    getValues(
                      `${baseFieldPath}.data.attributes.${index}.trait_type`
                    ) && "This field is required.",
                }}
                render={({
                  field: { onChange, onBlur, value: valueSelectValue, ref },
                }) => (
                  <StyledSelect
                    ref={ref}
                    options={
                      nftCustomAttributeValues?.length > 0
                        ? nftCustomAttributeValues
                        : []
                    }
                    placeholder="Any attribute values"
                    value={
                      nftCustomAttributeValues?.find(
                        (attributeValue) => attributeValue.value === valueSelectValue
                      ) || ""
                    }
                    onChange={(newValue: SelectOption) =>
                      onChange(newValue.value ?? null)
                    }
                    onBlur={onBlur}
                  />
                )}
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
          <HStack w="full" spacing={2} alignItems="start">
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
            <Text as="span" h={10} lineHeight={10}>
              :
            </Text>
            <FormControl
              isRequired
              isInvalid={
                !!parseFromObject(errors, baseFieldPath)?.data?.attributes?.[index]
                  ?.value
              }
            >
              <Input
                {...register(`${baseFieldPath}.data.attributes.${index}.value`, {
                  required: "Required",
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
          </HStack>
        </FormControl>
      )}

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
    </Box>
  )
}

export default AttributePicker
