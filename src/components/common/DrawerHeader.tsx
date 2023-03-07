import { Heading, HStack, StackProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
}

const DrawerHeader = ({
  title,
  children,
  ...stackProps
}: PropsWithChildren<Props> & StackProps): JSX.Element => (
  <HStack justifyContent="space-between" py={2} mb={10} mr="-2" {...stackProps}>
    <Heading as="h2" fontSize="24px" fontFamily="display">
      {title}
    </Heading>
    {children}
  </HStack>
)

export default DrawerHeader
