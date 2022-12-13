import { Box, Flex, Icon, Image, Tag, TagLabel, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Check } from "phosphor-react"
import { PageDetailsCardData } from "types"

type Props = {
  pageData: PageDetailsCardData
}

const PageDetailsCard = ({ pageData }: Props): JSX.Element => {
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
      <Card position="relative" w="full" role="group">
        <Flex h="170px" flexDirection="column">
          <Flex h="58%">
            <Box>
              {pageData.backgroundImage ? (
                <Image
                  w="full"
                  position="absolute"
                  bottom="60px"
                  filter="blur(8px)"
                  src={pageData.backgroundImage}
                  alt="background image"
                  transition="filter 0.3s"
                  _groupHover={{ filter: "blur(4px)" }}
                />
              ) : null}
            </Box>
            <Box
              alignSelf="flex-end"
              position="absolute"
              right="6px"
              mb="2px"
              display="flex"
              alignItems="end"
              flexDirection="column"
            >
              {renderedTags.map((tag, index) => (
                <Tag backgroundColor="rgba(63,63,70, 0.8)" key={index} mb="6px">
                  <Image
                    src={`${tag}.svg`}
                    width="14px"
                    mr="6px"
                    alt="page logo"
                  ></Image>
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
            </Box>
          </Flex>
          <Flex
            position="relative"
            width="full"
            h="32%"
            background="gray.700"
            pt="8px"
            alignItems="center"
            pr="16px"
          >
            {pageData.icon ? (
              <Box
                position="absolute"
                left="12px"
                top="-80px"
                rounded="50%"
                outline={"2px solid var(--chakra-colors-blackAlpha-500)"}
                w="100px"
                h="100px"
                backgroundColor={
                  pageData.iconBgColor ? pageData.iconBgColor : "gray.700"
                }
                justifyContent="center"
                alignContent="center"
                display="grid"
              >
                <Image
                  objectFit="cover"
                  src={pageData.icon}
                  alt="background image"
                  maxH="100px"
                  maxW="100px"
                  padding={pageData.iconBgColor ? "8px" : null}
                />
              </Box>
            ) : null}
            <Box position="absolute" right="8px" top="8px">
              <Icon
                as={Check}
                size="50px"
                boxSize="1.7em"
                color="green.600"
                weight="bold"
              ></Icon>
            </Box>
            <Text
              as="span"
              fontFamily="display"
              fontSize="2xl"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              noOfLines={1}
              zIndex={1}
              mt="20px"
              pl="16px"
            >
              {pageData.title}
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Link>
  )
}

export default PageDetailsCard
