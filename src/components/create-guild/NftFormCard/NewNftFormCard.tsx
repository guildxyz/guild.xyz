import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import useNftMetadata from "../hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"

type Props = {
  index: number
  onRemove?: () => void
}

const NewNftFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const { isLoading, nfts } = useNfts()
  const {
    setValue,
    trigger,
    formState: { errors },
    control,
  } = useFormContext()

  const address = useWatch({ name: `requirements.${index}.address` })
  const data = useWatch({ name: `requirements.${index}.data` })

  const [isCustomNft, setIsCustomNft] = useState(false)
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
          <Controller
            control={control}
            name={`requirements.${index}.address`}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, ref } }) => (
              <Select
                inputRef={ref}
                options={nfts?.map((nft) => ({
                  img: nft.logoUri, // This will be displayed as an Img tag in the list
                  label: nft.name, // This will be displayed as the option text in the list
                  value: nft.address, // This is the actual value of this select
                  slug: nft.slug, // Will use it for searching NFT attributes
                }))}
                isLoading={isLoading}
                onChange={(newValue) => {
                  onChange(newValue.value)
                  setIsCustomNft(false)
                  setPickedNftSlug(newValue.slug)
                  setValue(`requirements.${index}.type`, "OPENSEA")
                  setValue(`requirements.${index}.data`, null)
                  setValue(`requirements.${index}.value`, null)
                }}
                filterOption={(candidate, input) =>
                  candidate.label.toLowerCase().startsWith(input?.toLowerCase())
                }
                placeholder="Search..."
                onBlur={() => trigger(`requirements.${index}.address`)}
              />
            )}
          />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.address?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isDisabled={!pickedNftSlug}>
          <FormLabel>Custom attribute:</FormLabel>
          <Controller
            control={control}
            name={`requirements.${index}.data`}
            render={({ field: { onChange, ref } }) => (
              <Select
                // key={`${pickedNftType}-data-select`}
                placeholder="Any attribute"
                options={
                  nftCustomAttributeNames?.length
                    ? [""].concat(nftCustomAttributeNames).map((attributeName) => ({
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

        <FormControl isDisabled={!pickedNftSlug}>
          <FormLabel>Custom attribute value:</FormLabel>
          <Controller
            control={control}
            name={`requirements.${index}.value`}
            render={({ field: { onChange, ref } }) => (
              <Select
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
      </VStack>
    </ColorCard>
  )
}

export default NewNftFormCard
