import { Heading, Img, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  title: string
  content: JSX.Element
  image: string
}

const ValueCard = ({ title, content, image }: Props): JSX.Element => (
  <Card
    position="relative"
    px={{ base: 5, sm: 6 }}
    py={7}
    maxW="calc(100% - 6rem)"
    overflow="visible"
  >
    <VStack spacing={2} alignItems="start" w="full" mb="1" mt="-1">
      <Heading
        as="h4"
        fontFamily="display"
        fontSize="2xl"
        fontWeight="bold"
        letterSpacing="wide"
      >
        {title}
      </Heading>
      {content}
    </VStack>

    <Img position="absolute" top={-2} right={-24} src={image} h={44} alt={title} />
  </Card>
)

export default ValueCard
