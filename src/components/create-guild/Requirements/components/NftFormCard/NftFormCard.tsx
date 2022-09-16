import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, NftRequirementType, Requirement, SelectOption } from "types"
import capitalize from "utils/capitalize"
import isNumber from "utils/isNumber"
import ChainPicker from "../ChainPicker"
import MinMaxAmount from "../MinMaxAmount"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"
import useNftType from "./hooks/useNftType"

type Props = {
  index: number
  field: Requirement
}

type NftRequirementTypeOption = {
  label: string
  value: NftRequirementType
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const nftRequirementTypeOptions: Array<NftRequirementTypeOption> = [
  {
    label: "Amount",
    value: "AMOUNT",
  },
  {
    label: "Attribute",
    value: "ATTRIBUTE",
  },
  {
    label: "Custom ID",
    value: "CUSTOM_ID",
  },
]

const NftFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const type = useWatch({ name: `requirements.${index}.type` })
  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const traitType = useWatch({
    name: `requirements.${index}.data.attribute.trait_type`,
  })
  const nftRequirementType = useWatch({
    name: `requirements.${index}.nftRequirementType`,
  })

  const { nftType, isLoading: isNftTypeLoading } = useNftType(address, chain)

  useEffect(() => {
    if (isNftTypeLoading) return

    if (nftType === "ERC1155" && type !== "ERC1155")
      setValue(`requirements.${index}.type`, "ERC1155")
    if (nftType === "SIMPLE" && type === "ERC1155")
      setValue(`requirements.${index}.type`, "ERC721")
    if (nftType === "NOUNS" && type !== "NOUNS")
      setValue(`requirements.${index}.type`, "NOUNS")
  }, [nftType, isNftTypeLoading])

  const [addressInput, setAddressInput] = useState("")
  const { nfts, isLoading } = useNfts(chain)
  const mappedNfts = useMemo(
    () =>
      nfts?.map((nft) => ({
        img: nft.logoUri,
        label: nft.name,
        value: nft.address,
        slug: nft.slug,
      })),
    [nfts]
  )

  const {
    isValidating: isNftNameSymbolLoading,
    data: { name: nftName, symbol: nftSymbol },
  } = useTokenData(chain, address)

  const nftImage = useMemo(
    () => mappedNfts?.find((nft) => nft.value === address)?.img,
    [address, mappedNfts]
  )

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(
    address,
    pickedNftSlug
  )

  const nftCustomAttributeNames = useMemo(
    () =>
      Object.keys(metadata || {})
        ?.filter((attributeName) => attributeName !== "error")
        .map((attributeName) => ({
          label: capitalize(attributeName) || "Any attribute",
          value: attributeName,
        })),
    [metadata]
  )

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
      !getValues(`requirements.${index}.data.attribute.interval.min`) &&
      !getValues(`requirements.${index}.data.attribute.interval.max`) &&
      nftCustomAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    ) {
      setValue(
        `requirements.${index}.data.attribute.interval.min`,
        parseInt(nftCustomAttributeValues[0]?.value)
      )
      setValue(
        `requirements.${index}.data.attribute.interval.max`,
        parseInt(nftCustomAttributeValues[1]?.value)
      )
    }
  }, [nftCustomAttributeValues])

  const mappedNftRequirementTypeOptions =
    Object.keys(metadata || {})?.length ||
    chain === "ETHEREUM" ||
    chain === "POLYGON"
      ? nftRequirementTypeOptions
      : nftRequirementTypeOptions.filter((option) => option.value !== "ATTRIBUTE")

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.data.attribute.trait_type`, null)
    setValue(`requirements.${index}.data.attribute.value`, null)
    setValue(`requirements.${index}.data.attribute.interval`, null)
    setValue(`requirements.${index}.data.id`, null)
    setValue(`requirements.${index}.data.minAmount`, undefined)
    setValue(`requirements.${index}.data.maxAmount`, undefined)
    setValue(`requirements.${index}.nftRequirementType`, null)
    clearErrors([
      `requirements.${index}.address`,
      `requirements.${index}.data.attribute.trait_type`,
      `requirements.${index}.data.attribute.value`,
      `requirements.${index}.data.attribute.interval`,
      `requirements.${index}.data.id`,
      `requirements.${index}.data.minAmount`,
      `requirements.${index}.data.maxAmount`,
      `requirements.${index}.nftRequirementType`,
    ])
  }

  // Reset key, value, interval, amount fields on nftRequirementType change
  const resetDetails = () => {
    setValue(`requirements.${index}.data.attribute.trait_type`, null)
    setValue(`requirements.${index}.data.attribute.value`, null)
    setValue(`requirements.${index}.data.attribute.interval`, null)
    setValue(`requirements.${index}.data.id`, null)
    setValue(`requirements.${index}.data.minAmount`, undefined)
    setValue(`requirements.${index}.data.maxAmount`, undefined)
    clearErrors([
      `requirements.${index}.data.attribute.trait_type`,
      `requirements.${index}.data.attribute.value`,
      `requirements.${index}.data.attribute.interval`,
      `requirements.${index}.data.id`,
      `requirements.${index}.data.minAmount`,
      `requirements.${index}.data.maxAmount`,
    ])
  }

  const customFilterOption = (candidate, input) =>
    candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
    candidate.value.toLowerCase() === input?.toLowerCase()

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        onChange={resetForm}
      />

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>NFT:</FormLabel>
        <InputGroup>
          {address &&
            (nftImage ? (
              <InputLeftElement>
                <OptionImage img={nftImage} alt={nftName} />
              </InputLeftElement>
            ) : (
              <InputLeftAddon px={2} maxW={14}>
                {isNftNameSymbolLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span" fontSize="xs" fontWeight="bold" isTruncated>
                    {nftSymbol}
                  </Text>
                )}
              </InputLeftAddon>
            ))}
          <Controller
            name={`requirements.${index}.address` as const}
            control={control}
            defaultValue={field.address}
            rules={{
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
            }}
            render={({
              field: { onChange, onBlur, value: addressSelectValue, ref },
            }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                placeholder={
                  chain === "ETHEREUM"
                    ? "Search or paste address"
                    : "Paste NFT address"
                }
                options={mappedNfts ?? []}
                filterOption={customFilterOption}
                value={
                  (chain === "ETHEREUM" && addressSelectValue
                    ? mappedNfts?.find((nft) => nft.value === addressSelectValue)
                    : null) ||
                  (addressSelectValue
                    ? {
                        label: nftName && nftName !== "-" ? nftName : address,
                        value: addressSelectValue,
                      }
                    : null)
                }
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption?.value)
                  setPickedNftSlug(selectedOption?.slug)
                  setValue(`requirements.${index}.type`, "ERC721")
                  setValue(`requirements.${index}.data.attribute.trait_type`, null)
                  setValue(`requirements.${index}.data.attribute.value`, null)
                  setValue(`requirements.${index}.data.attribute.interval`, null)
                  setValue(`requirements.${index}.data.minAmount`, undefined)
                  setValue(`requirements.${index}.data.maxAmount`, undefined)
                  setValue(`requirements.${index}.nftRequirementType`, null)
                }}
                onBlur={onBlur}
                onInputChange={(text, _) => {
                  if (ADDRESS_REGEX.test(text)) {
                    onChange(text)
                    setPickedNftSlug(null)
                  } else setAddressInput(text)
                }}
                menuIsOpen={
                  chain === "ETHEREUM" ? undefined : ADDRESS_REGEX.test(addressInput)
                }
                // Hiding the dropdown arrow in some cases
                components={
                  chain !== "ETHEREUM" && {
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }
                }
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors?.requirements?.[index]?.nftRequirementType}
      >
        <FormLabel>Requirement type:</FormLabel>
        <Controller
          name={`requirements.${index}.nftRequirementType` as const}
          control={control}
          defaultValue={field.nftRequirementType}
          rules={{ required: "This field is required." }}
          render={({
            field: { onChange, onBlur, value: nftRequirementTypeValue, ref },
          }) => (
            <StyledSelect
              ref={ref}
              isLoading={isMetadataLoading}
              isDisabled={!address || isMetadataLoading}
              options={mappedNftRequirementTypeOptions}
              value={
                nftRequirementTypeValue
                  ? mappedNftRequirementTypeOptions.find(
                      (option) => option.value === nftRequirementTypeValue
                    )
                  : null
              }
              onChange={(selectedOption: SelectOption) => {
                resetDetails()
                onChange(selectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.nftRequirementType?.message}
        </FormErrorMessage>
      </FormControl>

      {nftRequirementType === "ATTRIBUTE" && (
        <>
          {isMetadataLoading ? (
            <Flex w="full" pt={4} justifyContent="center">
              <Spinner />
            </Flex>
          ) : metadata ? (
            <>
              <FormControl isDisabled={!metadata}>
                <FormLabel>Custom attribute:</FormLabel>

                <Controller
                  name={`requirements.${index}.data.attribute.trait_type` as const}
                  control={control}
                  defaultValue={field.data?.attribute?.trait_type}
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
                              (attributeName) =>
                                attributeName.value === keySelectValue
                            )
                          : null
                      }
                      defaultValue={nftCustomAttributeNames?.find(
                        (attributeName) =>
                          attributeName.value === field.data?.attribute?.trait_type
                      )}
                      onChange={(newValue: SelectOption) => {
                        onChange(newValue?.value)
                        setValue(`requirements.${index}.data.attribute.value`, null)
                        setValue(
                          `requirements.${index}.data.attribute.interval`,
                          null
                        )
                        clearErrors([
                          `requirements.${index}.data.attribute.value`,
                          `requirements.${index}.data.attribute.interval`,
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
                        !!errors?.requirements?.[index]?.data?.attribute?.interval
                          ?.min
                      }
                    >
                      <Controller
                        name={
                          `requirements.${index}.data.attribute.interval.min` as const
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
                              `requirements.${index}.data.attribute.interval.max`
                            ),
                            message: `Maximum: ${getValues(
                              `requirements.${index}.data.attribute.interval.max`
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
                              `requirements.${index}.data.attribute.interval.max`
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
                          errors?.requirements?.[index]?.data?.attribute?.interval
                            ?.min?.message
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
                        !!errors?.requirements?.[index]?.data?.attribute?.interval
                          ?.max
                      }
                    >
                      <Controller
                        name={
                          `requirements.${index}.data.attribute.interval.max` as const
                        }
                        control={control}
                        rules={{
                          required: "This field is required.",
                          min: {
                            value: getValues(
                              `requirements.${index}.data.attribute.interval.min`
                            ),
                            message: `Minimum: ${getValues(
                              `requirements.${index}.data.attribute.interval.min`
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
                              `requirements.${index}.data.attribute.interval.min`
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
                          errors?.requirements?.[index]?.data?.attribute?.interval
                            ?.max?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                </VStack>
              ) : (
                <FormControl
                  isRequired={
                    !!getValues(`requirements.${index}.data.attribute.trait_type`)
                  }
                  isInvalid={!!errors?.requirements?.[index]?.data?.attribute?.value}
                  isDisabled={!metadata}
                >
                  <FormLabel>Custom attribute value:</FormLabel>
                  <Controller
                    name={`requirements.${index}.data.attribute.value` as const}
                    control={control}
                    defaultValue={field.data?.attribute?.value}
                    rules={{
                      required:
                        getValues(
                          `requirements.${index}.data.attribute.trait_type`
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
                            (attributeValue) =>
                              attributeValue.value === valueSelectValue
                          ) || null
                        }
                        defaultValue={nftCustomAttributeValues?.find(
                          (attributeValue) =>
                            attributeValue.value === field.data?.attribute?.value
                        )}
                        onChange={(newValue: SelectOption) =>
                          onChange(newValue.value)
                        }
                        onBlur={onBlur}
                      />
                    )}
                  />

                  <FormErrorMessage>
                    {errors?.requirements?.[index]?.data?.attribute?.value?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            </>
          ) : (
            <FormControl>
              <FormLabel>Metadata:</FormLabel>

              <HStack w="full" spacing={2} alignItems="start">
                <FormControl>
                  <Input
                    {...register(`requirements.${index}.data.attribute.trait_type`)}
                    defaultValue={field.data?.attribute?.trait_type}
                    placeholder="Key"
                  />
                </FormControl>
                <Text as="span" h={10} lineHeight={10}>
                  :
                </Text>
                <FormControl
                  isRequired={
                    !!getValues(`requirements.${index}.data.attribute.trait_type`)
                  }
                  isInvalid={!!errors?.requirements?.[index]?.data?.attribute?.value}
                >
                  <Input
                    {...register(`requirements.${index}.data.attribute.value`, {
                      required:
                        getValues(
                          `requirements.${index}.data.attribute.trait_type`
                        ) && "This field is required.",
                    })}
                    defaultValue={field.data?.attribute?.value}
                    placeholder="Value"
                  />
                  <FormErrorMessage>
                    {errors?.requirements?.[index]?.data?.attribute?.value?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            </FormControl>
          )}
        </>
      )}

      {nftRequirementType === "AMOUNT" && (
        <MinMaxAmount field={field} index={index} />
      )}

      {nftType === "ERC1155" && nftRequirementType === "AMOUNT" && (
        <>
          <Divider />
          <Accordion w="full" allowToggle>
            <AccordionItem border="none">
              <AccordionButton px={0} _hover={{ bgColor: null }}>
                <Box mr="2" textAlign="left" fontWeight="medium" fontSize="md">
                  Advanced
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={0} overflow="hidden">
                <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.id}>
                  <FormLabel>ID:</FormLabel>
                  <Input
                    {...register(`requirements.${index}.data.id` as const, {
                      required:
                        getValues(`requirements.${index}.nftRequirementType`) ===
                        "CUSTOM_ID",
                      validate: (value) =>
                        value &&
                        nftType === "ERC1155" &&
                        getValues(`requirements.${index}.nftRequirementType`) ===
                          "AMOUNT"
                          ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                          : undefined,
                    })}
                    defaultValue={field.data?.id}
                    placeholder="Any index"
                  />
                  <FormErrorMessage>
                    {errors?.requirements?.[index]?.data?.id?.message}
                  </FormErrorMessage>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      )}

      {nftRequirementType === "CUSTOM_ID" && (
        <FormControl
          isRequired
          isInvalid={!!errors?.requirements?.[index]?.data?.id}
        >
          <FormLabel>Custom ID:</FormLabel>
          <Input
            {...register(`requirements.${index}.data.id` as const, {
              required:
                getValues(`requirements.${index}.nftRequirementType`) === "CUSTOM_ID"
                  ? "This field is required."
                  : undefined,
              validate: (value) =>
                getValues(`requirements.${index}.nftRequirementType`) === "CUSTOM_ID"
                  ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                  : undefined,
            })}
            defaultValue={field.data?.id}
          />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.id?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </>
  )
}

export default NftFormCard
