import {
  Circle,
  Heading,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import Image from "next/image"
import { Rest } from "types"

type Props = {
  title: string
  description?: string
  imageUrl: string
  onSelection: () => void
  disabledText?: string
} & Rest

const SolutionSelectButton = ({
  title,
  description,
  imageUrl,
  onSelection,
  disabledText,
  ...rest
}: Props) => {
  const circleBgColor = useColorModeValue("gray.100", "gray.600")

  return (
    <Tooltip isDisabled={!disabledText} label={disabledText} hasArrow>
      <DisplayCard
        cursor={!!disabledText ? "default" : "pointer"}
        onClick={!!disabledText ? undefined : onSelection}
        h="auto"
        {...rest}
        opacity={!!disabledText ? 0.5 : 1}
      >
        <HStack spacing={4}>
          <Circle size="12" pos="relative" overflow="hidden" bgColor={circleBgColor}>
            <Image src={imageUrl} alt="Guild logo" fill sizes="3rem" />
          </Circle>
          <VStack
            spacing={{ base: 0.5, lg: 1 }}
            alignItems="start"
            w="full"
            maxW="full"
          >
            <Heading
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
            >
              {title}
            </Heading>
            <Text letterSpacing="wide" colorScheme="gray">
              {description}
            </Text>
          </VStack>
        </HStack>
      </DisplayCard>
    </Tooltip>
  )
}

export default SolutionSelectButton
