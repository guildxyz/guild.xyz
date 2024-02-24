import { Container, Text } from "@chakra-ui/react"
import PageBuilder from "./components/PageBuilder"

const page = () => (
  <Container
    maxW="container.lg"
    py={{ base: 6, md: 9 }}
    px={{ base: 4, sm: 6, md: 8, lg: 10 }}
  >
    <Text fontFamily="display">Asd</Text>
    <PageBuilder />
  </Container>
)

export default page
