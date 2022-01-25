import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  InputGroup,
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
import useTokenData from "hooks/useTokenData"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormField } from "types"
import isNumber from "utils/isNumber"
import ChainPicker from "../ChainPicker"
import Symbol from "../Symbol"
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
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const key = useWatch({ name: `requirements.${index}.key` })

  const [addressInput, setAddressInput] = useState("")
  const { nfts, isLoading } = useNfts(addressInput, 3)
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
    clearErrors([
      `requirements.${index}.address`,
      `requirements.${index}.key`,
      `requirements.${index}.value`,
      `requirements.${index}.interval`,
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

    if (
      mappedAttributeValues?.length === 2 &&
      mappedAttributeValues
        ?.map((attributeValue) => attributeValue.value)
        .every(isNumber)
    )
      return mappedAttributeValues

    return [{ label: "Any attribute values", value: "" }].concat(
      mappedAttributeValues
    )
  }, [metadata, key])

  // // Setting the "default values" this way, to avoid errors with the min-max inputs
  useEffect(() => {
    if (
      nftCustomAttributeValues?.length === 2 &&
      nftCustomAttributeValues
        ?.map((attributeValue) => attributeValue.value)
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
    if (!address || isMetadataLoading || nftCustomAttributeNames?.length > 0) return // Not a "custom" NFT

    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.interval`, null)
  }, [address, isMetadataLoading, nftCustomAttributeNames])

  const {
    isValidating: isCustomNftLoading,
    data: { name: nftName, symbol: nftSymbol },
  } = useTokenData(chain, address)

  const nftDataFetched = useMemo(
    () =>
      typeof nftName === "string" &&
      // nftName !== "-" &&
      typeof nftSymbol === "string",
    // nftSymbol !== "-",
    [nftName, nftSymbol]
  )

  // If we need to display the "amount" field, set up its default value to 1
  const shouldShowAmount = useMemo(
    () => address && nftCustomAttributeNames?.length <= 1,
    [address, nftCustomAttributeNames]
  )

  useEffect(() => {
    if (shouldShowAmount) {
      setValue(`requirements.${index}.value`, 1)
    }
  }, [shouldShowAmount])

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
          {address && (
            <Symbol
              symbol={nftSymbol}
              isSymbolValidating={isCustomNftLoading}
              isInvalid={
                isCustomNftLoading
                  ? errors?.requirements?.[index]?.address?.type !== "validate" &&
                    errors?.requirements?.[index]?.address
                  : !nftDataFetched && errors?.requirements?.[index]?.address
              }
            />
          )}
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
                options={mappedNfts}
                value={
                  (chain === "ETHEREUM" &&
                    mappedNfts?.find((nft) => nft.value === addressSelectValue)) ||
                  (addressSelectValue
                    ? {
                        label: nftName && nftName !== "-" ? nftName : address,
                        value: addressSelectValue,
                      }
                    : null)
                }
                onChange={(selectedOption: any) => {
                  onChange(selectedOption?.value)
                  setPickedNftSlug(selectedOption?.slug)
                  setValue(`requirements.${index}.key`, null)
                  setValue(`requirements.${index}.value`, null)
                  setValue(`requirements.${index}.interval`, null)
                }}
                onBlur={onBlur}
                onInputChange={(text, _) => {
                  if (ADDRESS_REGEX.test(text)) onChange(text)
                  else setAddressInput(text)
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
        <FormHelperText>Type at least 3 characters.</FormHelperText>
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
                    value={nftCustomAttributeNames?.find(
                      (attributeName) => attributeName.value === keySelectValue
                    )}
                    defaultValue={nftCustomAttributeNames?.find(
                      (attributeName) => attributeName.value === field.key
                    )}
                    onChange={(newValue: any) => {
                      onChange(newValue?.value)
                      setValue(`requirements.${index}.value`, null)
                      setValue(`requirements.${index}.interval`, null)
                    }}
                    onBlur={onBlur}
                  />
                )}
              />
            </FormControl>

            {nftCustomAttributeValues?.length === 2 &&
            nftCustomAttributeValues
              .map((attributeValue) => attributeValue.value)
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
                      defaultValue={
                        field.interval?.[0] || nftCustomAttributeValues[0]?.value
                      }
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
                          value={
                            value0NumberInputValue ||
                            nftCustomAttributeValues[0]?.value
                          }
                          defaultValue={
                            field.interval?.[0] ||
                            parseInt(nftCustomAttributeValues[0]?.value)
                          }
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
                      defaultValue={
                        field.interval?.[1] || nftCustomAttributeValues[1]?.value
                      }
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
                          value={
                            value1NumberInputValue ||
                            nftCustomAttributeValues[1]?.value
                          }
                          defaultValue={
                            field.interval?.[1] || nftCustomAttributeValues[1]?.value
                          }
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
                      onChange={(newValue: any) => onChange(newValue.value)}
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
          isInvalid={errors?.requirements?.[index]?.value}
        >
          <FormLabel>Amount</FormLabel>
          <Controller
            name={`requirements.${index}.value` as const}
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
                value={
                  isNaN(parseInt(valueNumberInputValue))
                    ? 1
                    : parseInt(valueNumberInputValue)
                }
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
            {errors?.requirements?.[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </>
  )
}

export default NftFormCard
