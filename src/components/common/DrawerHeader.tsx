import { Heading, HStack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
}

const DrawerHeader = ({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <HStack justifyContent="space-between" mb={8}>
    <Heading as="h3" mb={8} fontFamily="display">
      {title}
    </Heading>
    {children}
  </HStack>
)

export default DrawerHeader
