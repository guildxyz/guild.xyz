import { SimpleGrid, Text, useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import { Rest } from "types"
import GuildLogo from "./GuildLogo"

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
      px={{ base: 5, sm: 6 }}
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
        templateColumns={image ? "3rem calc(100% - 4.25rem)" : "1fr"}
        gap={4}
        alignItems="center"
      >
        {image && <GuildLogo imageUrl={image} size={48} iconSize={20} />}
        <VStack spacing={2} alignItems="start" w="full" maxW="full" mb="1" mt="-1">
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
