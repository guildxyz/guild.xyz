import { Box, Center, Flex, Image, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { title } from "process"
import { BrainCardData } from "types"

type Props = {
  pageData: BrainCardData
}

const BrainCard = ({ pageData }: Props): JSX.Element => {
  const renderedTags = pageData.tags
    .filter((tag) => tag === "reward" || tag === "requirement")
    .sort((a, b) => a.length - b.length)
  return (
    <Link
      href={`/brain/${pageData.id}`}
      prefetch={false}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
    >
      <Card
        position="relative"
        w="full"
        role="group"
        borderWidth={4}
        borderColor="gray.600"
      >
        <Flex h="165px" flexDirection="column">
          <Box
            left="-4px"
            top="-4px"
            position="absolute"
            backgroundColor="gray.600"
            borderBottomRightRadius={15}
            zIndex={1}
          >
            <Text
              fontFamily="display"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
              px="22px"
              py="2px"
            >
              {pageData.title}
            </Text>
          </Box>
          <Center py={{ base: 12, md: 20 }} position="relative" overflow={"hidden"}>
            {pageData.backgroundImage && (
              <Image
                position="absolute"
                w="full"
                h="full"
                src={pageData.backgroundImage}
                alt={`${title} image`}
                opacity="90%"
                filter={`blur(8px)`}
                objectFit="cover"
                transition="filter 0.3s"
                _groupHover={{ filter: "blur(2px)" }}
              />
            )}
            <Box
              rounded="50%"
              w="75px"
              h="75px"
              zIndex={1}
              justifyContent="center"
              alignContent="center"
              display="grid"
            >
              {pageData.icon && (
                <Image
                  objectFit="cover"
                  src={pageData.icon}
                  alt="icon"
                  maxH="75px"
                  minW="40px"
                  maxW="75px"
                />
              )}
            </Box>
          </Center>

          {renderedTags.length > 0 && (
            <Box
              right="-4px"
              bottom="0px"
              h="29px"
              position="absolute"
              backgroundColor="rgba(45, 55, 72,0.75)"
              borderTopLeftRadius="15px"
              zIndex="1"
              py="3px"
              px="18px"
            >
              {renderedTags.map((tag, index) => (
                <Box display="inline-flex" alignItems="center" key={index}>
                  <Image
                    src={`/${tag}.svg`}
                    h="14px"
                    mr="6px"
                    alt="page logo"
                  ></Image>
                  <Text fontWeight="bold" fontSize="14px">
                    {tag}
                  </Text>
                  {renderedTags.length > 1 && index < renderedTags.length - 1 && (
                    <Text px="8px" fontWeight="extrabold" color="gray.450">
                      |
                    </Text>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Flex>
      </Card>
    </Link>
  )
}

export default BrainCard
