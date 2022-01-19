import { Heading, HStack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
}

const DrawerHeader = ({
  title,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <HStack justifyContent="space-between" py={2} mb={10} mr="-2">
    <Heading as="h2" fontSize="24px" fontFamily="display">
      {title}
    </Heading>
    {children}
  </HStack>
)

export default DrawerHeader
