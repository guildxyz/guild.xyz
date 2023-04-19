import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Image,
  Img,
  Text,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Link from "components/common/Link"
import slugify from "slugify"
import { BrainCardData } from "types"
type Props = {
  pageData: BrainCardData
}

const BrainCard = ({ pageData }: Props): JSX.Element => {
  const renderedTags = pageData.tags
    .filter((tag) => tag === "reward" || tag === "requirement")
    .sort((a, b) => a.length - b.length)
  const slugifiedTitle = slugify(pageData.title, { lower: true })

  return (
    <Link
      href={`/brain/${slugifiedTitle}`}
      prefetch={false}
      _hover={{ textDecor: "none" }}
    >
      <ColorCard
        color="gray.600"
        w="full"
        borderRadius="xl"
        borderWidth={0}
        p={0}
        role="group"
      >
        <ColorCardLabel
          labelSize="md"
          label={pageData.title}
          color="white"
          borderBottomRightRadius="xl"
          borderTopLeftRadius="xl"
          backgroundColor="gray.600"
          zIndex={1}
          maxW="90%"
        ></ColorCardLabel>
        <Flex h="160px" flexDirection="column">
          <Center
            position="relative"
            py={{ base: 12, md: 20 }}
            overflow={"hidden"}
            borderRadius="xl"
            minHeight="160px"
          >
            {pageData.backgroundImage && (
              <Image
                src={pageData?.backgroundImage}
                alt="background"
                fontSize={0}
                filter="blur(8px)"
                opacity="0.5"
                _groupHover={{ filter: "blur(7px)", opacity: 0.8 }}
                style={{ transition: "filter 0.3s, opacity 0.3s" }}
              />
            )}

            {pageData.icon && (
              <Image
                src={pageData?.icon}
                alt="icon"
                boxSize={16}
                pos="absolute"
                fontSize={0}
              />
            )}
          </Center>
          {renderedTags.length > 0 && (
            <Box
              right="0"
              bottom="0"
              h="auto"
              position="absolute"
              backgroundColor="blackAlpha.600"
              borderTopLeftRadius="xl"
              borderBottomRightRadius="xl"
              zIndex="1"
              py="1"
              px="4"
            >
              <HStack
                divider={
                  <Divider orientation="vertical" height="1em" borderWidth="1px" />
                }
                spacing="3"
              >
                {renderedTags.map((tag, index) => (
                  <HStack display="inline-flex" alignItems="center" key={index}>
                    <Img src={`/${tag}.svg`} h="14px" alt="tag icon" />
                    <Text fontWeight="bold" fontSize="sm">
                      {tag}
                    </Text>
                  </HStack>
                ))}
              </HStack>
            </Box>
          )}
        </Flex>
      </ColorCard>
    </Link>
  )
}

export default BrainCard
