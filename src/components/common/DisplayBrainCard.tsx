import { SimpleGrid, Text, useColorMode, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import GuildLogo from "./GuildLogo"

type Props = {
  image?: string
  title: string
}

const DisplayBrainCard = ({
  image,
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card
      position="relative"
      py="7"
      w="full"
      h="140px"
      bg={colorMode === "light" ? "white" : "gray.700"}
      justifyContent="center"
    >
      <SimpleGrid
        templateColumns={image ? "3rem calc(100% - 4.25rem)" : "1fr"}
        gap={4}
        alignItems="center"
      >
        {image && <GuildLogo imageUrl={image} size={"48px"} />}
        <VStack spacing={2} alignItems="start" w="full" maxW="full" mb="1" mt="-1">
          <Text
            as="span"
            fontFamily="display"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            noOfLines={1}
            zIndex={1}
            background="rgba(0, 0, 0, 0.77)"
            borderRadius="0 5px 5px 0"
            px="16px"
            pb="3px"
          >
            {title}
          </Text>
          {children}
        </VStack>
      </SimpleGrid>
    </Card>
  )
}

export default DisplayBrainCard
