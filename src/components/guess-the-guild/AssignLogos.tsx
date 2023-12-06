import {
  Box,
  Divider,
  HStack,
  Heading,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { Users } from "phosphor-react"
import { useState } from "react"
import pluralize from "utils/pluralize"

const AssignLogos = () => {
  const bgColor = useColorModeValue("gray.100", "whiteAlpha.200")
  const borderColor = useColorModeValue("gray.300", "gray.500")

  const [submitted, setSubmitted] = useState(false)

  const avatarSize = 90

  return (
    <>
      <VStack gap="5">
        <Heading
          as="h2"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          textAlign="center"
          fontFamily="display"
        >
          Guess the guild by the logo!
        </Heading>

        <Box
          p="2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="2"
        >
          <GuildLogo size={avatarSize} />
          <GuildLogo size={avatarSize} />
          <GuildLogo size={avatarSize} />
          <GuildLogo size={avatarSize} />
        </Box>

        <Card w="100%" py="5" px="5" background={bgColor}>
          <HStack gap="6">
            <Box
              h={avatarSize}
              w={avatarSize}
              minW={avatarSize}
              minH={avatarSize}
              rounded="100%"
              border="2px"
              borderStyle="dashed"
              borderColor={borderColor}
              p="1"
              boxSizing="content-box"
            ></Box>
            <VStack alignItems="start">
              <Text
                as="span"
                fontFamily="display"
                fontSize="lg"
                fontWeight="bold"
                letterSpacing="wide"
                maxW="full"
                noOfLines={1}
                wordBreak="break-all"
              >
                Guild Name
              </Text>
              <Wrap zIndex="1">
                <Tag as="li">
                  <TagLabel>{pluralize(1234, "role")}</TagLabel>
                </Tag>
                <Tag as="li">
                  <TagLeftIcon as={Users} />
                  <TagLabel>
                    {new Intl.NumberFormat("en", { notation: "compact" }).format(
                      1234
                    )}
                  </TagLabel>
                </Tag>
              </Wrap>
            </VStack>
          </HStack>
        </Card>

        <Divider />

        {submitted && (
          <Button colorScheme="green" w="100%">
            Continue
          </Button>
        )}
        {!submitted && (
          <Button colorScheme="green" w="100%" onClick={() => setSubmitted(true)}>
            Submit
          </Button>
        )}
      </VStack>
    </>
  )
}

export default AssignLogos
