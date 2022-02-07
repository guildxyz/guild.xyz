import {
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
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { NftRequirementType, RequirementFormField, SelectOption } from "types"
import isNumber from "utils/isNumber"
import ChainPicker from "../ChainPicker"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"

type Props = {
  index: number
  field: RequirementFormField
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
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const type = useWatch({ name: `requirements.${index}.type` })
  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const key = useWatch({ name: `requirements.${index}.key` })
  const nftRequirementType = useWatch({
    name: `requirements.${index}.nftRequirementType`,
  })

  const [addressInput, setAddressInput] = useState("")
  const { nfts, isLoading } = useNfts(addressInput)
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

  // Validating the address field
  const nftDataFetched = useMemo(
    () =>
      typeof nftName === "string" &&
      nftName !== "-" &&
      typeof nftSymbol === "string" &&
      nftSymbol !== "-",
    [nftName, nftSymbol]
  )
  useEffect(() => {
    if (!address || !!nftImage || isNftNameSymbolLoading || nftDataFetched) {
      clearErrors(`requirements.${index}.address`)
      return
    }

    setError(`requirements.${index}.address`, {
      message: "Failed to fetch token data.",
    })
  }, [address, nftImage, isNftNameSymbolLoading, nftName, nftSymbol])

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

  const mappedNftRequirementTypeOptions = useMemo(
    () =>
      Object.keys(metadata || {})?.length
        ? nftRequirementTypeOptions
        : nftRequirementTypeOptions.filter((option) => option.value !== "ATTRIBUTE"),
    [metadata]
  )

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.value`, null)
    setValue(`requirements.${index}.interval`, null)
    setValue(`requirements.${index}.amount`, null)
    setValue(`requirements.${index}.nftRequirementType`, null)
    clearErrors([
      `requirements.${index}.address`,
      `requirements.${index}.key`,
      `requirements.${index}.value`,
      `requirements.${index}.interval`,
      `requirements.${index}.amount`,
      `requirements.${index}.nftRequirementType`,
    ])
  }

  // Reset key, value, interval, amount fields on nftRequirementType change
  const resetDetails = () => {
    if (
      !touchedFields?.requirements?.[index]?.key &&
      !touchedFields?.requirements?.[index]?.value &&
      !touchedFields?.requirements?.[index]?.interval?.[0] &&
      !touchedFields?.requirements?.[index]?.interval?.[1] &&
      !touchedFields?.requirements?.[index]?.amount
    )
      return

    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.value`, null)
    setValue(`requirements.${index}.interval`, null)
    setValue(`requirements.${index}.amount`, null)
  }

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        onChange={resetForm}
      />
      <FormControl isInvalid={errors?.requirements?.[index]?.address}>
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
              validate: () =>
                !address ||
                !!nftImage ||
                isNftNameSymbolLoading ||
                nftDataFetched ||
                "Failed to fetch token data.",
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
                  setValue(`requirements.${index}.type`, "ERC721")
                  setValue(`requirements.${index}.key`, null)
                  setValue(`requirements.${index}.value`, null)
                  setValue(`requirements.${index}.interval`, null)
                  setValue(`requirements.${index}.amount`, 1)
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

      <FormControl>
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
                if (selectedOption?.value === "CUSTOM_ID" && type !== "CUSTOM_ID") {
                  setValue(`requirements.${index}.type`, "CUSTOM_ID")
                }
                if (selectedOption?.value !== "CUSTOM_ID" && type === "CUSTOM_ID") {
                  setValue(`requirements.${index}.type`, "ERC721")
                }
                resetDetails()
                onChange(selectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />
      </FormControl>

      {nftRequirementType === "ATTRIBUTE" && (
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
                        value: getValues(`requirements.${index}.interval.1`),
                        message: `Maximum: ${getValues(
                          `requirements.${index}.interval.1`
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
                        onChange={(newValue) => {
                          onChange(+newValue)
                        }}
                        onBlur={onBlur}
                        min={+nftCustomAttributeValues[0]?.value}
                        max={+getValues(`requirements.${index}.interval.1`)}
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
                        value: getValues(`requirements.${index}.interval.0`),
                        message: `Minimum: ${getValues(
                          `requirements.${index}.interval.0`
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
                        onChange={(newValue) => {
                          onChange(+newValue)
                        }}
                        onBlur={onBlur}
                        min={+getValues(`requirements.${index}.interval.0`)}
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
                rules={{
                  required: false,
                }}
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
                        (attributeValue) => attributeValue.value === valueSelectValue
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

      {nftRequirementType === "AMOUNT" && (
        <FormControl isRequired isInvalid={errors?.requirements?.[index]?.amount}>
          <FormLabel>Amount:</FormLabel>
          <Controller
            name={`requirements.${index}.amount` as const}
            control={control}
            defaultValue={field.amount || 1}
            rules={{
              required: "This field is required.",
              min: {
                value: 1,
                message: "Amount must be positive",
              },
            }}
            render={({
              field: { onChange, onBlur, value: amountNumberInputValue, ref },
            }) => (
              <NumberInput
                ref={ref}
                value={amountNumberInputValue || undefined}
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

      {nftRequirementType === "CUSTOM_ID" && (
        <FormControl isRequired isInvalid={errors?.requirements?.[index]?.value}>
          <FormLabel>Custom ID:</FormLabel>
          <Controller
            name={`requirements.${index}.value` as const}
            control={control}
            defaultValue={field.value}
            rules={{
              required:
                nftRequirementType !== "CUSTOM_ID" || "This field is required.",
              min: {
                value: 0,
                message: "Custom ID must be positive",
              },
            }}
            render={({
              field: { onChange, onBlur, value: customIdNumberInputValue, ref },
            }) => (
              <NumberInput
                ref={ref}
                value={customIdNumberInputValue || undefined}
                onChange={(newValue) => onChange(newValue)}
                onBlur={onBlur}
                min={0}
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
