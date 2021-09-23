import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import ColorCard from "components/common/ColorCard"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import useNftCustomAttributeNames from "../hooks/useNftCustomAttributeNames"
import useNftCustomAttributeValues from "../hooks/useNftCustomAttributeValues"
import useNftsList from "./hooks/useNftsList"

type Props = {
  index: number
  onRemove?: () => void
}
const NftFormCard = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const nfts = useNftsList()

  const pickedNftType = useWatch({ name: `requirements.${index}.type` })
  const nftCustomAttributeNames = useNftCustomAttributeNames(pickedNftType)
  const pickedAttribute = useWatch({
    name: `requirements.${index}.data`,
  })
  const nftCustomAttributeValues = useNftCustomAttributeValues(
    pickedNftType,
    pickedAttribute
  )
  const handleNftSelectChange = (newValue) => {
    setValue(`requirements.${index}.type`, newValue.value)
    setValue(`requirements.${index}.data`, null)
    setValue(`requirements.${index}.value`, null)
  }
  const handleNftAttributeSelectChange = (newValue) => {
    setValue(`requirements.${index}.data`, newValue.value)
    setValue(`requirements.${index}.value`, null)
  }
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
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl isRequired isInvalid={errors?.requirements?.[index]?.type}>
          <FormLabel>Pick an NFT:</FormLabel>
          <Select
            options={nfts?.map((nft) => ({
              img: nft.info.logoURI, // This will be displayed as an Img tag in the list
              label: nft.info.name, // This will be displayed as the option text in the list
              value: nft.info.type, // This will be passed to the hidden input
            }))}
            onChange={handleNftSelectChange}
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
        <FormControl isDisabled={!nftCustomAttributeNames?.length}>
          <FormLabel>Custom attribute:</FormLabel>
          <Select
            key={`${pickedNftType}-data-select`}
            placeholder="Any attribute"
            options={[""].concat(nftCustomAttributeNames).map((attributeName) => ({
              label:
                attributeName.charAt(0).toUpperCase() + attributeName.slice(1) ||
                "Any attribute",
              value: attributeName,
            }))}
            onChange={handleNftAttributeSelectChange}
          />
          <Input type="hidden" {...register(`requirements.${index}.data`)} />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={!nftCustomAttributeValues?.length}
          isInvalid={pickedAttribute?.length && errors?.requirements?.[index]?.value}
        >
          <FormLabel>Custom attribute value:</FormLabel>
          <Select
            key={`${pickedAttribute}-value-select`}
            placeholder="Any attribute values"
            options={[""].concat(nftCustomAttributeValues).map((attributeValue) => ({
              label:
                attributeValue?.toString().charAt(0).toUpperCase() +
                  attributeValue?.toString().slice(1) || "Any attribute values",
              value: attributeValue,
            }))}
            onChange={(newValue) =>
              setValue(`requirements.${index}.value`, newValue.value)
            }
          />
          <Input type="hidden" {...register(`requirements.${index}.value`)} />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </ColorCard>
  )
}
export default NftFormCard
