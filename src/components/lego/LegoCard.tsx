import { Box, Flex, Grid, GridItem, Heading, Icon, Img, Tag } from "@chakra-ui/react"
import Card from "components/common/Card"
import LinkButton from "components/common/LinkButton"
import { FilePdf } from "phosphor-react"

type Props = {
  href: string
  img: string
  name: string
  pieces: number
}

const LegoCard = ({ href, img, name, pieces }: Props): JSX.Element => (
  <Box borderRadius="2xl" overflow="hidden">
    <Card mt={8} overflow="visible">
      <Grid templateColumns="1fr 1fr" gap={{ base: 4, md: 0 }}>
        <GridItem>
          <Flex alignItems="end" h="full">
            <Img mt={-8} w="auto" h="auto" maxH={72} src={img} alt={name} />
          </Flex>
        </GridItem>

        <GridItem position="relative" py={7} pr={{ base: 5, md: 6 }}>
          <Flex direction="column" alignItems="start" h="full">
            <Heading
              as="h3"
              fontFamily="display"
              fontSize={{ base: "2xl", sm: "3xl" }}
              mb={{ base: 2, sm: 4 }}
            >
              {name}
            </Heading>
            <Tag mb={4} size={{ base: "sm", sm: "md" }}>
              {`${pieces} pieces`}
            </Tag>
            <LinkButton
              href={href}
              size="sm"
              rounded="lg"
              colorScheme="indigo"
              leftIcon={<Icon as={FilePdf} />}
              mt="auto"
              ml="auto"
              w="full"
            >
              Instructions
            </LinkButton>
          </Flex>
        </GridItem>
      </Grid>
    </Card>
  </Box>
)

export default LegoCard
