import { Box, Container, useColorModeValue, VStack } from "@chakra-ui/react"
import Head from "next/head"
import { PropsWithChildren } from "react"

type Props = {
  title: string
}

const SimpleLayout = ({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const bgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box bgColor={bgColor} minHeight="100vh" display="flex" flexDir="column">
        <Container
          maxW="container.lg"
          pt={{ base: 6, md: 9 }}
          pb={24}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <VStack spacing={{ base: 7, md: 10 }} pb={{ base: 9, md: 14 }} w="full">
            {children}
          </VStack>
        </Container>
      </Box>
    </>
  )
}

export default SimpleLayout
