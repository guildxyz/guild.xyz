import { Card, Text, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { BrainCardData } from "types"

type Props = {
  pageData: BrainCardData
}

const PageBrainCard = ({ pageData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Link
      href={`/brain/${pageData.id}`}
      prefetch={false}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
    >
      <Card
        borderRadius="2xl"
        px={{ base: 5, sm: 6 }}
        py="4"
        w="full"
        h="full"
        bg={colorMode === "light" ? "white" : "gray.700"}
        justifyContent="top"
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
            borderRadius: "2xl",
          },
        }}
        _active={{
          _before: {
            opacity: 0.17,
            borderRadius: "2xl",
          },
          _after: {
            opacity: 0.17,
            borderRadius: "2xl",
            backgroundColor: "red",
          },
        }}
      >
        <Text
          as="span"
          fontFamily="display"
          fontSize="lg"
          fontWeight="bold"
          letterSpacing="wide"
          maxW="full"
        >
          {pageData.title}
        </Text>
      </Card>
    </Link>
  )
}

export default PageBrainCard
