import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
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
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField, SelectOption } from "types"
import isNumber from "utils/isNumber"
import ChainPicker from "../ChainPicker"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"

type Props = {
  index: number
  field: RequirementFormField
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const NftFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    getValues,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, touchedFields, dirtyFields },
  } = useFormContext()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const key = useWatch({ name: `requirements.${index}.key` })

  const [addressInput, setAddressInput] = useState("")
  const { nfts, isLoading } = useNfts(addressInput)
  const mappedNfts = useMemo(
    () =>
      nfts?.map((nft) => ({
        img: nft.logoUri, // This will be displayed as an Img tag in the list
        label: nft.name, // This will be displayed as the option text in the list
        value: nft.address, // This is the actual value of this select
        slug: nft.slug, // Will use it for searching NFT attributes
      })),
    [nfts]
  )

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.value`, null)
    setValue(`requirements.${index}.interval`, null)
    setValue(`requirements.${index}.amount`, 1)
    clearErrors([
      `requirements.${index}.address`,
      `requirements.${index}.key`,
      `requirements.${index}.value`,
      `requirements.${index}.interval`,
      `requirements.${index}.amount`,
    ])
  }

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(
    address,
    pickedNftSlug
  )

  const nftCustomAttributeNames = useMemo(
    () =>
      [""]
        .concat(
          Object.keys(metadata || {})?.filter(
            (attributeName) => attributeName !== "error"
          )
        )
        .map((attributeName) => ({
          label:
            attributeName.charAt(0).toUpperCase() + attributeName.slice(1) ||
            "Any attribute",
          value: attributeName,
        })),
    [metadata]
  )

  const nftCustomAttributeValues = useMemo(() => {
    const mappedAttributeValues =
      metadata?.[key]?.map((attributeValue) => ({
        label:
          attributeValue?.toString().charAt(0).toUpperCase() +
          attributeValue?.toString().slice(1),
        value: attributeValue,
      })) || []

    // For interval-like attribute values, only return the 2 numbers in an array (don't prepend the "Any attribute value" option)
    if (
      mappedAttributeValues?.length === 2 &&
      mappedAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    )
      return mappedAttributeValues

    return [{ label: "Any attribute values", value: "" }].concat(
      mappedAttributeValues
    )
  }, [metadata, key])

  // Setting the "default values" this way, to avoid errors with the min-max inputs
  useEffect(() => {
    if (
      nftCustomAttributeValues?.length === 2 &&
      !getValues(`requirements.${index}.interval.0`) &&
      !getValues(`requirements.${index}.interval.0`) &&
      nftCustomAttributeValues
        ?.map((attributeValue) => parseInt(attributeValue.value))
        .every(isNumber)
    ) {
      setValue(
        `requirements.${index}.interval.0`,
        nftCustomAttributeValues[0]?.value
      )
      setValue(
        `requirements.${index}.interval.1`,
        nftCustomAttributeValues[1]?.value
      )
    }
  }, [nftCustomAttributeValues])

  useEffect(() => {
    // If we can fetch metadata for the NFT, then we shouldn't do anything in this hook
    if (
      !address ||
      isMetadataLoading ||
      nftCustomAttributeNames?.length > 1 ||
      dirtyFields?.requirements?.[index]?.amount
    )
      return

    // In other cases, we can set up the "amount" field to its default value, and clear the other fields
    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.value`, null)
    setValue(`requirements.${index}.interval`, null)
    setValue(`requirements.${index}.amount`, 1)
  }, [address, isMetadataLoading, nftCustomAttributeNames])

  const {
    isValidating: isCustomNftLoading,
    data: { name: nftName, symbol: nftSymbol },
  } = useTokenData(chain, address)

  useEffect(() => {
    if (!address || isCustomNftLoading) return
    trigger(`requirements.${index}.address`)
  }, [isCustomNftLoading])

  const nftDataFetched = useMemo(
    () =>
      !isCustomNftLoading &&
      typeof nftName === "string" &&
      nftName !== "-" &&
      typeof nftSymbol === "string" &&
      nftSymbol !== "-",
    [address, isCustomNftLoading, nftName, nftSymbol]
  )

  const shouldShowAmount = useMemo(
    () => address && nftCustomAttributeNames?.length <= 1,
    [address, nftCustomAttributeNames]
  )

  const nftImage = useMemo(
    () => mappedNfts?.find((nft) => nft.value === address)?.img,
    [address]
  )

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        onChange={resetForm}
      />

      <FormControl
        isInvalid={
          isCustomNftLoading
            ? errors?.requirements?.[index]?.address?.type !== "validate" &&
              errors?.requirements?.[index]?.address
            : !nftDataFetched && errors?.requirements?.[index]?.address
        }
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
                {isCustomNftLoading ? (
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
              validate: () =>
                // Using `getValues` instead of `useWatch` here, so the validation is triggered when the input value changes
                !getValues(`requirements.${index}.address`) ||
                isCustomNftLoading ||
                nftDataFetched ||
                "Failed to fetch token data",
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
                options={chain === "ETHEREUM" ? mappedNfts : []}
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
                  setValue(`requirements.${index}.key`, null)
                  setValue(`requirements.${index}.value`, null)
                  setValue(`requirements.${index}.interval`, null)
                  setValue(`requirements.${index}.amount`, 1)
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
          {isCustomNftLoading
            ? errors?.requirements?.[index]?.address?.type !== "validate" &&
              errors?.requirements?.[index]?.address?.message
            : !nftDataFetched && errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      {isMetadataLoading && (
        <Flex alignItems="center" justifyContent="center" w="full" h={8}>
          <Spinner />
        </Flex>
      )}

      {chain === "ETHEREUM" &&
        (!address ||
          (!isMetadataLoading && nftCustomAttributeNames?.length > 1)) && (
          <>
            <FormControl isDisabled={!metadata}>
              <FormLabel>Custom attribute:</FormLabel>

              <Controller
                name={`requirements.${index}.key` as const}
                control={control}
                defaultValue={field.key}
                render={({
                  field: { onChange, onBlur, value: keySelectValue, ref },
                }) => (
                  <StyledSelect
                    key={`${address}-key`}
                    ref={ref}
                    isLoading={isMetadataLoading}
                    options={
                      nftCustomAttributeNames?.length > 1
                        ? nftCustomAttributeNames
                        : []
                    }
                    placeholder="Any attribute"
                    value={
                      keySelectValue
                        ? nftCustomAttributeNames?.find(
                            (attributeName) => attributeName.value === keySelectValue
                          )
                        : null
                    }
                    defaultValue={nftCustomAttributeNames?.find(
                      (attributeName) => attributeName.value === field.key
                    )}
                    onChange={(newValue: SelectOption) => {
                      onChange(newValue?.value)
                      setValue(`requirements.${index}.value`, null)
                      setValue(`requirements.${index}.interval`, null)
                      setValue(`requirements.${index}.amount`, 1)
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
                    isDisabled={!key}
                    isInvalid={
                      key?.length && errors?.requirements?.[index]?.interval?.[0]
                    }
                  >
                    <Controller
                      name={`requirements.${index}.interval.0` as const}
                      control={control}
                      rules={{
                        required: "This field is required.",
                        min: {
                          value: nftCustomAttributeValues[0]?.value,
                          message: `Minimum: ${nftCustomAttributeValues[0]?.value}`,
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
                          value: value0NumberInputValue,
                          ref,
                        },
                      }) => (
                        <NumberInput
                          ref={ref}
                          value={value0NumberInputValue || undefined}
                          onChange={(newValue) => {
                            onChange(+newValue)
                          }}
                          onBlur={onBlur}
                          min={+nftCustomAttributeValues[0]?.value}
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
                      {errors?.requirements?.[index]?.interval?.[0]?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Text as="span" h={1} pt={2}>
                    -
                  </Text>

                  <FormControl
                    isDisabled={!key}
                    isInvalid={
                      key?.length && errors?.requirements?.[index]?.interval?.[1]
                    }
                  >
                    <Controller
                      name={`requirements.${index}.interval.1` as const}
                      control={control}
                      rules={{
                        required: "This field is required.",
                        min: {
                          value: nftCustomAttributeValues[0]?.value,
                          message: `Minimum: ${nftCustomAttributeValues[0]?.value}`,
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
                          onChange={(newValue) => {
                            onChange(+newValue)
                          }}
                          onBlur={onBlur}
                          min={+nftCustomAttributeValues[0]?.value}
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
                      {errors?.requirements?.[index]?.interval?.[1]?.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
              </VStack>
            ) : (
              <FormControl isDisabled={!metadata}>
                <FormLabel>Custom attribute value:</FormLabel>
                <Controller
                  name={`requirements.${index}.value` as const}
                  control={control}
                  defaultValue={field.value}
                  render={({
                    field: { onChange, onBlur, value: valueSelectValue, ref },
                  }) => (
                    <StyledSelect
                      key={`${address}-value`}
                      ref={ref}
                      options={
                        nftCustomAttributeValues?.length > 1
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
                        (attributeValue) => attributeValue.value === field.value
                      )}
                      onChange={(newValue: SelectOption) => onChange(newValue.value)}
                      onBlur={onBlur}
                    />
                  )}
                />
              </FormControl>
            )}
          </>
        )}

      {shouldShowAmount && (
        <FormControl
          isRequired={
            address && !isMetadataLoading && !nftCustomAttributeNames?.length
          }
          isInvalid={errors?.requirements?.[index]?.amount}
        >
          <FormLabel>Amount:</FormLabel>
          <Controller
            name={`requirements.${index}.amount` as const}
            control={control}
            defaultValue={isNaN(parseInt(field.value)) ? 1 : parseInt(field.value)}
            rules={{
              required: "This field is required.",
              min: {
                value: 1,
                message: "Amount must be positive",
              },
            }}
            render={({
              field: { onChange, onBlur, value: valueNumberInputValue, ref },
            }) => (
              <NumberInput
                ref={ref}
                value={valueNumberInputValue || 1}
                defaultValue={
                  isNaN(parseInt(field.value)) ? 1 : parseInt(field.value)
                }
                onChange={(newValue) => onChange(newValue)}
                onBlur={onBlur}
                min={1}
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
            {errors?.requirements?.[index]?.amount?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </>
  )
}

export default NftFormCard
