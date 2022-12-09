import {
  Box,
  Flex,
  Image,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Users } from "phosphor-react"
import { PageDetailsCardData } from "types"

type Props = {
  pageData: PageDetailsCardData
}

const PageDetailsCard = ({ pageData }: Props): JSX.Element => (
  <Link
    href={`/brain/${pageData.id}`}
    prefetch={false}
    _hover={{ textDecor: "none" }}
    borderRadius="2xl"
  >
    <Card position="relative" w="full" role="group">
      <Flex h="180px" flexDirection="column">
        <Flex h="62%">
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
          <Wrap alignSelf="flex-end" position="absolute" right="8px" mb="10px">
            <Tag backgroundColor="gray.800">
              <TagLeftIcon as={Users} />
              <TagLabel>reward</TagLabel>
            </Tag>
          </Wrap>
        </Flex>
        <Flex
          position="relative"
          width="full"
          h="38%"
          background="#1A1A1E"
          justifyContent="flex-end"
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
                pageData.iconBgColor ? pageData.iconBgColor : "#1A1A1E"
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
          <Text
            as="span"
            fontFamily="display"
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            noOfLines={1}
            zIndex={1}
            pl="16px"
          >
            {pageData.title}
          </Text>
        </Flex>
      </Flex>
    </Card>
  </Link>
)

export default PageDetailsCard
