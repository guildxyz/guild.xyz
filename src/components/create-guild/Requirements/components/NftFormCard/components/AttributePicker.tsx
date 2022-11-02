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
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { TrashSimple } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, SelectOption } from "types"
import capitalize from "utils/capitalize"
import isNumber from "utils/isNumber"
import useNftType from "../hooks/useNftType"

type Props = {
  metadata: Record<string, any>
  isMetadataLoading: boolean
  nftCustomAttributeNames: { label: string; value: string }[]
  parentFieldIndex: number
  index: number
  onRemove: (index: number) => void
}

const AttributePicker = ({
  metadata,
  isMetadataLoading,
  nftCustomAttributeNames,
  parentFieldIndex,
  index,
  onRemove,
}: Props): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const chain = useWatch({ name: `requirements.${parentFieldIndex}.chain` })
  const address = useWatch({ name: `requirements.${parentFieldIndex}.address` })
  const { nftType } = useNftType(address, chain)

  const traitType = useWatch({
    name: `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type`,
  })

  const nftCustomAttributeValues = useMemo(() => {
    const mappedAttributeValues =
      metadata?.[traitType]?.map(
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
  }, [metadata, traitType, nftType])

  // Setting the "default values" this way, to avoid errors with the min-max inputs
  useEffect(() => {
    if (
      nftCustomAttributeValues?.length === 2 &&
      !getValues(
        `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.min`
      ) &&
      !getValues(
        `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.max`
      ) &&
      nftCustomAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    ) {
      setValue(
        `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.min`,
        parseInt(nftCustomAttributeValues[0]?.value)
      )
      setValue(
        `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.max`,
        parseInt(nftCustomAttributeValues[1]?.value)
      )
    }
  }, [nftCustomAttributeValues])

  return (
    <Box p={2} borderWidth={1} borderRadius="lg">
      {nftCustomAttributeNames?.length ? (
        <Stack>
          <FormControl isDisabled={!nftCustomAttributeNames?.length}>
            {/* <FormLabel>Custom attribute:</FormLabel> */}

            <Controller
              name={
                `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type` as const
              }
              control={control}
              render={({
                field: { onChange, onBlur, value: keySelectValue, ref },
              }) => (
                <StyledSelect
                  ref={ref}
                  isLoading={isMetadataLoading}
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
                    onChange(newValue?.value)
                    setValue(
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.value`,
                      null
                    )
                    setValue(
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval`,
                      null
                    )
                    clearErrors([
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.value`,
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval`,
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
                    !!errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[
                      index
                    ]?.interval?.min
                  }
                >
                  <Controller
                    name={
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.min` as const
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
                          `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.max`
                        ),
                        message: `Maximum: ${getValues(
                          `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.max`
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
                          `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.max`
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
                      errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[
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
                    !!errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[
                      index
                    ]?.interval?.max
                  }
                >
                  <Controller
                    name={
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.max` as const
                    }
                    control={control}
                    rules={{
                      required: "This field is required.",
                      min: {
                        value: getValues(
                          `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.min`
                        ),
                        message: `Minimum: ${getValues(
                          `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.min`
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
                          `requirements.${parentFieldIndex}.data.traitTypes.${index}.interval.min`
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
                      errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[
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
                !!getValues(
                  `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type`
                )
              }
              isInvalid={
                !!errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[index]
                  ?.value
              }
              isDisabled={!nftCustomAttributeNames?.length}
            >
              {/* <FormLabel>Custom attribute value:</FormLabel> */}
              <Controller
                name={
                  `requirements.${parentFieldIndex}.data.traitTypes.${index}.value` as const
                }
                control={control}
                rules={{
                  required:
                    getValues(
                      `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type`
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
                    onChange={(newValue: SelectOption) => onChange(newValue.value)}
                    onBlur={onBlur}
                  />
                )}
              />

              <FormErrorMessage>
                {
                  errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[index]
                    ?.value?.message
                }
              </FormErrorMessage>
            </FormControl>
          )}
        </Stack>
      ) : (
        <FormControl>
          {/* <FormLabel>Metadata:</FormLabel> */}

          <HStack w="full" spacing={2} alignItems="start">
            <FormControl>
              <Input
                {...register(
                  `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type`
                )}
                // TODO: do we need this?
                // defaultValue={field.data?.attribute?.trait_type}
                placeholder="Key"
              />
            </FormControl>
            <Text as="span" h={10} lineHeight={10}>
              :
            </Text>
            <FormControl
              isRequired={
                !!getValues(
                  `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type`
                )
              }
              isInvalid={
                !!errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[index]
                  ?.value
              }
            >
              <Input
                {...register(
                  `requirements.${parentFieldIndex}.data.traitTypes.${index}.value`,
                  {
                    required:
                      getValues(
                        `requirements.${parentFieldIndex}.data.traitTypes.${index}.trait_type`
                      ) && "This field is required.",
                  }
                )}
                // TODO: do we need this?
                // defaultValue={field.data?.attribute?.value}
                placeholder="Value"
              />
              <FormErrorMessage>
                {
                  errors?.requirements?.[parentFieldIndex]?.data?.traitTypes?.[index]
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
