import { Heading, Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string | JSX.Element
  description?: string
}

const Section = ({
  title,
  description,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5}>
    <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
      {title}
    </Heading>

    {description && (
      <Text fontSize="sm" fontWeight="medium" colorScheme="gray">
        {description}
      </Text>
    )}

    {children}
  </Stack>
)

export default Section
