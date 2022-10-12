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
import { FormCardProps, NftRequirementType, SelectOption } from "types"
import capitalize from "utils/capitalize"
import isNumber from "utils/isNumber"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../ChainPicker"
import MinMaxAmount from "../MinMaxAmount"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"
import useNftType from "./hooks/useNftType"

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

const NftFormCard = ({ baseFieldPath, field }: FormCardProps): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}type` })
  const chain = useWatch({ name: `${baseFieldPath}chain` })
  const address = useWatch({ name: `${baseFieldPath}address` })
  const traitType = useWatch({
    name: `${baseFieldPath}data.attribute.trait_type`,
  })
  const nftRequirementType = useWatch({
    name: `${baseFieldPath}nftRequirementType`,
  })

  const { nftType, isLoading: isNftTypeLoading } = useNftType(address, chain)

  useEffect(() => {
    if (isNftTypeLoading) return

    if (nftType === "ERC1155" && type !== "ERC1155")
      setValue(`${baseFieldPath}type`, "ERC1155")
    if (nftType === "SIMPLE" && type === "ERC1155")
      setValue(`${baseFieldPath}type`, "ERC721")
    if (nftType === "NOUNS" && type !== "NOUNS")
      setValue(`${baseFieldPath}type`, "NOUNS")
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
      !getValues(`${baseFieldPath}data.attribute.interval.min`) &&
      !getValues(`${baseFieldPath}data.attribute.interval.max`) &&
      nftCustomAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    ) {
      setValue(
        `${baseFieldPath}data.attribute.interval.min`,
        parseInt(nftCustomAttributeValues[0]?.value)
      )
      setValue(
        `${baseFieldPath}data.attribute.interval.max`,
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
    if (!parseFromObject(touchedFields, baseFieldPath)?.address) return
    setValue(`${baseFieldPath}address`, null)
    setValue(`${baseFieldPath}data.attribute.trait_type`, null)
    setValue(`${baseFieldPath}data.attribute.value`, null)
    setValue(`${baseFieldPath}data.attribute.interval`, null)
    setValue(`${baseFieldPath}data.id`, null)
    setValue(`${baseFieldPath}data.minAmount`, undefined)
    setValue(`${baseFieldPath}data.maxAmount`, undefined)
    setValue(`${baseFieldPath}nftRequirementType`, null)
    clearErrors([
      `${baseFieldPath}address`,
      `${baseFieldPath}data.attribute.trait_type`,
      `${baseFieldPath}data.attribute.value`,
      `${baseFieldPath}data.attribute.interval`,
      `${baseFieldPath}data.id`,
      `${baseFieldPath}data.minAmount`,
      `${baseFieldPath}data.maxAmount`,
      `${baseFieldPath}nftRequirementType`,
    ])
  }

  // Reset key, value, interval, amount fields on nftRequirementType change
  const resetDetails = () => {
    setValue(`${baseFieldPath}data.attribute.trait_type`, null)
    setValue(`${baseFieldPath}data.attribute.value`, null)
    setValue(`${baseFieldPath}data.attribute.interval`, null)
    setValue(`${baseFieldPath}data.id`, null)
    setValue(`${baseFieldPath}data.minAmount`, undefined)
    setValue(`${baseFieldPath}data.maxAmount`, undefined)
    clearErrors([
      `${baseFieldPath}data.attribute.trait_type`,
      `${baseFieldPath}data.attribute.value`,
      `${baseFieldPath}data.attribute.interval`,
      `${baseFieldPath}data.id`,
      `${baseFieldPath}data.minAmount`,
      `${baseFieldPath}data.maxAmount`,
    ])
  }

  const customFilterOption = (candidate, input) =>
    candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
    candidate.value.toLowerCase() === input?.toLowerCase()

  return (
    <>
      <ChainPicker
        controlName={`${baseFieldPath}chain` as const}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
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
                  <Text as="span" fontSize="xs" fontWeight="bold" noOfLines={1}>
                    {nftSymbol}
                  </Text>
                )}
              </InputLeftAddon>
            ))}
          <Controller
            name={`${baseFieldPath}address` as const}
            control={control}
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
                  setValue(`${baseFieldPath}type`, "ERC721")
                  setValue(`${baseFieldPath}data.attribute.trait_type`, null)
                  setValue(`${baseFieldPath}data.attribute.value`, null)
                  setValue(`${baseFieldPath}data.attribute.interval`, null)
                  setValue(`${baseFieldPath}data.minAmount`, undefined)
                  setValue(`${baseFieldPath}data.maxAmount`, undefined)
                  setValue(`${baseFieldPath}nftRequirementType`, null)
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
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.nftRequirementType}
      >
        <FormLabel>Requirement type:</FormLabel>
        <Controller
          name={`${baseFieldPath}nftRequirementType` as const}
          control={control}
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
          {parseFromObject(errors, baseFieldPath)?.nftRequirementType?.message}
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
                  name={`${baseFieldPath}data.attribute.trait_type` as const}
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
                              (attributeName) =>
                                attributeName.value === keySelectValue
                            )
                          : null
                      }
                      onChange={(newValue: SelectOption) => {
                        onChange(newValue?.value)
                        setValue(`${baseFieldPath}data.attribute.value`, null)
                        setValue(`${baseFieldPath}data.attribute.interval`, null)
                        clearErrors([
                          `${baseFieldPath}data.attribute.value`,
                          `${baseFieldPath}data.attribute.interval`,
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
                        !!parseFromObject(errors, baseFieldPath)?.data?.attribute
                          ?.interval?.min
                      }
                    >
                      <Controller
                        name={`${baseFieldPath}data.attribute.interval.min` as const}
                        control={control}
                        rules={{
                          required: "This field is required.",
                          min: {
                            value: nftCustomAttributeValues[0]?.value,
                            message: `Minimum: ${nftCustomAttributeValues[0]?.value}`,
                          },
                          max: {
                            value: getValues(
                              `${baseFieldPath}data.attribute.interval.max`
                            ),
                            message: `Maximum: ${getValues(
                              `${baseFieldPath}data.attribute.interval.max`
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
                              `${baseFieldPath}data.attribute.interval.max`
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
                          parseFromObject(errors, baseFieldPath)?.data?.attribute
                            ?.interval?.min?.message
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
                        !!parseFromObject(errors, baseFieldPath)?.data?.attribute
                          ?.interval?.max
                      }
                    >
                      <Controller
                        name={`${baseFieldPath}data.attribute.interval.max` as const}
                        control={control}
                        rules={{
                          required: "This field is required.",
                          min: {
                            value: getValues(
                              `${baseFieldPath}data.attribute.interval.min`
                            ),
                            message: `Minimum: ${getValues(
                              `${baseFieldPath}data.attribute.interval.min`
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
                              `${baseFieldPath}data.attribute.interval.min`
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
                          parseFromObject(errors, baseFieldPath)?.data?.attribute
                            ?.interval?.max?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                </VStack>
              ) : (
                <FormControl
                  isRequired={
                    !!getValues(`${baseFieldPath}data.attribute.trait_type`)
                  }
                  isInvalid={
                    !!parseFromObject(errors, baseFieldPath)?.data?.attribute?.value
                  }
                  isDisabled={!metadata}
                >
                  <FormLabel>Custom attribute value:</FormLabel>
                  <Controller
                    name={`${baseFieldPath}data.attribute.value` as const}
                    control={control}
                    rules={{
                      required:
                        getValues(`${baseFieldPath}data.attribute.trait_type`) &&
                        "This field is required.",
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
                          ) || ""
                        }
                        onChange={(newValue: SelectOption) =>
                          onChange(newValue.value)
                        }
                        onBlur={onBlur}
                      />
                    )}
                  />

                  <FormErrorMessage>
                    {
                      parseFromObject(errors, baseFieldPath)?.data?.attribute?.value
                        ?.message
                    }
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
                    {...register(`${baseFieldPath}data.attribute.trait_type`)}
                    defaultValue={field.data?.attribute?.trait_type}
                    placeholder="Key"
                  />
                </FormControl>
                <Text as="span" h={10} lineHeight={10}>
                  :
                </Text>
                <FormControl
                  isRequired={
                    !!getValues(`${baseFieldPath}data.attribute.trait_type`)
                  }
                  isInvalid={
                    !!parseFromObject(errors, baseFieldPath)?.data?.attribute?.value
                  }
                >
                  <Input
                    {...register(`${baseFieldPath}data.attribute.value`, {
                      required:
                        getValues(`${baseFieldPath}data.attribute.trait_type`) &&
                        "This field is required.",
                    })}
                    defaultValue={field.data?.attribute?.value}
                    placeholder="Value"
                  />
                  <FormErrorMessage>
                    {
                      parseFromObject(errors, baseFieldPath)?.data?.attribute?.value
                        ?.message
                    }
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            </FormControl>
          )}
        </>
      )}

      {nftRequirementType === "AMOUNT" && (
        <MinMaxAmount field={field} baseFieldPath={baseFieldPath} />
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
                <FormControl
                  isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
                >
                  <FormLabel>ID:</FormLabel>
                  <Input
                    {...register(`${baseFieldPath}data.id` as const, {
                      required:
                        getValues(`${baseFieldPath}nftRequirementType`) ===
                        "CUSTOM_ID",
                      validate: (value) =>
                        value &&
                        nftType === "ERC1155" &&
                        getValues(`${baseFieldPath}nftRequirementType`) === "AMOUNT"
                          ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                          : undefined,
                    })}
                    defaultValue={field.data?.id}
                    placeholder="Any index"
                  />
                  <FormErrorMessage>
                    {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
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
          isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
        >
          <FormLabel>Custom ID:</FormLabel>
          <Input
            {...register(`${baseFieldPath}data.id` as const, {
              required:
                getValues(`${baseFieldPath}nftRequirementType`) === "CUSTOM_ID"
                  ? "This field is required."
                  : undefined,
              validate: (value) =>
                getValues(`${baseFieldPath}nftRequirementType`) === "CUSTOM_ID"
                  ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                  : undefined,
            })}
            defaultValue={field.data?.id}
          />
          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </>
  )
}

export default NftFormCard
