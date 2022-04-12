import { GridItem, Heading, Img, SimpleGrid, Text, VStack } from "@chakra-ui/react"

type Props = {
  title: string
  photo: string | JSX.Element
  content: string | JSX.Element
  flipped?: boolean
}

const LandingSection = ({ title, photo, content, flipped }: Props): JSX.Element => (
  <SimpleGrid
    columns={12}
    rowGap={{ base: 8, md: 0 }}
    columnGap={{ base: 0, md: 16 }}
    mb={{ base: 16, md: 28 }}
  >
    <GridItem colSpan={{ base: 12, md: 5 }} order={{ base: 1, md: flipped ? 2 : 1 }}>
      <VStack spacing={4} py={4} textAlign={{ base: "center", md: "left" }}>
        <Heading as="h3" fontFamily="display" fontSize="4xl">
          {title}
        </Heading>
        {typeof content === "string" ? (
          <Text fontSize="xl" fontWeight="medium" lineHeight="125%">
            {content}
          </Text>
        ) : (
          content
        )}
      </VStack>
    </GridItem>
    <GridItem colSpan={{ base: 12, md: 7 }} order={{ base: 2, md: flipped ? 1 : 2 }}>
      {typeof photo === "string" ? <Img w="full" src={photo} alt={title} /> : photo}
    </GridItem>
  </SimpleGrid>
)

export default LandingSection
