import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Select from "components/common/ChakraReactSelect/ChakraReactSelect"
import CloseButton from "components/common/CloseButton"
import ColorCard from "components/common/ColorCard"
import { useFormContext, useWatch } from "react-hook-form"
import { nfts } from "temporaryData/nfts"
import { RequirementTypeColors } from "temporaryData/types"
import useNftCustomAttributeNames from "./hooks/useNftCustomAttributeNames"
import useNftCustomAttributeValues from "./hooks/useNftCustomAttributeValues"

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

  const { colorMode } = useColorMode()

  const pickedNftType = useWatch({ name: `requirements.${index}.type` })
  const nftCustomAttributeNames = useNftCustomAttributeNames(pickedNftType)
  const pickedAttribute = useWatch({
    name: `requirements.${index}.data`,
  })
  const nftCustomAttributeValues = useNftCustomAttributeValues(
    pickedNftType,
    pickedAttribute
  )

  return (
    <ColorCard color={RequirementTypeColors["NFT"]}>
      {typeof onRemove === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          zIndex="docked"
          aria-label="Remove requirement"
          onClick={onRemove}
        />
      )}
      <VStack spacing={4} alignItems="start">
        <FormControl
          isRequired
          isInvalid={
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].type
          }
        >
          <FormLabel>Pick an NFT:</FormLabel>

          <Select
            options={nfts.map((nft) => ({
              img: nft.logoURI, // This will be displayed as an Img tag in the list
              label: nft.name, // This will be displayed as the option text in the list
              value: nft.type, // This will be passed to the hidden input
            }))}
            onChange={(newValue) =>
              setValue(`requirements.${index}.type`, newValue.value)
            }
          />
          <Input
            type="hidden"
            {...register(`requirements.${index}.type`, {
              required: "This field is required.",
            })}
          />
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.type?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isDisabled={!nftCustomAttributeNames?.length}>
          <FormLabel>Custom attribute:</FormLabel>

          <Select
            placeholder="Any attribute"
            options={[""].concat(nftCustomAttributeNames).map((attributeName) => ({
              label:
                attributeName.charAt(0).toUpperCase() + attributeName.slice(1) ||
                "Any attribute",
              value: attributeName,
            }))}
            onChange={(newValue) =>
              setValue(`requirements.${index}.data`, newValue.value)
            }
          />
          <Input type="hidden" {...register(`requirements.${index}.data`)} />
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.data?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isDisabled={!nftCustomAttributeValues?.length}
          isRequired={pickedAttribute?.length}
          isInvalid={
            pickedAttribute?.length &&
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].value
          }
        >
          <FormLabel>Custom attribute value:</FormLabel>

          <Select
            placeholder="Any attribute values"
            options={[""].concat(nftCustomAttributeValues).map((attributeValue) => ({
              label:
                attributeValue.toString().charAt(0).toUpperCase() +
                  attributeValue.toString().slice(1) || "Any attribute values",
              value: attributeValue,
            }))}
            onChange={(newValue) =>
              setValue(`requirements.${index}.value`, newValue.value)
            }
          />
          <Input
            type="hidden"
            {...register(`requirements.${index}.value`, {
              required: {
                value: pickedAttribute?.length,
                message: "This field is required",
              },
            })}
          />

          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </ColorCard>
  )
}

export default NftFormCard
