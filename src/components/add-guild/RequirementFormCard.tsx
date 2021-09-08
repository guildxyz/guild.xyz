import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { useFormContext } from "react-hook-form"
import { HoldTypeColors } from "temporaryData/guilds"

const RequirementFormCard = ({ field, index }): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext()

  const holdType = getValues(`requirements.${index}.holdType`)

  const { colorMode } = useColorMode()

  // We can extract this too in a hook later
  let fieldName = ""

  switch (holdType) {
    case "NFT":
      fieldName = `requirements.${index}.nft`
      break
    case "POAP":
      fieldName = `requirements.${index}.poap`
      break
    default:
      fieldName = `requirements.${index}.token`
  }

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      py="7"
      w="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      borderWidth={2}
      borderColor={HoldTypeColors[holdType]}
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
      <VStack spacing={4} alignItems="start">
        <FormControl
          isRequired
          isInvalid={errors.requirements && errors.requirements[index]?.name}
        >
          <FormLabel>
            Search for
            {holdType === "NFT" && " an NFT or paste smart contract address"}
            {holdType === "POAP" && " search for a POAP"}
            {holdType === "TOKEN" && " an ERC-20 token"}
          </FormLabel>
          <Input
            key={field.id} // important to include key with field's id
            {...register(fieldName, {
              required: "This field is required.",
            })}
            defaultValue={field.value} // make sure to include defaultValue
          />
          <FormErrorMessage>
            {errors.requirements && errors.requirements[index]?.name?.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </Card>
  )
}

export default RequirementFormCard
