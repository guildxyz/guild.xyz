import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { CreatableSelect, Select } from "components/common/ChakraReactSelect"
import isNumber from "components/common/utils/isNumber"
import useTokenData from "hooks/useTokenData"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "../ChainPicker"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"
import useOpenseaNft from "./hooks/useOpenseaNft"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const NftFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    getValues,
    setValue,
    formState: { errors },
    control,
    trigger,
  } = useFormContext()

  const { isLoading, nfts } = useNfts()
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

  // Set up default value if needed (edit page)
  const [defaultChain, setDefaultChain] = useState(
    getValues(`requirements.${index}.chain`)
  )
  const defaultAddress = getValues(`requirements.${index}.address`)
  const defaultKey = getValues(`requirements.${index}.key`)
  const defaultValue = getValues(`requirements.${index}.value`)

  // Reset fields when chain changes
  const chain = useWatch({ name: `requirements.${index}.chain` })
  useEffect(() => {
    if (chain === defaultChain) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.value`, null)
    setDefaultChain(null)
  }, [chain])

  // Trigger the metadata fetcher if needed (edit page)
  useEffect(() => {
    if (nfts && defaultAddress) {
      const slug = nfts.find(
        (nft) => nft.address.toLowerCase() === defaultAddress
      )?.slug
      setPickedNftSlug(slug)
    }
  }, [nfts])

  const [addressInput, setAddressInput] = useState("")
  const address = useWatch({ name: `requirements.${index}.address` })
  const key = useWatch({ name: `requirements.${index}.key` })

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(pickedNftSlug)

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

  // Setting the "default values" this way, to avoid errors with the min-max inputs
  useEffect(() => {
    if (defaultValue) return
    if (
      nftCustomAttributeValues?.length === 2 &&
      nftCustomAttributeValues.every(isNumber)
    ) {
      setValue(`requirements.${index}.value.0`, nftCustomAttributeValues[0]?.value)
      setValue(`requirements.${index}.value.1`, nftCustomAttributeValues[1]?.value)
    }
  }, [defaultValue, nftCustomAttributeValues])

  const [isCustomNft, setIsCustomNft] = useState(false)
  const { isLoading: isOpenseaNftLoading, nft: openseaNft } = useOpenseaNft(
    isCustomNft ? address : null
  )

  useEffect(() => {
    if (!isCustomNft) return

    if (!isOpenseaNftLoading && openseaNft) {
      setPickedNftSlug(openseaNft.slug)
      setValue(`requirements.${index}.value`, null)
    } else {
      setValue(`requirements.${index}.value`, 1)
    }

    setValue(`requirements.${index}.key`, null)
  }, [isCustomNft, isOpenseaNftLoading, openseaNft])

  const {
    isValidating: isCustomNftLoading,
    data: { name: nftName, symbol: nftSymbol },
  } = useTokenData(chain, address)

  const nftDataFetched = useMemo(
    () =>
      typeof nftName === "string" &&
      nftName !== "-" &&
      typeof nftSymbol === "string" &&
      nftSymbol !== "-",
    [nftName, nftSymbol]
  )

  useEffect(() => {
    if (address && !isCustomNftLoading) trigger(`requirements.${index}.address`)
  }, [address, isCustomNftLoading, nftDataFetched])

  return (
    <FormCard type="ERC721" onRemove={onRemove}>
      <ChainPicker controlName={`requirements.${index}.chain`} />

      <FormControl isInvalid={errors?.requirements?.[index]?.address}>
        <FormLabel>Pick an NFT:</FormLabel>
        <InputGroup>
          {address && (
            <Symbol
              symbol={nftSymbol}
              isSymbolValidating={isCustomNftLoading}
              isInvalid={errors?.requirements?.[index]?.address}
            />
          )}

          <Box width="full">
            <Controller
              control={control}
              name={`requirements.${index}.address`}
              rules={{
                required: "This field is required.",
                pattern: {
                  value: ADDRESS_REGEX,
                  message:
                    "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                },
                validate: () =>
                  !!openseaNft ||
                  isCustomNftLoading ||
                  nftDataFetched ||
                  "Couldn't fetch NFT data",
              }}
              render={({ field: { onChange, ref, value } }) => (
                <CreatableSelect
                  formatCreateLabel={(_) => `Add custom NFT`}
                  inputRef={ref}
                  options={chain === "ETHEREUM" ? mappedNfts : []}
                  isLoading={isLoading || isOpenseaNftLoading}
                  value={
                    (chain === "ETHEREUM" &&
                      mappedNfts?.find((nft) => nft.value === value)) ||
                    (value ? { label: nftName, value: value } : null)
                  }
                  onChange={(newValue) => {
                    onChange(newValue.value)
                    setPickedNftSlug(newValue.slug)
                    setIsCustomNft(false)
                    setValue(`requirements.${index}.key`, null)
                    setValue(`requirements.${index}.value`, null)
                  }}
                  onCreateOption={(createdOption) => {
                    setIsCustomNft(true)
                    onChange(createdOption)
                  }}
                  onInputChange={(text, _) => setAddressInput(text)}
                  menuIsOpen={
                    chain === "ETHEREUM"
                      ? undefined
                      : ADDRESS_REGEX.test(addressInput)
                  }
                  filterOption={(candidate, input) => {
                    const lowerCaseInput = input.toLowerCase()
                    return (
                      candidate.label.toLowerCase().includes(lowerCaseInput) ||
                      candidate.value.toLowerCase() === lowerCaseInput
                    )
                  }}
                  placeholder={
                    chain === "ETHEREUM" ? "Search..." : "Paste NFT address"
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
          </Box>
        </InputGroup>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      {isMetadataLoading && (
        <Flex alignItems="center" justifyContent="center" w="full" h={8}>
          <Spinner />
        </Flex>
      )}

      {chain === "ETHEREUM" &&
        (!address ||
          (!isCustomNft &&
            !isMetadataLoading &&
            nftCustomAttributeNames?.length > 1)) && (
          <>
            <FormControl isDisabled={!pickedNftSlug || !metadata}>
              <FormLabel>Custom attribute:</FormLabel>
              <Controller
                control={control}
                name={`requirements.${index}.key`}
                render={({ field: { onChange, ref, value } }) => (
                  <Select
                    key={`${address}-key`}
                    inputRef={ref}
                    placeholder={defaultKey || "Any attribute"}
                    options={
                      nftCustomAttributeNames?.length > 1
                        ? nftCustomAttributeNames
                        : []
                    }
                    isLoading={isMetadataLoading}
                    value={nftCustomAttributeNames?.find(
                      (attributeName) => attributeName.value === value
                    )}
                    onChange={(newValue) => {
                      setValue(`requirements.${index}.value`, null)
                      onChange(newValue.value)
                    }}
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
                      key?.length && errors?.requirements?.[index]?.value?.[0]
                    }
                  >
                    <Controller
                      control={control}
                      name={`requirements.${index}.value.0`}
                      rules={{
                        min: {
                          value: nftCustomAttributeValues[0]?.value,
                          message: `Minimum: ${nftCustomAttributeValues[0]?.value}`,
                        },
                        max: {
                          value: nftCustomAttributeValues[1]?.value,
                          message: `Maximum: ${nftCustomAttributeValues[1]?.value}`,
                        },
                      }}
                      render={({ field: { onChange, ref, value } }) => (
                        <NumberInput
                          ref={ref}
                          min={+nftCustomAttributeValues[0]?.value}
                          max={+nftCustomAttributeValues[1]?.value}
                          onChange={(newValue) => {
                            if (!newValue) {
                              onChange(nftCustomAttributeValues[0]?.value)
                            } else {
                              onChange(+newValue)
                            }
                          }}
                          value={value || nftCustomAttributeValues[0]?.value}
                          defaultValue={defaultValue?.[0] || null}
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
                      {errors?.requirements?.[index]?.value?.[0]?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Text as="span" h={1} pt={2}>
                    -
                  </Text>

                  <FormControl
                    isDisabled={!key}
                    isInvalid={
                      key?.length && errors?.requirements?.[index]?.value?.[1]
                    }
                  >
                    <Controller
                      control={control}
                      name={`requirements.${index}.value.1`}
                      rules={{
                        min: {
                          value: nftCustomAttributeValues[0]?.value,
                          message: `Minimum: ${nftCustomAttributeValues[0]?.value}`,
                        },
                        max: {
                          value: nftCustomAttributeValues[1]?.value,
                          message: `Maximum: ${nftCustomAttributeValues[1]?.value}`,
                        },
                      }}
                      render={({ field: { onChange, ref, value } }) => (
                        <NumberInput
                          ref={ref}
                          min={+nftCustomAttributeValues[0]?.value}
                          max={+nftCustomAttributeValues[1]?.value}
                          onChange={(newValue) => {
                            if (!newValue) {
                              onChange(nftCustomAttributeValues[1]?.value)
                            } else {
                              onChange(+newValue)
                            }
                          }}
                          value={value || nftCustomAttributeValues[1]?.value}
                          defaultValue={defaultValue?.[1] || null}
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
                      {errors?.requirements?.[index]?.value?.[1]?.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
              </VStack>
            ) : (
              <FormControl isDisabled={!pickedNftSlug || !metadata}>
                <FormLabel>Custom attribute value:</FormLabel>
                <Controller
                  control={control}
                  name={`requirements.${index}.value`}
                  rules={{
                    shouldUnregister: true,
                  }}
                  render={({ field: { onChange, ref, value } }) => (
                    <Select
                      key={`${address}-value`}
                      inputRef={ref}
                      placeholder={
                        typeof defaultValue === "string" ||
                        typeof defaultValue === "number"
                          ? defaultValue
                          : "Any attribute values"
                      }
                      options={
                        nftCustomAttributeValues?.length > 1
                          ? nftCustomAttributeValues
                          : []
                      }
                      value={nftCustomAttributeValues?.find(
                        (attributeValue) => attributeValue.value === value || null
                      )}
                      onChange={(newValue) => onChange(newValue.value)}
                    />
                  )}
                />
              </FormControl>
            )}
          </>
        )}

      {address &&
        isCustomNft &&
        !isMetadataLoading &&
        !nftCustomAttributeNames?.length && (
          <FormControl
            isRequired={isCustomNft && !openseaNft}
            isInvalid={errors?.requirements?.[index]?.value}
          >
            <FormLabel>Amount</FormLabel>
            <Controller
              control={control}
              name={`requirements.${index}.value`}
              rules={{
                required: {
                  value: isCustomNft && !openseaNft,
                  message: "This field is required.",
                },
                min: {
                  value: 1,
                  message: "Amount must be positive",
                },
                shouldUnregister: true,
              }}
              render={({ field: { onChange, ref, value } }) => (
                <NumberInput
                  ref={ref}
                  min={1}
                  onChange={(newValue) => onChange(+newValue)}
                  value={value || 0}
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
    </FormCard>
  )
}

export default NftFormCard
