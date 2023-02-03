import { Card, Center, Heading, HStack } from "@chakra-ui/react"
import Link from "components/common/Link"
import Image from "next/image"
import slugify from "slugify"
import { BrainCardData } from "types"
type Props = {
  pageData: BrainCardData
}

const PageBrainCard = ({ pageData }: Props): JSX.Element => {
  const slugifiedTitle = slugify(pageData.title, { lower: true })

  return (
    <Link
      href={`/brain/${slugifiedTitle}`}
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
        background="rgba(63,63,70, 0.45)"
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
          borderRadius: "2xl",
        }}
        _hover={{
          _before: {
            opacity: 0.1,
          },
        }}
      >
        <HStack>
          {pageData.icon && (
            <Center boxSize={10} position="relative" mr={2}>
              <Image
                src={pageData.icon}
                layout="fill"
                objectFit="contain"
                quality="10"
                priority={true}
                style={{
                  overflow: "visible",
                }}
                alt="logo"
              ></Image>
            </Center>
          )}
          <Heading
            as="span"
            fontFamily="display"
            fontSize="lg"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
          >
            {pageData.title}
          </Heading>
        </HStack>
      </Card>
    </Link>
  )
}

export default PageBrainCard
