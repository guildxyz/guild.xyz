import { Box, Heading, Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title?: string
  description?: string
}

const Section = ({
  title,
  description,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5}>
    {title && (
      <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
        {title}
      </Heading>
    )}

    {description && (
      <Text fontSize="sm" fontWeight="medium" colorScheme="gray">
        {description}
      </Text>
    )}

    <Box>{children}</Box>
  </Stack>
)

export default Section
