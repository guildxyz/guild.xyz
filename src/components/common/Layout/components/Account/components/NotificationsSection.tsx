import { Stack, StackProps, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
} & StackProps

const NotificationsSection = ({ title, children }: PropsWithChildren<Props>) => (
  <Stack spacing={0}>
    <Text
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
      colorScheme="gray"
    >
      {title}
    </Text>
    {children}
  </Stack>
)

export default NotificationsSection
