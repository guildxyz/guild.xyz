import { Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = { title: string }

const SuggestionsSection = ({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack py={2} fontSize="sm" spacing={0}>
    <Text
      colorScheme="gray"
      fontWeight="bold"
      textTransform="uppercase"
      px={4}
      py={2}
    >
      {title}
    </Text>

    {children}
  </Stack>
)

export default SuggestionsSection
