import { Box, FormControl, HStack, Img, Input, Stack, Text } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import RewardImagePicker from "platforms/SecretText/SecretTextDataForm/components/RewardImagePicker"
import { useFormContext } from "react-hook-form"
import Star from "static/icons/star.svg"

const AddNewPointsType = ({ name, imageUrl, isOptional }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Stack
      direction={{
        base: "column",
        sm: "row",
      }}
      pos="relative"
      alignItems={{
        sm: "flex-end",
      }}
      gap={4}
    >
      <FormControl isInvalid={!!errors?.rolePlatforms?.[0]?.name} flex="1">
        <Text fontWeight={"medium"} mb="2">
          {`Appearance `}
          {isOptional && (
            <Text as="span" colorScheme={"gray"}>
              (optional)
            </Text>
          )}
        </Text>
        <HStack>
          <RewardImagePicker defaultIcon={Star} />
          <Input {...register("name")} placeholder="points" />
        </HStack>
        <FormErrorMessage>{errors?.name?.message as string}</FormErrorMessage>
      </FormControl>
      <Box flex="1">
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          textTransform="uppercase"
          mb="2"
          transition={"opacity .2s"}
        >
          Preview
        </Text>
        <HStack
          h="40px"
          px="4"
          w="full"
          borderWidth={1}
          borderStyle={"dashed"}
          borderRadius={"lg"}
        >
          {imageUrl ? (
            <Img src={imageUrl} boxSize="5" borderRadius={"full"} />
          ) : (
            <Star />
          )}
          <Text>
            Get{" "}
            <Text as="span" fontWeight={"semibold"}>
              {`50 ${name || "points"}`}
            </Text>
          </Text>
        </HStack>
      </Box>
    </Stack>
  )
}

export default AddNewPointsType
