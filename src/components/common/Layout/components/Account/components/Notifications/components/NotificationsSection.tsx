import { Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren, ReactNode } from "react"

type Props = {
  title: string | ReactNode
}

const NotificationsSection = ({ title, children }: PropsWithChildren<Props>) => (
  <Stack spacing={0} px={4}>
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
