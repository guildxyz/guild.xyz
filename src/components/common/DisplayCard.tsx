import {
  Box,
  Flex,
  Img,
  SimpleGrid,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  image?: string
  title: string
} & Rest

const DisplayCard = ({
  image,
  title,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, sm: 7 }}
      py="7"
      w="full"
      h="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      justifyContent="center"
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
      _hover={{
        _before: {
          opacity: 0.1,
        },
      }}
      _active={{
        _before: {
          opacity: 0.17,
        },
      }}
      {...rest}
    >
      <SimpleGrid
        templateColumns={image ? "2.5rem calc(100% - 3.25rem)" : "1fr"}
        gap={3}
      >
        {image && (
          <Flex alignItems="center">
            <Box
              padding={2}
              bgColor={colorMode === "light" ? "gray.700" : "transparent"}
              boxSize={10}
              minW={10}
              minH={10}
              rounded="full"
            >
              <Img src={image} htmlWidth="1.5rem" htmlHeight="1.5rem" boxSize={6} />
            </Box>
          </Flex>
        )}
        <VStack spacing={3} alignItems="start" w="full" maxW="full">
          <Text
            as="span"
            fontFamily="display"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            isTruncated
          >
            {title}
          </Text>
          {children}
        </VStack>
      </SimpleGrid>
    </Card>
  )
}

export default DisplayCard
