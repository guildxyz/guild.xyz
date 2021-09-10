import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import { useFormContext } from "react-hook-form"
import { RequirementTypeColors } from "temporaryData/types"
import useMyPoaps from "./hooks/useMyPoaps"

type Props = {
  index: number
  clickHandler?: () => void
}

const PoapFormCard = ({ index, clickHandler }: Props): JSX.Element => {
  const { account } = useWeb3React()

  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext()
  const type = getValues(`requirements.${index}.type`)

  const { colorMode } = useColorMode()

  const poaps = useMyPoaps(account)

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
      {typeof clickHandler === "function" && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          width={8}
          height={8}
          rounded="full"
          zIndex="docked"
          aria-label="Remove level"
          onClick={clickHandler}
        />
      )}
      <VStack spacing={4} alignItems="start">
        {poaps?.length > 0 ? (
          <FormControl
            isRequired
            isInvalid={
              type &&
              errors.requirements &&
              errors.requirements[index] &&
              errors.requirements[index].address
            }
          >
            <FormLabel>Pick a POAP:</FormLabel>
            <Select
              {...register(`requirements.${index}.address`, {
                required: "This field is required.",
              })}
            >
              <option value="" defaultChecked>
                Select one
              </option>
              {poaps.map((poap) => (
                <option key={poap.tokenId} value={poap.tokenId}>
                  {poap.event.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {errors.requirements && errors.requirements[index]?.address?.message}
            </FormErrorMessage>
          </FormControl>
        ) : (
          <Text>Looks like you don't have any POAP yet.</Text>
        )}
      </VStack>
    </Card>
  )
}

export default PoapFormCard
