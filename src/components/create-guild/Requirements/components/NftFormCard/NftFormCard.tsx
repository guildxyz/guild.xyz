import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import isNumber from "components/common/utils/isNumber"
import useTokenData from "hooks/useTokenData"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { NFT } from "temporaryData/types"
import FormCard from "../FormCard"
import Symbol from "../Symbol"
import useNftMetadata from "./hooks/useNftMetadata"

type Props = {
  index: number
  onRemove?: () => void
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const NftFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    getValues,
    setValue,
    trigger,
    formState: { errors },
    control,
  } = useFormContext()

  // Set up default key and value if needed (edit page)
  const defaultValue = getValues(`requirements.${index}.value`)
  const key = useWatch({ name: `requirements.${index}.key` })

  // Trigger the metadata fetcher if needed (edit page)
  const address = useWatch({ name: `requirements.${index}.address` })
  useEffect(() => {
    if (!address) return
    // TODO: search NFT by address on the new API

    // const slug = nfts.find(
    //   (nft) => nft.address.toLowerCase() === address
    // )?.slug
    // setPickedNftSlug(slug)
  }, [address])

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(
    address,
    pickedNftSlug
  )

  const nftCustomAttributeNames = useMemo(
    () => Object.keys(metadata || {}),
    [metadata]
  )

  const nftCustomAttributeValues = useMemo(
    () => metadata?.[key] || [],
    [metadata, key]
  )

  useEffect(() => {
    if (!address || isMetadataLoading || nftCustomAttributeNames?.length > 0) return // Not a "custom" NFT

    setValue(`requirements.${index}.key`, null)
    setValue(`requirements.${index}.value`, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isMetadataLoading, nftCustomAttributeNames])

  const {
    isValidating: isCustomNftLoading,
    data: [nftName, nftSymbol],
  } = useTokenData(address)

  const nftDataFetched = useMemo(
    () =>
      typeof nftName === "string" &&
      nftName.length > 0 &&
      typeof nftSymbol === "string" &&
      nftSymbol.length > 0,
    [nftName, nftSymbol]
  )

  const wrongChain = useMemo(
    () => nftName === null && nftSymbol === null,
    [nftName, nftSymbol]
  )

  // Fetch NFTs by address or prefix
  const fetchOptions = async (inputValue: string) =>
    fetch(`${process.env.NEXT_PUBLIC_GUILD_API}/nft/prefix/${inputValue}`)
      .then((res) => res.json())
      .then((data: Array<NFT>) =>
        data.map((nft) => ({
          img: nft.logoUri, // This will be displayed as an Img tag in the list
          label: nft.name, // This will be displayed as the option text in the list
          value: nft.address, // This is the actual value of this select
          slug: nft.slug, // Will use it for searching NFT attributes
        }))
      )
      .catch((_) => [])

  return (
    <FormCard type="ERC721" onRemove={onRemove}>
      <FormControl isInvalid={errors?.requirements?.[index]?.address}>
        <FormLabel>Pick an NFT:</FormLabel>
        <HStack maxW="full">
          {((nftDataFetched && nftSymbol !== undefined) || isCustomNftLoading) && (
            <Symbol symbol={nftSymbol} isSymbolValidating={isCustomNftLoading} />
          )}
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
                !isCustomNftLoading ||
                !wrongChain ||
                nftDataFetched ||
                "Couldn't fetch NFT data",
            }}
            render={({ field: { onChange, ref } }) => (
              <Select
                isCreatable
                isAsync
                loadOptions={fetchOptions}
                formatCreateLabel={(_) => `Search NFT by address`}
                inputRef={ref}
                onChange={(newValue) => {
                  onChange(newValue.value)
                  setPickedNftSlug(newValue.slug)
                  setValue(`requirements.${index}.key`, null)
                  setValue(`requirements.${index}.value`, null)
                }}
                onCreateOption={(createdOption) => {
                  setValue(`requirements.${index}.address`, createdOption)
                  trigger(`requirements.${index}.address`)
                }}
                placeholder={address || "Search..."}
                controlShouldRenderValue={false}
                onBlur={() => trigger(`requirements.${index}.address`)}
              />
            )}
          />
        </HStack>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      {isMetadataLoading && (
        <Flex alignItems="center" justifyContent="center" w="full" h={8}>
          <Spinner />
        </Flex>
      )}

      {(!address || (!isMetadataLoading && nftCustomAttributeNames?.length)) && (
        <>
          <FormControl isDisabled={!metadata}>
            <FormLabel>Custom attribute:</FormLabel>
            <Controller
              control={control}
              name={`requirements.${index}.key`}
              render={({ field: { onChange, ref } }) => (
                <Select
                  key={`${address}-key`}
                  inputRef={ref}
                  placeholder={key || "Any attribute"}
                  options={
                    nftCustomAttributeNames?.length
                      ? [""]
                          .concat(nftCustomAttributeNames)
                          .map((attributeName) => ({
                            label:
                              attributeName.charAt(0).toUpperCase() +
                                attributeName.slice(1) || "Any attribute",
                            value: attributeName,
                          }))
                      : []
                  }
                  onChange={(newValue) => onChange(newValue.value)}
                  isLoading={isMetadataLoading}
                />
              )}
            />
          </FormControl>

          {nftCustomAttributeValues?.length === 2 &&
          nftCustomAttributeValues.every(isNumber) ? (
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
                        value: +nftCustomAttributeValues[0],
                        message: `Minimum: ${nftCustomAttributeValues[0]}`,
                      },
                      max: {
                        value: +nftCustomAttributeValues[1],
                        message: `Maximum: ${nftCustomAttributeValues[1]}`,
                      },
                    }}
                    render={({ field: { onChange, ref } }) => (
                      <NumberInput
                        inputRef={ref}
                        min={+nftCustomAttributeValues[0]}
                        max={+nftCustomAttributeValues[1]}
                        defaultValue={
                          defaultValue?.[0] || +nftCustomAttributeValues[0]
                        }
                        onChange={(newValue) => {
                          if (!newValue) {
                            onChange(+nftCustomAttributeValues[0])
                          } else {
                            onChange(+newValue)
                          }
                        }}
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
                        value: +nftCustomAttributeValues[0],
                        message: `Minimum: ${nftCustomAttributeValues[0]}`,
                      },
                      max: {
                        value: +nftCustomAttributeValues[1],
                        message: `Maximum: ${nftCustomAttributeValues[1]}`,
                      },
                    }}
                    render={({ field: { onChange, ref } }) => (
                      <NumberInput
                        inputRef={ref}
                        min={+nftCustomAttributeValues[0]}
                        max={+nftCustomAttributeValues[1]}
                        defaultValue={
                          defaultValue?.[1] || +nftCustomAttributeValues[1]
                        }
                        onChange={(newValue) => {
                          if (!newValue) {
                            onChange(+nftCustomAttributeValues[1])
                          } else {
                            onChange(+newValue)
                          }
                        }}
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
            <FormControl isDisabled={!metadata}>
              <FormLabel>Custom attribute value:</FormLabel>
              <Controller
                control={control}
                name={`requirements.${index}.value`}
                rules={{
                  shouldUnregister: true,
                }}
                render={({ field: { onChange, ref } }) => (
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
                      nftCustomAttributeValues?.length
                        ? [""]
                            .concat(nftCustomAttributeValues)
                            .map((attributeValue) => ({
                              label:
                                attributeValue?.toString().charAt(0).toUpperCase() +
                                  attributeValue?.toString().slice(1) ||
                                "Any attribute values",
                              value: attributeValue,
                            }))
                        : []
                    }
                    onChange={(newValue) => onChange(newValue.value)}
                  />
                )}
              />
            </FormControl>
          )}
        </>
      )}

      {address &&
        ADDRESS_REGEX.test(address) &&
        !isMetadataLoading &&
        !nftCustomAttributeNames?.length && (
          <FormControl
            isRequired={
              address && !isMetadataLoading && !nftCustomAttributeNames?.length
            }
            isInvalid={errors?.requirements?.[index]?.value}
          >
            <FormLabel>Amount</FormLabel>
            <NumberInput defaultValue={1} min={1}>
              <NumberInputField
                {...register(`requirements.${index}.value`, {
                  required: {
                    value:
                      address &&
                      !isMetadataLoading &&
                      !nftCustomAttributeNames?.length,
                    message: "This field is required.",
                  },
                  min: {
                    value: 1,
                    message: "Amount must be positive",
                  },
                  valueAsNumber: true,
                  shouldUnregister: true,
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>
              {errors?.requirements?.[index]?.value?.message}
            </FormErrorMessage>
          </FormControl>
        )}
    </FormCard>
  )
}

export default NftFormCard
