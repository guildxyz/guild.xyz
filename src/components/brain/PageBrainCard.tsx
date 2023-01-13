import {
  Card,
  HStack,
  Img,
  SimpleGrid,
  Tag,
  TagLabel,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import Link from "components/common/Link"
import { BrainCardData } from "types"

type Props = {
  pageData: BrainCardData
}

const PageBrainCard = ({ pageData }: Props): JSX.Element => {
  const renderedTags = pageData.tags
    .filter((tag) => tag === "reward" || tag === "requirement")
    .sort((a, b) => a.length - b.length)
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
            borderRadius: "2xl",
          },
        }}
        _active={{
          _before: {
            opacity: 0.17,
            borderRadius: "2xl",
          },
          _after: {
            // TODO: hover leaving
            opacity: 0.17,
            borderRadius: "2xl",
            backgroundColor: "red",
          },
        }}
        // {...rest}
      >
        <SimpleGrid
          templateColumns={pageData.icon ? "3rem calc(100% - 4.25rem)" : "1fr"}
          gap={4}
          alignItems="center"
        >
          {pageData.icon && <GuildLogo imageUrl={pageData.icon} size={"48px"} />}
          <VStack spacing={2} alignItems="start" w="full" maxW="full" mb="1" mt="-1">
            <Text
              as="span"
              fontFamily="display"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              overflow="unset" // TODO: optional (doesn't work on explorer)
            >
              {pageData.title}
            </Text>
          </VStack>
        </SimpleGrid>
        {renderedTags.length > 0 && (
          <HStack spacing="3" mt="8px">
            {renderedTags.map((tag, index) => (
              <Tag as="li" key={index} px="10px">
                <Img src={`/${tag}.svg`} h="14px" mr="6px" alt="page logo" />
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </HStack>
        )}
      </Card>
    </Link>
  )
}

export default PageBrainCard
