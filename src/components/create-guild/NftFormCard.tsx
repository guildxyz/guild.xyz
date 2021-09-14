import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CloseButton from "components/common/CloseButton"
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
    getValues,
    formState: { errors },
  } = useFormContext()
  const type = getValues(`requirements.${index}.type`)

  const { colorMode } = useColorMode()

  const pickedNftAddress = useWatch({ name: `requirements.${index}.address` })
  const nftCustomAttributeNames = useNftCustomAttributeNames(pickedNftAddress)
  const pickedAttribute = useWatch({
    name: `requirements.${index}.data`,
  })
  const nftCustomAttributeValues = useNftCustomAttributeValues(
    pickedNftAddress,
    pickedAttribute
  )

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      pt={10}
      pb={7}
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={RequirementTypeColors[type]}
      overflow="visible"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "primary.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
    >
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
            type &&
            errors.requirements &&
            errors.requirements[index] &&
            errors.requirements[index].address
          }
        >
          <FormLabel>Pick an NFT:</FormLabel>

          <Select
            {...register(`requirements.${index}.address`, {
              required: "This field is required.",
            })}
          >
            <option value="" defaultChecked>
              Select one
            </option>
            {nfts.map((nft) => (
              <option key={nft.address} value={nft.address}>
                {nft.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.address?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isDisabled={!nftCustomAttributeNames?.length}>
          <FormLabel>Custom attribute:</FormLabel>

          <Select {...register(`requirements.${index}.data`)}>
            <option value="" defaultChecked>
              Any attribute
            </option>

            {nftCustomAttributeNames?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>
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
            {...register(`requirements.${index}.value`, {
              required: {
                value: pickedAttribute?.length,
                message: "This field is required",
              },
            })}
            isDisabled={!nftCustomAttributeValues?.length}
          >
            <option value="" defaultChecked>
              Any attribute values
            </option>
            {nftCustomAttributeValues?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </Select>

          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.value?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </Card>
  )
}

export default NftFormCard
