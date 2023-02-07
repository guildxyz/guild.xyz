import { Box, Center, Divider, Flex, HStack, Img, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Link from "components/common/Link"
import Image from "next/image"
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
      borderRadius="2xl"
    >
      <ColorCard
        color="gray.600"
        w="full"
        borderWidth={4}
        p={0}
        sx={{
          "div:nth-child(2) div.background > span img": {
            filter: "blur(8px)",
            opacity: 0.4,
          },
          ":hover div:nth-child(2) div.background > span img": {
            filter: "blur(7px)",
            opacity: 0.6,
          },
        }}
      >
        <ColorCardLabel
          mt="-1px"
          ml="-1px"
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
            className="background"
          >
            {pageData.backgroundImage && (
              <Image
                src={pageData?.backgroundImage}
                alt="background"
                layout="fill"
                objectFit="cover"
                quality="2"
                style={{ transition: "filter 0.3s, opacity 0.3s" }}
              />
            )}

            {pageData.icon && (
              <Center boxSize={16} position="relative">
                <Image
                  src={pageData?.icon}
                  alt="icon"
                  layout="fill"
                  objectFit="contain"
                  quality="25"
                  style={{
                    zIndex: "1",
                    overflow: "visible",
                  }}
                />
              </Center>
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
