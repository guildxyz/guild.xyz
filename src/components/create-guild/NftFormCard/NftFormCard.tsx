import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
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
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import useNftCustomAttributeNames from "../hooks/useNftCustomAttributeNames"
import useNftCustomAttributeValues from "../hooks/useNftCustomAttributeValues"
import Symbol from "../Symbol"
import useNfts from "./hooks/useNfts"

type Props = {
  index: number
  onRemove?: () => void
}
const NftFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const { isLoading, nfts } = useNfts()
  const [isCustomNft, setIsCustomNft] = useState(false)

  const pickedNftType = useWatch({ name: `requirements.${index}.type` })

  useEffect(() => {
    if (pickedNftType !== "NFT") {
      // Clear errors when switching back from custom NFT type to simple NFT type
      clearErrors([`requirements.${index}.address`, `requirements.${index}.value`])
      setValue(`requirements.${index}.value`, null)
      setIsCustomNft(false)
    } else {
      clearErrors([`requirements.${index}.type`, `requirements.${index}.value`])
    }
  }, [pickedNftType])

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const nftCustomAttributeNames = useNftCustomAttributeNames(pickedNftSlug)

  const pickedAttribute = useWatch({
    name: `requirements.${index}.data`,
  })

  const nftCustomAttributeValues = useNftCustomAttributeValues(
    pickedNftSlug,
    pickedAttribute
  )
  const handleNftSelectChange = (newValue) => {
    setValue(`requirements.${index}.type`, newValue.value)
    setPickedNftSlug(newValue.slug)
    setValue(`requirements.${index}.address`, newValue.address)
    setValue(`requirements.${index}.data`, null)
    setValue(`requirements.${index}.value`, null)
  }
  const handleNftAttributeSelectChange = (newValue) => {
    setValue(`requirements.${index}.data`, newValue.value)
    setValue(`requirements.${index}.value`, null)
  }

  /*
  const logic = useWatch({ name: "logic" })
  const shouldShowLogic = useBreakpointValue({
    base: index > 0,
    md: index % 2 !== 0,
    lg: index % 3 !== 0,
  })
  */

  const nftAddress = useWatch({ name: `requirements.${index}.address` })

  // "Switch back" to simple NFT type
  useEffect(() => {
    if (isCustomNft && !nftAddress?.length) setIsCustomNft(false)
  }, [nftAddress])

  const {
    data: [nftName, nftSymbol],
    isValidating: isNftSymbolValidating,
  } = useTokenData(nftAddress)

  const nftDataFetched = useMemo(
    () =>
      typeof nftName === "string" &&
      nftName.length > 0 &&
      typeof nftSymbol === "string" &&
      nftSymbol.length > 0,
    [nftName, nftSymbol]
  )

  const onInputChange = (text: string, action: string) => {
    if (action !== "input-change") return
    if (text.startsWith("0x")) {
      setValue(`requirements.${index}.type`, "NFT")
      setValue(`requirements.${index}.address`, text)
      setValue(`requirements.${index}.value`, "1")
      setIsCustomNft(true)
    }
  }

  useEffect(() => {
    if (touchedFields.requirements && touchedFields.requirements[index]?.address)
      trigger(`requirements.${index}.address`)
  }, [isNftSymbolValidating, nftDataFetched, trigger, touchedFields])

  return (
    <ColorCard color={RequirementTypeColors["NFT"]}>
      {/* logic && shouldShowLogic && <LogicIcon logic={logic} /> */}
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
        {!isCustomNft && (
          <FormControl
            isRequired={!isCustomNft}
            isInvalid={errors?.requirements?.[index]?.type}
          >
            <FormLabel>Pick an NFT:</FormLabel>
            <Select
              options={nfts?.map((nft) => ({
                img: nft.logoURI, // This will be displayed as an Img tag in the list
                label: nft.name, // This will be displayed as the option text in the list
                value: nft.type, // This will be passed to the hidden input
                slug: nft.slug, // Will use it for searching NFT attributes
                address: nft.address,
              }))}
              onInputChange={(text, { action }) => onInputChange(text, action)}
              onChange={handleNftSelectChange}
              placeholder="Search / paste address"
              isLoading={isLoading}
            />
            <Input
              type="hidden"
              {...register(`requirements.${index}.type`, {
                required: "This field is required.",
              })}
            />
            <FormErrorMessage>
              {errors?.requirements?.[index]?.type?.message}
            </FormErrorMessage>
          </FormControl>
        )}

        {isCustomNft && (
          <FormControl
            isRequired={isCustomNft}
            isInvalid={errors?.requirements?.[index]?.address}
          >
            <FormLabel>Pick an NFT:</FormLabel>
            <HStack maxW="full">
              {((!errors?.requirements?.[index]?.address &&
                nftDataFetched &&
                nftSymbol !== undefined) ||
                isNftSymbolValidating) && (
                <Symbol
                  symbol={nftSymbol}
                  isSymbolValidating={isNftSymbolValidating}
                />
              )}

              <Input
                {...register(`requirements.${index}.address`, {
                  required: {
                    value: pickedNftType === "NFT",
                    message: "This field is required.",
                  },
                  pattern: nftAddress?.startsWith("0x") && {
                    value: /^0x[A-F0-9]{40}$/i,
                    message:
                      "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                  },
                  shouldUnregister: true,
                })}
              />
            </HStack>
            <FormErrorMessage>
              {errors?.requirements?.[index]?.address?.message}
            </FormErrorMessage>
          </FormControl>
        )}

        {isCustomNft ? (
          <FormControl
            isRequired={isCustomNft}
            isInvalid={errors?.requirements?.[index]?.value}
          >
            <FormLabel>Amount</FormLabel>
            <NumberInput defaultValue={1} min={1}>
              <NumberInputField
                {...register(`requirements.${index}.value`, {
                  required: {
                    value: pickedNftType === "NFT",
                    message: "This field is required.",
                  },
                  min: {
                    value: 1,
                    message: "Amount must be positive",
                  },
                  valueAsNumber: true,
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
        ) : (
          <>
            <FormControl isDisabled={!nftCustomAttributeNames?.length}>
              <FormLabel>Custom attribute:</FormLabel>
              <Select
                key={`${pickedNftType}-data-select`}
                placeholder="Any attribute"
                options={[""]
                  .concat(nftCustomAttributeNames)
                  .map((attributeName) => ({
                    label:
                      attributeName.charAt(0).toUpperCase() +
                        attributeName.slice(1) || "Any attribute",
                    value: attributeName,
                  }))}
                onChange={handleNftAttributeSelectChange}
              />
              <Input
                type="hidden"
                {...register(`requirements.${index}.data`, {
                  shouldUnregister: true,
                })}
              />
              <FormErrorMessage>
                {errors?.requirements?.[index]?.data?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isDisabled={!nftCustomAttributeValues?.length}
              isInvalid={
                pickedAttribute?.length && errors?.requirements?.[index]?.value
              }
            >
              <FormLabel>Custom attribute value:</FormLabel>
              <Select
                key={`${pickedAttribute}-value-select`}
                placeholder="Any attribute values"
                options={[""]
                  .concat(nftCustomAttributeValues)
                  .map((attributeValue) => ({
                    label:
                      attributeValue?.toString().charAt(0).toUpperCase() +
                        attributeValue?.toString().slice(1) ||
                      "Any attribute values",
                    value: attributeValue,
                  }))}
                onChange={(newValue) =>
                  setValue(`requirements.${index}.value`, newValue.value)
                }
              />
              <Input
                type="hidden"
                {...register(`requirements.${index}.value`, {
                  required: false,
                  valueAsNumber: false,
                })}
              />
              <FormErrorMessage>
                {errors?.requirements?.[index]?.value?.message}
              </FormErrorMessage>
            </FormControl>
          </>
        )}
      </VStack>
    </ColorCard>
  )
}
export default NftFormCard
