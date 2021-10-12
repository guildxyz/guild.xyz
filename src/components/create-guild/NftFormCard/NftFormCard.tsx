import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import useTokenData from "hooks/useTokenData"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
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
  const { isLoading, nfts } = useNfts()
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
    control,
  } = useFormContext()

  const type = useWatch({ name: `requirements.${index}.type` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const data = useWatch({ name: `requirements.${index}.data` })

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(pickedNftSlug)

  const nftCustomAttributeNames = useMemo(
    () => Object.keys(metadata || {}),
    [metadata]
  )

  const nftCustomAttributeValues = useMemo(
    () => metadata?.[data] || [],
    [metadata, data]
  )

  const [isCustomNft, setIsCustomNft] = useState(false)
  const { isLoading: isOpenseaNftLoading, nft: openseaNft } = useOpenseaNft(
    isCustomNft ? address : null
  )

  useEffect(() => {
    if (!isCustomNft) return

    if (!isOpenseaNftLoading && openseaNft) {
      setPickedNftSlug(openseaNft.slug)
      setValue(`requirements.${index}.type`, "OPENSEA")
      setValue(`requirements.${index}.value`, null)
    } else {
      setValue(`requirements.${index}.type`, "NFT")
      setValue(`requirements.${index}.value`, 1)
    }

    setValue(`requirements.${index}.data`, null)
  }, [isCustomNft, isOpenseaNftLoading, openseaNft])

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

  return (
    <ColorCard color={RequirementTypeColors["NFT"]}>
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          aria-label="Remove requirement"
          zIndex="1"
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
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
                  (!isOpenseaNftLoading && !!openseaNft) ||
                  !isCustomNftLoading ||
                  !wrongChain ||
                  nftDataFetched ||
                  "Couldn't fetch NFT data",
              }}
              render={({ field: { onChange, ref } }) => (
                <Select
                  isCreatable
                  formatCreateLabel={(_) => `Add custom NFT`}
                  inputRef={ref}
                  options={nfts?.map((nft) => ({
                    img: nft.logoUri, // This will be displayed as an Img tag in the list
                    label: nft.name, // This will be displayed as the option text in the list
                    value: nft.address, // This is the actual value of this select
                    slug: nft.slug, // Will use it for searching NFT attributes
                  }))}
                  isLoading={isLoading || isOpenseaNftLoading}
                  onChange={(newValue) => {
                    onChange(newValue.value)
                    setPickedNftSlug(newValue.slug)
                    setIsCustomNft(false)
                    setValue(`requirements.${index}.type`, "OPENSEA")
                    setValue(`requirements.${index}.data`, null)
                    setValue(`requirements.${index}.value`, null)
                  }}
                  onCreateOption={(createdOption) => {
                    setIsCustomNft(true)
                    setValue(`requirements.${index}.address`, createdOption)
                    setValue(`requirements.${index}.type`, "OPENSEA")
                  }}
                  filterOption={(candidate, input) => {
                    const lowerCaseInput = input.toLowerCase()
                    return (
                      candidate.label.toLowerCase().includes(lowerCaseInput) ||
                      candidate.value.toLowerCase() === lowerCaseInput
                    )
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

        {(!address ||
          (type !== "NFT" &&
            !isMetadataLoading &&
            nftCustomAttributeNames?.length)) && (
          <>
            <FormControl isDisabled={!pickedNftSlug || !metadata}>
              <FormLabel>Custom attribute:</FormLabel>
              <Controller
                control={control}
                name={`requirements.${index}.data`}
                render={({ field: { onChange, ref } }) => (
                  <Select
                    key={`${address}-data`}
                    inputRef={ref}
                    placeholder="Any attribute"
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

            <FormControl isDisabled={!pickedNftSlug || !metadata}>
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
                    placeholder="Any attribute values"
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
          </>
        )}

        {address && !isMetadataLoading && !nftCustomAttributeNames?.length && (
          <FormControl
            isRequired={isCustomNft && type === "NFT"}
            isInvalid={errors?.requirements?.[index]?.value}
          >
            <FormLabel>Amount</FormLabel>
            <NumberInput defaultValue={1} min={1}>
              <NumberInputField
                {...register(`requirements.${index}.value`, {
                  required: {
                    value: isCustomNft && type === "NFT",
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
      </VStack>
    </ColorCard>
  )
}

export default NftFormCard
