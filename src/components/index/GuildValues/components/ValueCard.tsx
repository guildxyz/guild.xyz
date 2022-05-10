import { Heading, Img, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"

type Props = {
  link: string
  title: string
  content: JSX.Element
  image: string
}

const ValueCard = ({ link, title, content, image }: Props): JSX.Element => (
  <Link href={link} isExternal w="full" _hover={{ textDecoration: "none" }}>
    <Card
      position="relative"
      px={{ base: 5, sm: 6 }}
      py={7}
      w="full"
      maxW={{ base: "full", md: "calc(100% - 6rem)" }}
      overflow="visible"
      _hover={{ bg: "gray.600" }}
      transition="background 0.2s ease"
    >
      <VStack spacing={3} alignItems="start" w="full" mt="-1">
        <Heading
          as="h4"
          fontFamily="display"
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          letterSpacing="wide"
        >
          {title}
        </Heading>
        {content}
      </VStack>

      <Img
        position="absolute"
        top={{ base: "auto", md: -2 }}
        bottom={{ base: -4, sm: "auto" }}
        right={{ base: -4, md: -24 }}
        src={image}
        h={{ base: 16, sm: 36, md: 44 }}
        alt={title}
      />
    </Card>
  </Link>
)

export default ValueCard
